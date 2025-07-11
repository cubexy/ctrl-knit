# Neccessary CouchDB configurations

To access CouchDB and to use the tool correctly, you might need to change some settings in the CouchDB config.

- `httpd`

  - `WWW-Authenticate`

    - Set this value to `Other realm="app"`to supress the basic authentication window when cookie auth fails. This does not impact other systems that do not use the basic auth popup.
    - **!!! Note that this does disable the ability to authenticate to Fauxton! If you depend on Fauxton, rewriting the response to the session request is also possible with nginx.**
    - Original value: `Basic realm="couchdb"`

- `chttpd_auth`
  - `allow_persistent_cookies`
    - Set this value to `true` to persist cookies in the browser even after a restart.
  - `timeout`
    - Sets the timeout until the user needs to reauthenticate after not using the app. (I chose 86400 = 24h.)
