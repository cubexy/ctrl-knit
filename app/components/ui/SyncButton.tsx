import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import CloudIcon from "./icons/CloudIcon";
import LocalIcon from "./icons/LocalIcon";

export function SyncButton() {
  const { authStatus } = useDatabase();

  return (
    <Link to={`/sync`}>
      {!authStatus.loggedIn && (
        <button className="btn hover:btn-error w-30">
          <LocalIcon className="size-4" strokeWidth={2.5} />
          Lokal
        </button>
      )}
      {authStatus.loggedIn && (
        <button className="btn hover:btn-success w-30">
          <CloudIcon className="size-4" strokeWidth={2.5} />
          Sync
        </button>
      )}
    </Link>
  );
}
