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
        <div className="flex max-w-md flex-col items-center">
          <WoolIcon className="fill-base-300 size-36" strokeWidth={1} />
          <h1 className="text-5xl font-bold">Kein offenes Projekt </h1>
          <p className="py-4">
            Du hast gerade noch kein Projekt geöffnet. Öffne oben über "Projekte" ein schon erstelltes Projekt oder fang
            hier ein neues an!
          </p>
          <button className="btn btn-primary btn-large" onClick={handleShow}>
            Loslegen
          </button>
          <CreateProjectPopover ref={createProjectModalRef} />
        </div>
      </div>
    </div>
  );
}

export default NoProjectModal;
