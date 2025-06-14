import { Outlet } from "react-router";
import { useDatabase } from "~/hooks/useDatabase";
import Header from "./Header";

function RootLayout() {
  useDatabase();

  return (
    <div className="flex min-h-screen w-screen justify-center" data-theme="mylight">
      <div className="flex w-5xl max-w-5xl flex-col gap-4 px-10 py-4 pb-10">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
