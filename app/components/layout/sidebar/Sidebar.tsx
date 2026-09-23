import { Link, useParams } from "react-router";
import { useProjectPopover } from "~/contexts/ProjectPopoverContext";
import { SyncButton } from "../../ui/SyncButton";
import ProjectListDisplay from "../../ui/displays/ProjectListDisplay";
import AddIcon from "../../ui/icons/AddIcon";
import WoolIcon from "../../ui/icons/WoolIcon";
import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  let { id } = useParams();
  const { handleShow } = useProjectPopover();
  return (
    <aside
      aria-label="Projekte"
      className="bg-base-200/60 hidden h-full min-h-0 flex-col gap-6 rounded-2xl p-3 lg:flex"
    >
      <div className="flex shrink-0 items-center px-2 pt-2">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 rounded-lg text-sm"
          viewTransition
          aria-label="Projektübersicht öffnen"
        >
          <WoolIcon className="fill-base-content/40 size-7" strokeWidth={1.5} />
          Projekte
        </Link>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <button
          type="button"
          className="btn btn-ghost text-base-content/75 min-h-11 w-full shrink-0 justify-start gap-3 px-3 font-normal"
          onClick={handleShow}
        >
          <AddIcon className="size-4 stroke-current" strokeWidth={1.5} />
          Neues Projekt
        </button>
        <ProjectListDisplay currentProjectId={id} />
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2">
        <SyncButton quiet />
        <SidebarFooter />
      </div>
    </aside>
  );
}

export default Sidebar;
