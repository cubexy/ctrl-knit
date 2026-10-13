import { useRef } from "react";
import { Outlet } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import WelcomePopover from "../ui/popover/WelcomePopover";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";

function RootLayout() {
  const welcomePopoverRef = useRef<HTMLDialogElement>(null);
  const { databaseError } = useDatabase();

  return (
    <div className="flex min-h-screen w-screen flex-row justify-center font-mono">
      <div className="h-dvh max-w-0 grow py-4 transition-normal duration-300 ease-out lg:max-w-80 lg:pl-4">
        <Sidebar />
      </div>
      <div
        className="flex max-h-screen grow flex-col items-center gap-5 overflow-auto p-4"
        style={{ scrollbarGutter: "stable" }}
      >
        <Header />
        {databaseError && (
          <div role="alert" className="alert alert-error w-full shrink-0">
            <span>{databaseError}</span>
          </div>
        )}
        <WelcomePopover ref={welcomePopoverRef} />
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
