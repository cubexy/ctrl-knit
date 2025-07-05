import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

function RootLayout() {
  return (
    <div className="flex min-h-screen w-screen flex-row justify-center font-mono">
      <div className="min-h-full max-w-0 grow transition-normal duration-300 ease-in-out lg:max-w-80 lg:p-5 lg:pr-0">
        <Sidebar />
      </div>
      <div
        className="p5-10 flex max-h-screen flex-grow flex-col items-center gap-8 overflow-y-auto py-4 pr-2 pl-5"
        style={{ scrollbarGutter: "stable right" }}
      >
        <header className="rounded-box shadow-neutral/15 sticky top-1 z-10 w-full grow-0 py-2 pr-2 pl-4 shadow-sm inset-shadow-xs backdrop-blur-sm">
          <Header />
        </header>
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
