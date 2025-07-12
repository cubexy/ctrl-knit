import { useState } from "react";
import { useDatabase } from "~/contexts/DatabaseContext";
import { LocalStorageController, type RemoteDbHostInfo } from "~/hooks/api/LocalStorageController";
import ConnectionStatusDisplay from "../displays/ConnectionStatusDisplay";
import CloudIcon from "../icons/CloudIcon";

let remoteDbHostInfo: RemoteDbHostInfo = null;
if (typeof window !== "undefined") {
  remoteDbHostInfo = LocalStorageController.getRemoteDb();
}

function SyncStatusModal() {
  const { authStatus, remoteLogin, signOut } = useDatabase();

  const DEFAULT_HOSTNAME = remoteDbHostInfo?.hostname || "";
  const DEFAULT_DB_NAME = remoteDbHostInfo?.dbName || "";
  const DEFAULT_USERNAME = "";
  const DEFAULT_PASSWORD = "";

  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [hostname, setHostname] = useState(DEFAULT_HOSTNAME);
  const [dbName, setDbName] = useState(DEFAULT_DB_NAME);

  const onLogin = () => {
    remoteLogin({ username, password, hostname, dbName });
    resetCredentials();
  };

  const onLogout = () => {
    signOut();
  };

  const resetCredentials = () => {
    setUsername((_) => DEFAULT_USERNAME);
    setPassword((_) => DEFAULT_PASSWORD);
    setHostname((_) => DEFAULT_HOSTNAME);
    setDbName((_) => DEFAULT_DB_NAME);
  };

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box shadow-base-200 w-full max-w-xl gap-0 border p-4 pt-2 shadow-lg">
      <legend className="fieldset-legend text-lg">
        <CloudIcon strokeWidth={2} className="size-5 stroke-current" /> Bei CouchDB anmelden
      </legend>
      {!authStatus.loggedIn && (
        <>
          <p className="label text-wrap break-all">
            Melde dich direkt mit deinen Anmeldedaten an (d)einem CouchDB-Server an!
          </p>
          <legend className="fieldset-legend">Nutzername</legend>
          <input
            type="email"
            className="input w-full"
            placeholder="strickmaus"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <legend className="fieldset-legend">Passwort</legend>
          <input
            type="password"
            className="input w-full"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <legend className="fieldset-legend">Hostname</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="strick.dackel.dev"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          />
          <legend className="fieldset-legend">Datenbankname</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="ctrl-knit_maus"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
          />
          <button className="btn btn-neutral mt-4" onClick={onLogin}>
            Login
          </button>
        </>
      )}
      {authStatus.loggedIn && (
        <>
          <div className="label text-wrap break-normal">
            <p>
              Angemeldet als {authStatus.username}@{authStatus.dbString}
            </p>
          </div>
          <button className="btn btn-neutral mt-4" disabled={authStatus.disabled} onClick={onLogout}>
            Logout
          </button>
        </>
      )}
      <div className="divider my-2 w-full">STATUS</div>
      <ConnectionStatusDisplay displayStatusText pingAnimation />
    </fieldset>
  );
}

export default SyncStatusModal;
