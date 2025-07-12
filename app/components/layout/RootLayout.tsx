import { Outlet } from "react-router";
import { DatabaseProvider } from "~/contexts/DatabaseContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

function RootLayout() {
  return (
    <DatabaseProvider>
      <div className="flex min-h-screen w-screen flex-row justify-center font-mono">
        <div className="h-full max-w-0 grow py-5 transition-normal duration-300 ease-out lg:max-w-80 lg:pl-5">
          <Sidebar />
        </div>
        <div
          className="flex max-h-screen flex-grow flex-col items-center gap-5 overflow-auto p-5"
          style={{ scrollbarGutter: "stable" }}
        >
          <header className="card card-border shadow-neutral/15 sticky top-0 z-10 w-full grow-0 p-1.5 pb-1 shadow-sm inset-shadow-xs backdrop-blur-sm">
            <Header />
          </header>
          <Outlet />
        </div>
      </div>
    </DatabaseProvider>
  );
}

export default RootLayout;
