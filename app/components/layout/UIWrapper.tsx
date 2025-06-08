import { Outlet } from "react-router";
import Header from "./Header";

function UIWrapper() {
  return (
    <div
      className="flex justify-center w-screen min-h-screen"
      data-theme="mytheme"
    >
      <div className="w-5xl max-w-5xl py-4 px-10 flex flex-col gap-4">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default UIWrapper;
