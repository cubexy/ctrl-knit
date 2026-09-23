import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";

export type ProjectListDisplayProps = {
  currentProjectId?: string;
};

function ProjectListDisplay(props: ProjectListDisplayProps) {
  const { getProjectList, initialLoadingDone } = useDatabase();
  const projects = getProjectList();

  return (
    <ul className="flex min-h-0 w-full flex-1 flex-col gap-1 overflow-y-auto">
      {!initialLoadingDone && (
        <li role="status" aria-label="Projekte werden geladen">
          <span className="loading loading-spinner m-3" />
        </li>
      )}
      {initialLoadingDone &&
        projects.map((project) => (
          <li key={project.id}>
            <Link
              to={`/projects/${project.id}`}
              viewTransition
              aria-current={props.currentProjectId === project.id ? "page" : undefined}
              title={`Zuletzt geändert: ${project.updatedAt}`}
              className={`flex min-h-11 w-full items-center rounded-lg px-3 py-3 text-sm wrap-anywhere transition-colors ${props.currentProjectId === project.id ? "bg-base-300/60 text-base-content" : "text-base-content/75 hover:bg-base-300/30 hover:text-base-content"}`}
            >
              {project.name}
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
      <p className="text-base-content/60 px-3 py-2 text-xs leading-relaxed">Hier finden deine Projekte ihren Platz.</p>
    </li>
  );
}

export default ProjectListDisplay;
