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
          {authStatus.loggedIn ? (
            <>
              <CloudIconFilled className="size-3" />
              Sync
            </>
          ) : (
            <>
              <LocalIconFilled className="size-3" />
              Lokal
            </>
          )}
        </span>
        {authStatus.status.loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <div className="inline-grid *:[grid-area:1/1]">
            <div className={`status ${authStatus.status.type}`}></div>
          </div>
        )}
      </button>
    </Link>
  );
}
