import { Outlet } from "react-router";
import { useDatabase } from "~/hooks/useDatabase";
import Header from "./Header";

function RootLayout() {
  useDatabase();

  return (
    <div className="flex min-h-screen w-screen justify-center pb-8 transition-colors duration-500">
      <div className="p5-10 flex w-5xl max-w-5xl flex-col items-center gap-8 px-5 py-4">
        <header className="rounded-box shadow-neutral/15 sticky top-5 z-10 w-full grow-0 py-2 pr-2 pl-4 shadow-sm inset-shadow-xs backdrop-blur-sm">
          <Header />
        </header>
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
