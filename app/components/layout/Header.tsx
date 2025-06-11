import { useCallback, useRef } from "react";
import { Link } from "react-router";
import CreateProjectPopover from "../ui/popover/CreateProjectPopover";

function Header() {
  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    createProjectModalRef.current?.showModal();
  }, [createProjectModalRef]);
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>{" "}
                  Neues Projekt erstellen
                </a>
              </li>
              <hr className="fill-base-content m-2 h-px rounded-none" />
              <li>
                <a>Special Sweater</a>
              </li>
              <li>
                <a>Knit Shit</a>
              </li>
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
