import { useCallback, useRef } from "react";
import WoolIcon from "../icons/WoolIcon";
import CreateProjectPopover from "../popover/CreateProjectPopover";

function NoProjectModal() {
  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    createProjectModalRef.current?.showModal();
  }, [createProjectModalRef]);

  return (
    <div className="hero h-full">
      <div className="hero-content text-center">
        <div className="flex max-w-lg flex-col items-center">
          <WoolIcon className="fill-base-300 size-36" strokeWidth={1} />
          <h1 className="text-4xl font-bold">Kein offenes Projekt</h1>
          <p className="text-md pt-2 pb-3">
            Du hast gerade noch kein Projekt geöffnet. Öffne oben über "Projekte" ein schon erstelltes Projekt oder fang
            hier ein neues an!
          </p>
          <button
            className="btn btn-primary btn-large transition-all duration-300 ease-in-out hover:scale-105"
            onClick={handleShow}
          >
            Loslegen
          </button>
          <CreateProjectPopover ref={createProjectModalRef} />
        </div>
      </div>
    </div>
  );
}

export default NoProjectModal;
