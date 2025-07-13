import CtrlKnitIcon from "../ui/icons/CtrlKnitIcon";
import ProjectListButton from "../ui/ProjectListButton";
import { SyncButton } from "../ui/SyncButton";
import { ThemeToggle } from "../ui/ThemeToggle";

function Header() {
  return (
    <header className="card card-border shadow-neutral/10 bg-base-300/30 sticky top-0 z-10 w-full grow-0 p-1.5 pb-1 shadow-sm inset-shadow-xs backdrop-blur-sm">
      <div className="navbar m-0 min-h-10 p-0 px-2 pr-1.5">
        <div className="flex grow items-center justify-start gap-2 sm:gap-3">
          <CtrlKnitIcon />
          <span className="inline-block lg:hidden">
            <ThemeToggle />
          </span>
        </div>
        <span className="hidden pr-2 lg:inline-block">
          <ThemeToggle />
        </span>
        <div className="flex grow items-center justify-end lg:hidden">
          <div className="flex items-stretch">
            <ProjectListButton />
          </div>
        </div>
        <span className="lg:hidden">
          <SyncButton />
        </span>
      </div>
    </header>
  );
}

export default Header;
