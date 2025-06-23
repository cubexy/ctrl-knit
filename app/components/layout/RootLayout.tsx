import { useCallback, useRef } from "react";
import { Link, Outlet } from "react-router";
import { useDatabase } from "~/hooks/useDatabase";
import AddIcon from "../ui/icons/AddIcon";
import GithubIcon from "../ui/icons/GithubIcon";
import WoolIcon from "../ui/icons/WoolIcon";
import CreateProjectPopover from "../ui/popover/CreateProjectPopover";
import Header from "./Header";

function RootLayout() {
  useDatabase();

  const { getProjectList } = useDatabase();
  const projects = getProjectList();

  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    createProjectModalRef.current?.showModal();
  }, [createProjectModalRef]);

  return (
    <div className="flex min-h-screen w-screen flex-row justify-center font-mono">
      <div className="min-h-full max-w-0 grow transition-normal duration-300 ease-in-out lg:max-w-80 lg:p-5 lg:pr-0">
        <div className="bg-neutral text-neutral-content hidden min-h-full flex-col gap-6 rounded-2xl p-3 shadow-sm inset-shadow-xs lg:flex">
          <WoolIcon className="fill-base-300 size-8" strokeWidth={2} />
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
      </div>
      <CreateProjectPopover ref={createProjectModalRef} />
      <div className="p5-10 flex max-h-screen flex-grow flex-col items-center gap-8 overflow-y-auto px-5 py-4">
        <header className="rounded-box shadow-neutral/15 sticky top-1 z-10 w-full grow-0 py-2 pr-2 pl-4 shadow-sm inset-shadow-xs backdrop-blur-sm">
          <Header />
        </header>
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
