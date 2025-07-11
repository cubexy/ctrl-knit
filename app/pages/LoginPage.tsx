import SyncStatusModal from "~/components/ui/modals/SyncStatusModal";
import { useDatabase } from "~/contexts/DatabaseContext";

function LoginPage() {
  const { authStatus, remoteLogin, signOut } = useDatabase();

  return (
    <>
      <SyncStatusModal connection={authStatus} onLogin={remoteLogin} onLogout={signOut} />
    </>
  );
}

export default LoginPage;
