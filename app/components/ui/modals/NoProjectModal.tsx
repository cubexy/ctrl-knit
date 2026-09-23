import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import { useProjectPopover } from "~/contexts/ProjectPopoverContext";
import AddIcon from "../icons/AddIcon";
import WoolIcon from "../icons/WoolIcon";

function NoProjectModal() {
  const { getProjectList, initialLoadingDone } = useDatabase();
  const { handleShow } = useProjectPopover();
  const projects = getProjectList();

  if (!initialLoadingDone) {
    return <span role="status" aria-label="Projekte werden geladen" className="loading loading-spinner my-auto" />;
  }

  return (
    <section
      aria-labelledby="home-heading"
      className="flex w-full max-w-sm flex-1 flex-col items-center justify-center py-12 text-center sm:py-16"
    >
      <WoolIcon className="fill-base-content/30 mb-6 size-10" strokeWidth={1} />
      <h1
        id="home-heading"
        className="text-6xl leading-none text-balance sm:text-7xl"
        style={{ fontFamily: "Le Murmure_Regular" }}
      >
        {projects.length > 0 ? "Weiterstricken?" : "Dein erstes Projekt"}
      </h1>
      <p className="text-base-content/70 mt-4 max-w-xs text-sm leading-relaxed">
        {projects.length > 0
          ? "Kein Projekt geöffnet. Wähle eins aus und mach dort weiter."
          : "Ein Projekt anlegen. Reihe für Reihe weiterstricken."}
      </p>
      {projects.length > 0 && (
        <nav aria-label="Zuletzt verwendete Projekte" className="mt-8 w-full">
          <ul className="flex flex-col gap-1">
            {projects.slice(0, 5).map((project) => (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  viewTransition
                  className="hover:bg-base-200 focus-visible:outline-base-content flex min-h-12 items-center justify-between gap-4 rounded-xl px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="min-w-0 wrap-anywhere">{project.name}</span>
                  <span aria-hidden="true" className="text-base-content/50">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <button
        type="button"
        className={`btn mt-6 min-h-11 gap-2 px-4 font-normal ${projects.length > 0 ? "btn-ghost text-base-content/70" : "btn-primary"}`}
        onClick={handleShow}
      >
        <AddIcon className="size-4 stroke-current" strokeWidth={1.5} />
        Projekt erstellen
      </button>
    </section>
  );
}

export default NoProjectModal;
