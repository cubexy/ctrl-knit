import { useCallback, useRef } from "react";
import { Link } from "react-router";
import { useDatabase } from "~/hooks/useDatabase";
import AddIcon from "../ui/icons/AddIcon";
import CreateProjectPopover from "../ui/popover/CreateProjectPopover";
import { ThemeToggle } from "../ui/ThemeToggle";

function Header() {
  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    createProjectModalRef.current?.showModal();
  }, [createProjectModalRef]);

  const { getProjectList } = useDatabase();
  const projects = getProjectList();

  return (
    <div className="navbar min-h-0 p-0">
      <div className="flex grow items-center justify-start gap-2">
        <Link to="/" className="flex flex-row flex-wrap items-center justify-center gap-x-1.5">
          <kbd className="kbd">ctrl</kbd>
          <p> + </p>
          <kbd className="kbd">knit</kbd>
        </Link>
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
          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost rounded-field">
              Projekte
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-200 rounded-box shadow-neutral/15 z-1 mt-4 w-52 p-2 shadow-sm"
            >
              <li>
                <a onClick={handleShow}>
                  <AddIcon className="size-5" strokeWidth={2} />
                  Neues Projekt erstellen
                </a>
              </li>
              <hr className="fill-base-content m-2 h-px rounded-none" />
              {projects.map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}`}>{project.name} </Link>
                </li>
              ))}
              {projects.length === 0 && (
                <li>
                  <span className="text-sm text-gray-500">Erstelle dein erstes Projekt!</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
