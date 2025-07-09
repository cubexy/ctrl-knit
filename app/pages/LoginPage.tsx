import SyncStatusModal from "~/components/ui/modals/SyncStatusModal";
import { useDatabase } from "~/contexts/DatabaseContext";

function LoginPage() {
  const { authStatus, remoteLogin } = useDatabase();

  return (
    <>
      <SyncStatusModal connection={authStatus} onLogin={remoteLogin} onLogout={() => {}} />
    </>
  );
}

export default LoginPage;
