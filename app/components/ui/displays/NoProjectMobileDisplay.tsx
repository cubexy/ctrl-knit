import { useProjectPopover } from "~/contexts/ProjectPopoverContext";
import WoolIcon from "../icons/WoolIcon";

function NoProjectMobileDisplay() {
  const { handleShow } = useProjectPopover();

  return (
    <div className="hero h-full">
      <div className="hero-content text-center">
        <div className="flex max-w-md flex-col items-center">
          <WoolIcon className="fill-base-300 size-36" strokeWidth={1} />
          <p className="text-6xl font-bold" style={{ fontFamily: "Le Murmure_Regular" }}>
            Kein offenes Projekt
          </p>
          <p className="text-base-content/70 pt-1 pb-2 text-sm">
            Du hast gerade noch kein Projekt geöffnet. Öffne oben über "Projekte" ein schon erstelltes Projekt oder fang
            hier ein neues an!
          </p>
          <button
            className="btn btn-primary btn-large transition-all duration-300 ease-in-out hover:scale-105"
            onClick={handleShow}
          >
            Loslegen
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoProjectMobileDisplay;
