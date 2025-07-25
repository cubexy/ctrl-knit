import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import { useProjectPopover } from "~/contexts/ProjectPopoverContext";
import AddIcon from "./icons/AddIcon";
import DatabaseIcon from "./icons/DatabaseIcon";

function ProjectListButton() {
  const { handleShow } = useProjectPopover();

  const { getProjectList } = useDatabase();
  const projects = getProjectList();
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost rounded-field px-2 sm:px-4">
        <DatabaseIcon className="size-4 stroke-current sm:hidden" strokeWidth={1.5} />
        <p className="hidden sm:block">Projekte</p>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-200 rounded-box shadow-neutral/15 z-1 mt-4 w-52 p-2 shadow-sm"
      >
        <li>
          <a onClick={handleShow}>
            <AddIcon className="size-5 stroke-current" strokeWidth={2} />
            Neues Projekt erstellen
          </a>
        </li>
        <hr className="fill-base-content m-2 h-px rounded-none" />
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`} viewTransition>
              {project.name}{" "}
            </Link>
          </li>
        ))}
        {projects.length === 0 && (
          <li>
            <span className="text-sm text-gray-500">Erstelle dein erstes Projekt!</span>
          </li>
        )}
      </ul>
    </div>
  );
}

export default ProjectListButton;
