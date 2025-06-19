import { useCallback, useRef } from "react";
import { Link } from "react-router";
import { useDatabase } from "~/hooks/useDatabase";
import AddIcon from "../ui/icons/AddIcon";
import CreateProjectPopover from "../ui/popover/CreateProjectPopover";

function Header() {
  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    createProjectModalRef.current?.showModal();
  }, [createProjectModalRef]);

  const { getProjectList } = useDatabase();

  return (
    <div className="navbar p-0">
      <Link to="/" className="flex flex-row flex-wrap items-center justify-center gap-x-1.5">
        <kbd className="kbd">ctrl</kbd>
        <p className="font-mono"> + </p>
        <kbd className="kbd">knit</kbd>
      </Link>
      <CreateProjectPopover ref={createProjectModalRef} />
      <div className="flex grow items-center justify-end">
        <div className="flex items-stretch">
          <div className="dropdown dropdown-bottom dropdown-center">
            <div tabIndex={0} role="button" className="btn btn-ghost rounded-field">
              Projekte
            </div>
            <ul tabIndex={0} className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm">
              <li>
                <a onClick={handleShow}>
                  <AddIcon className="size-5" strokeWidth={2} />
                  Neues Projekt erstellen
                </a>
              </li>
              <hr className="fill-base-content m-2 h-px rounded-none" />
              {getProjectList().map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}`}>
                    {project.name}{" "}
                    <span className="text-xs opacity-50">({new Date(project.updatedAt).toLocaleDateString()})</span>
                  </Link>
                </li>
              ))}
              {getProjectList().length === 0 && (
                <li>
                  <span className="text-sm text-gray-500">Erstelle dein erstes Projekt!</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex items-stretch">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost rounded-field">
              Account
            </div>
            <ul tabIndex={0} className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm">
              <li>
                <a>Einstellungen</a>
              </li>
              <li>
                <a>Abmelden</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
