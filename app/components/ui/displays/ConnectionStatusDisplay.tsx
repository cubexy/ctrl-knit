import { useDatabase } from "~/contexts/DatabaseContext";

type ConnectionStatusDisplayProps = {
  displayStatusText: boolean;
  pingAnimation: boolean;
};

function ConnectionStatusDisplay(props: ConnectionStatusDisplayProps) {
  const { authStatus } = useDatabase();

  return (
    <div className="flex h-fit w-fit flex-row items-center justify-between">
      <div className="flex w-full flex-row items-center justify-start gap-2">
        <div className={`inline-grid *:[grid-area:1/1] ${props.displayStatusText && "pb-0.5"}`}>
          {props.pingAnimation && <div className={`status ${authStatus.status.type} animate-ping`}></div>}
          <div className={`status ${authStatus.status.type}`}></div>
        </div>
        {props.displayStatusText && <p>{authStatus.status.message}</p>}
      </div>
      {authStatus.status.loading && <span className="loading loading-spinner loading-xs"></span>}
    </div>
  );
}

export default ConnectionStatusDisplay;
