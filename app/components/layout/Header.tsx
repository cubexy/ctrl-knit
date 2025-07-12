import { useCallback, useRef } from "react";
import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import AddIcon from "../ui/icons/AddIcon";
import DatabaseIcon from "../ui/icons/DatabaseIcon";
import CreateProjectPopover from "../ui/popover/CreateProjectPopover";
import { SyncButton } from "../ui/SyncButton";
import { ThemeToggle } from "../ui/ThemeToggle";

function Header() {
  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    createProjectModalRef.current?.showModal();
  }, [createProjectModalRef]);

  const { getProjectList } = useDatabase();
  const projects = getProjectList();

  return (
    <div className="navbar m-0 min-h-10 p-0 px-2 pr-1.5">
      <div className="flex grow items-center justify-start gap-2 sm:gap-3">
        <Link
          to="/"
          className="flex flex-row items-center justify-center gap-x-0.5 transition-normal duration-300 ease-in-out hover:scale-105 sm:gap-x-1.5"
        >
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
      <span className="lg:hidden">
        <SyncButton />
      </span>
    </div>
  );
}

export default Header;
