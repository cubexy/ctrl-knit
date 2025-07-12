import { useRef } from "react";
import CtrlKnitIcon from "../ui/icons/CtrlKnitIcon";
import CreateProjectPopover from "../ui/popover/CreateProjectPopover";
import ProjectListButton from "../ui/ProjectListButton";
import { SyncButton } from "../ui/SyncButton";
import { ThemeToggle } from "../ui/ThemeToggle";

function Header() {
  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  return (
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
      <CreateProjectPopover ref={createProjectModalRef} />
      <div className="flex grow items-center justify-end lg:hidden">
        <div className="flex items-stretch">
          <ProjectListButton createProjectModalRef={createProjectModalRef} />
        </div>
      </div>
      <span className="lg:hidden">
        <SyncButton />
      </span>
    </div>
  );
}

export default Header;
