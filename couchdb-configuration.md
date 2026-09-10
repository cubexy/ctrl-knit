# Connect ctrl-knit to CouchDB

`ctrl-knit` stores data locally in the browser and can optionally replicate it to a CouchDB database. It connects directly from the browser to CouchDB; it does not provide account registration, database creation, password reset, or permission management.

This guide describes a small, single-node CouchDB installation for people who want to host their own sync service. Replace every value in angle brackets before using a command.

## What you need

- A server that can run Docker and NGINX.
- A DNS name for CouchDB, such as `couch.example.com`.
- A trusted TLS certificate for that DNS name. ctrl-knit only connects over HTTPS.
- The exact public origin of your ctrl-knit installation, such as `https://ctrl-knit.example.com`. It is needed for CORS.

Use a CouchDB hostname under the same site as ctrl-knit where possible. For example, use `couch.ctrl-knit.example.com` for an app at `https://ctrl-knit.example.com`. The two hosts are still different origins and require CORS, but browsers treat their cookies as same-site. A CouchDB host on an unrelated site may not work in browsers that block third-party cookies.

## 1. Run CouchDB

The official `apache/couchdb` Docker image exposes CouchDB on port `5984` and stores data in `/opt/couchdb/data`. Do not publish port `5984` to the Internet; make it reachable only from NGINX on an internal Docker network.

Example Compose service:

```yaml
services:
  couchdb:
    image: apache/couchdb:3.5.2
    restart: unless-stopped
    environment:
      COUCHDB_USER: <server-admin-name>
      COUCHDB_PASSWORD: <server-admin-password>
      COUCHDB_SECRET: <persistent-random-secret>
    volumes:
      - couchdb-data:/opt/couchdb/data
      - ./couchdb/20-ctrl-knit.ini:/opt/couchdb/etc/local.d/20-ctrl-knit.ini:ro
    networks:
      - private

volumes:
  couchdb-data:
```

`COUCHDB_USER` and `COUCHDB_PASSWORD` create the required CouchDB server administrator. `COUCHDB_SECRET` must be a securely generated value that remains unchanged across restarts; CouchDB uses it to sign session cookies.

The configuration file in the volume mount is created in the next step. If CouchDB is already running for another application, add the settings to its existing persistent configuration instead of running a second CouchDB server.

## 2. Configure CouchDB authentication and CORS

Create `couchdb/20-ctrl-knit.ini` next to the Compose file:

```ini
[couchdb]
single_node = true

[chttpd]
enable_cors = true

[chttpd_auth]
allow_persistent_cookies = true
timeout = 86400

[cors]
credentials = true
origins = https://<ctrl-knit-hostname>
methods = GET, POST, PUT, DELETE, HEAD
headers = accept, authorization, content-type, origin, referer, x-csrf-token, if-match, x-couchdb-www-authenticate
max_age = 3600
```

For an app at `https://ctrl-knit.example.com`, the `origins` value is exactly:

```ini
origins = https://ctrl-knit.example.com
```

Important rules:

- Do not use `origins = *` with `credentials = true`.
- Do not add `OPTIONS` to `methods`; CouchDB handles CORS preflight requests.
- Do not set `chttpd_auth.cookie_domain`; the session cookie should remain tied to the CouchDB hostname.
- Do not enable `chttpd.require_valid_user`; unauthenticated users must be able to call `POST /_session` to log in.
- If NGINX adds the `SameSite` cookie attribute as shown below, leave CouchDB's `chttpd_auth.same_site` unset. Emitting it twice produces an invalid or browser-dependent cookie.

The `single_node` setting creates CouchDB's required system databases on startup. Restart CouchDB after adding the configuration.

## 3. Put NGINX in front of CouchDB

Terminate TLS at NGINX and proxy to CouchDB over the private network. Replace `<couchdb-container>` with the Compose service/container hostname and `<couchdb-hostname>` with the public DNS name.

```nginx
server {
    listen 443 ssl;
    server_name <couchdb-hostname>;

    ssl_certificate /etc/letsencrypt/live/<couchdb-hostname>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<couchdb-hostname>/privkey.pem;

    client_max_body_size 256M;

    location / {
        proxy_pass http://<couchdb-container>:5984;
        proxy_http_version 1.1;

        # Required: PouchDB live replication uses CouchDB's streaming changes feed.
        proxy_buffering off;
        proxy_request_buffering off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header Connection "";

        # Prevent browser Basic-auth dialogs when cookie login fails.
        proxy_hide_header WWW-Authenticate;

        # Needed when the app and CouchDB are on different sites.
        proxy_cookie_path / "/; Secure; HttpOnly; SameSite=None; Partitioned";
    }
}
```

`proxy_buffering off` is essential. CouchDB's documentation states that continuous replication does not work correctly behind NGINX buffering.

Let CouchDB produce the CORS headers from its configuration. Do not add unconditional `Access-Control-Allow-*` headers in NGINX.

### Avoiding browser Basic-auth prompts

ctrl-knit authenticates by posting credentials to `/_session` and then uses CouchDB's session cookie. If cookie authentication fails, CouchDB's default `WWW-Authenticate: Basic realm="couchdb"` response can make browsers show an unwanted Basic-auth prompt.

The recommended solution is the `proxy_hide_header WWW-Authenticate` line in the API-host configuration above. It changes only the public ctrl-knit API response and allows Fauxton to remain available on the separate admin hostname.

If a reverse proxy cannot be used, CouchDB can instead be configured with the following setting:

```ini
[httpd]
WWW-Authenticate = Other realm="app"
```

Do not use both approaches. The CouchDB-only alternative affects every host served by that CouchDB instance and can prevent Fauxton authentication, which is why the separate NGINX API/admin hosts are preferred.

## 4. Optional: expose Fauxton separately

Fauxton is CouchDB's administrative interface. The API host above suppresses `WWW-Authenticate`, which avoids browser login prompts for ctrl-knit but also makes it unsuitable for Fauxton administration.

Use a separate hostname such as `couch-admin.example.com`, proxying to the same CouchDB instance. Use the same NGINX settings but omit `proxy_hide_header WWW-Authenticate`:

```nginx
server {
    listen 443 ssl;
    server_name <couchdb-admin-hostname>;

    ssl_certificate /etc/letsencrypt/live/<couchdb-admin-hostname>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<couchdb-admin-hostname>/privkey.pem;

    location / {
        proxy_pass http://<couchdb-container>:5984;
        proxy_http_version 1.1;
        proxy_buffering off;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";

        proxy_cookie_path / "/; Secure; HttpOnly; SameSite=None; Partitioned";
    }
}
```

Open Fauxton at `https://<couchdb-admin-hostname>/_utils/` and use the server-admin account only for administration. Do not use that account in ctrl-knit.

## 5. Create a database and normal user

Each person should normally have a private database, such as `ctrl-knit_alice`. A user may use that same account and database on multiple devices.

Run these commands as a CouchDB server administrator. Avoid placing real passwords in shell history; use a password manager, a protected environment variable, or let `curl --user <admin-name>` prompt for the password.

Create the database:

```bash
curl --user '<server-admin-name>' \
  -X PUT 'https://<couchdb-hostname>/ctrl-knit_alice'
```

Create the normal user:

```bash
curl --user '<server-admin-name>' \
  -X PUT 'https://<couchdb-hostname>/_users/org.couchdb.user:alice' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "alice",
    "password": "<strong-user-password>",
    "roles": [],
    "type": "user"
  }'
```

CouchDB hashes the supplied password before storing the user document.

Grant the user access to the database:

```bash
curl --user '<server-admin-name>' \
  -X PUT 'https://<couchdb-hostname>/ctrl-knit_alice/_security' \
  -H 'Content-Type: application/json' \
  -d '{
    "admins": { "names": [], "roles": [] },
    "members": { "names": ["alice"], "roles": [] }
  }'
```

This makes `alice` a database member. Members can read and write normal documents, which is sufficient for ctrl-knit and PouchDB replication, but cannot change database security or create design documents. Do not grant users server-admin privileges.

To share a database, list every permitted username in `members.names`. All members can read and edit all normal documents in that database; ctrl-knit does not provide per-project access control.

## 6. Verify the setup

Check that the public proxy can reach CouchDB:

```bash
curl 'https://<couchdb-hostname>/_up'
```

Expected response:

```json
{"status":"ok"}
```

Check login and save the session cookie:

```bash
curl -i -c cookies.txt \
  -X POST 'https://<couchdb-hostname>/_session' \
  -H 'Content-Type: application/json' \
  -d '{"name":"alice","password":"<strong-user-password>"}'
```

Expect `200 OK` and a `Set-Cookie: AuthSession=...` header. With the NGINX configuration above, the cookie includes `Secure`, `HttpOnly`, `SameSite=None`, and `Partitioned`.

Check that the user can access only their database:

```bash
curl -b cookies.txt 'https://<couchdb-hostname>/ctrl-knit_alice'
```

Expect JSON containing `"db_name":"ctrl-knit_alice"`. An anonymous request or an account that is not a member should receive an unauthorized response.

## 7. Connect ctrl-knit

In ctrl-knit, open **Sync** and enter:

- **Username:** the normal CouchDB user name, for example `alice`.
- **Password:** that user's password.
- **Hostname:** the CouchDB hostname only, for example `couch.example.com`.
- **Database name:** the user's database, for example `ctrl-knit_alice`.

Do not include `https://`, a path, or a trailing slash in the hostname field. ctrl-knit builds URLs as `https://<hostname>/...`; a reverse-proxy subpath is not supported by the current connection form.

After login, ctrl-knit creates a local browser database named `ctrl-knit`, verifies the remote database, and starts live bidirectional sync. It stores the selected hostname and database name in local storage, but not the username or password.

Logging out stops sync and clears the CouchDB session cookie. It does not delete locally replicated browser data or forget the selected remote database.

## References

- [CouchDB Docker installation](https://docs.couchdb.org/en/3.5.x/install/docker.html)
- [CouchDB CORS configuration](https://docs.couchdb.org/en/3.5.x/config/http.html#cross-origin-resource-sharing)
- [CouchDB reverse proxies](https://docs.couchdb.org/en/3.5.x/best-practices/reverse-proxies.html)
- [CouchDB users and database security](https://docs.couchdb.org/en/3.5.x/intro/security.html)
