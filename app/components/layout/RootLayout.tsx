import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

function RootLayout() {
  return (
    <div className="flex min-h-screen w-screen flex-row justify-center font-mono">
      <div className="h-full max-w-0 grow py-5 transition-normal duration-300 ease-out lg:max-w-80 lg:pl-5">
        <Sidebar />
      </div>
      <div
        className="flex max-h-screen flex-grow flex-col items-center gap-5 overflow-auto p-5"
        style={{ scrollbarGutter: "stable" }}
      >
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
