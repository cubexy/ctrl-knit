import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";

type ProjectListDisplayProps = {
  currentProjectId?: string;
};

function ProjectListDisplay(props: ProjectListDisplayProps) {
  const { getProjectList } = useDatabase();
  const projects = getProjectList();

  return (
    <ul className="flex h-[calc(100dvh-236px)] w-full flex-col gap-3 overflow-y-auto">
      {projects.map((project) => (
        <li key={project.id} className="w-full">
          <Link
            to={`/projects/${project.id}`}
            className={`w-full ${props.currentProjectId === project.id && "font-black underline"}`}
          >
            <p>{project.name}</p>
          </Link>
        </li>
      ))}
      {projects.length === 0 && <NoProjectModal />}
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
