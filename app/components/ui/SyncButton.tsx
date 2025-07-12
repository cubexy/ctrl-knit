import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import ConnectionStatusDisplay from "./displays/ConnectionStatusDisplay";
import CloudIcon from "./icons/CloudIcon";
import LocalIconFilled from "./icons/LocalIconFilled";

export function SyncButton() {
  const { authStatus } = useDatabase();

  return (
    <Link to={`/sync`}>
      <button
        className={`btn ${authStatus.loggedIn ? "hover:btn-success" : "hover:btn-error"} flex flex-row items-center justify-between px-3`}
      >
        <span className="flex w-full flex-row items-center gap-1">
          <label className="swap">
            <input type="checkbox" checked={authStatus.loggedIn} readOnly />
            <CloudIcon className="swap-on size-3 fill-current" strokeWidth={2} />
            <LocalIconFilled className="swap-off size-3 fill-current" />
          </label>
          <p className="xs:block hidden">{authStatus.loggedIn ? "Sync" : "Lokal"}</p>
        </span>
        <ConnectionStatusDisplay displayStatusText={false} pingAnimation={false} />
      </button>
    </Link>
  );
}
