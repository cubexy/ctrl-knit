import { Link, useParams } from "react-router";
import { useProjectPopover } from "~/contexts/ProjectPopoverContext";
import { SyncButton } from "../ui/SyncButton";
import ProjectListDisplay from "../ui/displays/ProjectListDisplay";
import AddIcon from "../ui/icons/AddIcon";
import GithubIcon from "../ui/icons/GithubIconFilled";
import WoolIcon from "../ui/icons/WoolIcon";

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
          Projekt erstellen
        </button>
        <hr className="divider divider-primary text-neutral-content/50 fill-base-content m-0 h-px rounded-none" />
        <ProjectListDisplay currentProjectId={id} />
        <hr className="divider divider-primary text-neutral-content/50 fill-base-content m-0 h-px rounded-none" />
        <div className="flex flex-row items-center justify-between">
          <a
            href="https://github.com/cubexy/ctrl-knit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center gap-1.5"
          >
            <GithubIcon className="fill-neutral-content/50 size-5" />
            <p className="text-neutral-content/40 text-sm hover:underline">{APP_VERSION}</p>
          </a>
          <p className="text text-neutral-content/40 text-sm">{"made with ♡!"}</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
