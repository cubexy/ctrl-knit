import { useState } from "react";
import { LocalStorageController } from "~/hooks/api/LocalStorageController";
import type { DatabaseConnectionPresentation } from "~/models/presenter/DatabaseConnectionPresentation";
import CloudIcon from "../icons/CloudIcon";

export type LoginParameters = {
  username: string;
  password: string;
  hostname: string;
  dbName: string;
};

type SyncStatusModalProps = {
  connection: DatabaseConnectionPresentation;
  onLogin: (login: LoginParameters) => void;
  onLogout: () => void;
};

let remoteDbHostInfo: { hostname: string; dbName: string } | null = null;

if (typeof window !== "undefined") {
  remoteDbHostInfo = LocalStorageController.getRemoteDb();
}
function SyncStatusModal(props: SyncStatusModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hostname, setHostname] = useState(remoteDbHostInfo?.hostname || "");
  const [dbName, setDbName] = useState(remoteDbHostInfo?.dbName || "");

  const onLogin = () => {
    props.onLogin({ username, password, hostname, dbName });
    resetCredentials();
  };

  const onLogout = () => {
    props.onLogout();
  };

  const resetCredentials = () => {
    setUsername((_) => "");
    setPassword((_) => "");
    setHostname((_) => "");
    setDbName((_) => "");
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box shadow-base-200 w-full max-w-xl gap-0 border p-4 pt-2 shadow-lg">
          <legend className="fieldset-legend text-lg">
            <CloudIcon strokeWidth={2} className="fill-neutral-content mr-1 size-5" /> Bei CouchDB anmelden
          </legend>
          {!props.connection.loggedIn && (
            <>
              <p className="label text-wrap break-all">
                Melde dich direkt mit deinen Anmeldedaten an (d)einem CouchDB-Server an!
              </p>
              <legend className="fieldset-legend">Nutzername</legend>
              <input
                type="email"
                className="input w-full"
                placeholder="strickmaus"
                disabled={props.connection.disabled}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <legend className="fieldset-legend">Passwort</legend>
              <input
                type="password"
                className="input w-full"
                placeholder="********"
                disabled={props.connection.disabled}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <legend className="fieldset-legend">Hostname</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="strick.dackel.dev"
                disabled={props.connection.disabled}
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
              />
              <legend className="fieldset-legend">Datenbankname</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="ctrl-knit_maus"
                disabled={props.connection.disabled}
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
              />
              <button className="btn btn-neutral mt-4" disabled={props.connection.disabled} onClick={onLogin}>
                Login
              </button>
            </>
          )}
          {props.connection.loggedIn && (
            <>
              <div className="label text-wrap break-all">
                <p>
                  Angemeldet als {props.connection.username}@{props.connection.dbString}!
                </p>
              </div>
              <button className="btn btn-neutral mt-4" disabled={props.connection.disabled} onClick={onLogout}>
                Logout
              </button>
            </>
          )}
          <div className="divider my-2 w-full">STATUS</div>
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex w-full flex-row items-center justify-start gap-2 px-1">
              {props.connection.status.type === "status-success" && (
                <div className="inline-grid pb-0.5 *:[grid-area:1/1]">
                  <div className="status status-success animate-ping"></div>
                  <div className="status status-success"></div>
                </div>
              )}
              {props.connection.status.type === "status-warning" && (
                <div className="inline-grid pb-0.5 *:[grid-area:1/1]">
                  <div className="status status-warning animate-ping"></div>
                  <div className="status status-warning"></div>
                </div>
              )}
              {props.connection.status.type === "status-error" && (
                <div className="inline-grid pb-0.5 *:[grid-area:1/1]">
                  <div className="status status-error animate-ping"></div>
                  <div className="status status-error"></div>
                </div>
              )}
              <p>{props.connection.status.message}</p>
            </div>
            {props.connection.status.loading && <span className="loading loading-spinner loading-xs"></span>}
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default SyncStatusModal;
