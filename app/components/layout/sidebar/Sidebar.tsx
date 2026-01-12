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
    <div className="bg-neutral text-neutral-content hidden min-h-full flex-col gap-6 rounded-2xl p-3 shadow-sm inset-shadow-xs lg:flex">
      <div className="flex flex-row items-center justify-between">
        <Link to="/" className="w-fit" viewTransition>
          <WoolIcon className="fill-base-300 size-8 w-fit" strokeWidth={2} />
        </Link>
        <span className="text-neutral">
          <SyncButton />
        </span>
      </div>
      <div className="flex flex-col gap-4 px-0.5">
        <button className="btn btn-dash w-full" onClick={handleShow}>
          <AddIcon className="size-4 stroke-current" strokeWidth={1.5} />
          <p className="text-nowrap">Projekt erstellen</p>
        </button>
        <hr className="divider divider-primary text-neutral-content/50 fill-base-content m-0 h-px rounded-none" />
        <ProjectListDisplay currentProjectId={id} />
        <hr className="divider divider-primary text-neutral-content/50 fill-base-content m-0 h-px rounded-none" />
        <SidebarFooter />
      </div>
    </div>
  );
}

export default Sidebar;
