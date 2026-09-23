import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import ConnectionStatusDisplay from "./displays/ConnectionStatusDisplay";
import CloudIcon from "./icons/CloudIcon";
import LocalIconFilled from "./icons/LocalIconFilled";

export function SyncButton({ quiet = false }: { quiet?: boolean }) {
  const { authStatus } = useDatabase();

  return (
    <Link
      to="/sync"
      viewTransition
      aria-label="Synchronisierung verwalten"
      title={authStatus.loggedIn ? "Synchronisierung verwalten" : "Lokal gespeichert · Synchronisierung einrichten"}
      className={`btn flex items-center gap-2 px-3 ${quiet ? "btn-ghost text-base-content/60 min-h-11 font-normal" : `${authStatus.loggedIn ? "hover:btn-success" : "hover:btn-error"} sm:w-26`}`}
    >
      {authStatus.loggedIn ? (
        <CloudIcon className="size-3 fill-current" strokeWidth={2} />
      ) : (
        <LocalIconFilled className="size-3 fill-current" />
      )}
      <span className={quiet ? "" : "xs:block hidden"}>{authStatus.loggedIn ? "Sync" : "Lokal"}</span>
      {(!quiet || authStatus.loggedIn) && <ConnectionStatusDisplay displayStatusText={false} pingAnimation={false} />}
    </Link>
  );
}
