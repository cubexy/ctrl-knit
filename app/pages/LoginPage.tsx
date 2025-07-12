import SyncStatusModal from "~/components/ui/modals/SyncStatusModal";

function LoginPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <SyncStatusModal />
      </div>
    </div>
  );
}

export default LoginPage;
