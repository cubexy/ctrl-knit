import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import { useProjectPopover } from "~/contexts/ProjectPopoverContext";
import type { ProjectListDisplayProps } from "./displays/ProjectListDisplay";
import AddIcon from "./icons/AddIcon";
import EditIcon from "./icons/EditIcon";
import HamburgerIcon from "./icons/HamburgerIcon";

function ProjectListButton(props: ProjectListDisplayProps) {
  const { handleShow } = useProjectPopover();

  const { getProjectList, initialLoadingDone } = useDatabase();
  const projects = getProjectList();

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost rounded-field px-2 sm:px-4">
        <HamburgerIcon className="size-4 stroke-current sm:hidden" strokeWidth={1.5} />
        <p className="hidden sm:block">Projekte</p>
      </div>
      <ul tabIndex={0} className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 max-w-52 p-2">
        <li>
          <a onClick={handleShow}>
            <AddIcon className="size-5 stroke-current" strokeWidth={2} />
            Neues Projekt erstellen
          </a>
        </li>
        <hr className="fill-base-content m-2 h-px rounded-none" />
        {!initialLoadingDone && <span className="loading loading-spinner loading-xl" />}
        {initialLoadingDone &&
          projects.map((project) => (
            <li key={project.id}>
              <Link
                to={`/projects/${project.id}`}
                viewTransition
                className={`flex w-full flex-col items-start justify-start ${props.currentProjectId === project.id && "bg-base-content text-base-300"}`}
              >
                <p className="break-all">{project.name}</p>
                {props.currentProjectId === project.id && (
                  <p className="text-base-300/50 flex items-center gap-2 text-xs">
                    <span aria-hidden="true">
                      <EditIcon className="size-3 stroke-current" strokeWidth={1.5} />
                    </span>
                    <span>
                      <span className="sr-only">zuletzt am </span>
                      {project.updatedAt}
                      <span className="sr-only"> geändert</span>
                    </span>
                  </p>
                )}
              </Link>
            </li>
          ))}
        {initialLoadingDone && projects.length === 0 && (
          <li>
            <span className="text-sm text-gray-500">Erstelle dein erstes Projekt!</span>
          </li>
        )}
      </ul>
    </div>
  );
}

export default ProjectListButton;
