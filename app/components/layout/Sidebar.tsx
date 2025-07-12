import { useCallback, useRef } from "react";
import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import { SyncButton } from "../ui/SyncButton";
import AddIcon from "../ui/icons/AddIcon";
import GithubIcon from "../ui/icons/GithubIconFilled";
import WoolIcon from "../ui/icons/WoolIcon";
import CreateProjectPopover from "../ui/popover/CreateProjectPopover";

function Sidebar() {
  const { getProjectList } = useDatabase();
  const projects = getProjectList();

  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    createProjectModalRef.current?.showModal();
  }, [createProjectModalRef]);
  return (
    <>
      <CreateProjectPopover ref={createProjectModalRef} />
      <div className="bg-neutral text-neutral-content hidden min-h-full flex-col gap-6 rounded-2xl p-3 shadow-sm inset-shadow-xs lg:flex">
        <div className="flex flex-row items-center justify-between">
          <Link to="/" className="w-fit">
            <WoolIcon className="fill-base-300 size-8 w-fit" strokeWidth={2} />
          </Link>
          <span className="text-neutral">
            <SyncButton />
          </span>
        </div>
        <div className="flex flex-col gap-4 px-0.5">
          <button className="btn btn-dash w-full" onClick={handleShow}>
            <AddIcon className="size-4" strokeWidth={1.5} />
            Projekt erstellen
          </button>
          <hr className="divider divider-primary text-neutral-content/50 fill-base-content m-0 h-px rounded-none" />
          <ul className="flex h-[calc(100dvh-236px)] w-full flex-col gap-3 overflow-y-auto">
            {projects.map((project) => (
              <li key={project.id} className="w-full">
                <Link to={`/projects/${project.id}`} className="w-full font-normal hover:font-bold">
                  <p>{project.name}</p>
                </Link>
              </li>
            ))}
            {projects.length === 0 && (
              <li>
                <span className="text-neutral-content/50 w-full text-sm">Erstelle dein erstes Projekt!</span>
              </li>
            )}
          </ul>
          <hr className="divider divider-primary text-neutral-content/50 fill-base-content m-0 h-px rounded-none" />
          <div className="flex flex-row items-center justify-between">
            <a href="https://github.com/cubexy/ctrl-knit" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="fill-neutral-content/50 size-5" />
            </a>
            <p className="text text-neutral-content/40 text-sm">{"made with ♡!"}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
