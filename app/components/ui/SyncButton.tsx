import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import CloudIconFilled from "./icons/CloudIconFilled";
import LocalIconFilled from "./icons/LocalIconFilled";

export function SyncButton() {
  const { authStatus } = useDatabase();

  return (
    <Link to={`/sync`}>
      <button
        className={`btn ${authStatus.loggedIn ? "hover:btn-success" : "hover:btn-error"} flex w-30 flex-row items-center justify-between px-3`}
      >
        <span className="flex flex-row items-center gap-1">
          <label className="swap">
            <input type="checkbox" checked={authStatus.loggedIn} readOnly />
            <CloudIconFilled className="swap-on size-3 fill-current" />
            <LocalIconFilled className="swap-off size-3 fill-current" />
          </label>
          {authStatus.loggedIn ? "Sync" : "Lokal"}
        </span>
        {authStatus.status.loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <div className="inline-grid *:[grid-area:1/1]">
            <div className={`status ${authStatus.status.type} transition-colors duration-500`}></div>
          </div>
        )}
      </button>
    </Link>
  );
}
