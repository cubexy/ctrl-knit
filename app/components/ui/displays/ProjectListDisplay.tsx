import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";

type ProjectListDisplayProps = {
  currentProjectId?: string;
};

function ProjectListDisplay(props: ProjectListDisplayProps) {
  const { getProjectList, initialLoadingDone } = useDatabase();
  const projects = getProjectList();

  return (
    <ul className="flex h-[calc(100dvh-236px)] w-full flex-col overflow-y-auto">
      {!initialLoadingDone && <span className="loading loading-spinner loading-xl" />}
      {initialLoadingDone &&
        projects.map((project) => (
          <li
            key={project.id}
            className={`${props.currentProjectId === project.id && "bg-base-200/10"} flex w-full items-start justify-between rounded-lg px-1.5 pb-1 transition-normal duration-200 ease-in-out`}
          >
            <Link to={`/projects/${project.id}`} viewTransition className="w-full">
              <p className="break-all">{project.name}</p>
              {props.currentProjectId === project.id && (
                <p className="text-base-300/50 text-xs">letzte Änderung: {project.updatedAt}</p>
              )}
            </Link>
          </li>
        ))}
      {initialLoadingDone && projects.length === 0 && <NoProjectModal />}
    </ul>
  );
}

function NoProjectModal() {
  return (
    <li>
      <span className="text-neutral-content/50 w-full text-sm">Erstelle dein erstes Projekt! 😊</span>
    </li>
  );
}

export default ProjectListDisplay;
