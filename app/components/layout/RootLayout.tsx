import { useRef } from "react";
import { Outlet } from "react-router";
import WelcomePopover from "../ui/popover/WelcomePopover";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";

function RootLayout() {
  const welcomePopoverRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex min-h-screen w-screen flex-row justify-center font-mono">
      <div className="h-full max-w-0 grow py-5 transition-normal duration-300 ease-out lg:max-w-80 lg:pl-5">
        <Sidebar />
      </div>
      <div
        className="flex max-h-screen grow flex-col items-center gap-5 overflow-auto p-5"
        style={{ scrollbarGutter: "stable" }}
      >
        <Header />
        <WelcomePopover ref={welcomePopoverRef} />
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
