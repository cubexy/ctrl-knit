import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import type { ProjectListItemPresentation } from "~/models/entities/project/ProjectPresentation";

type ProjectListDisplayProps = {
  currentProjectId?: string;
};

function ProjectListDisplay(props: ProjectListDisplayProps) {
  const { getProjectList, initialLoadingDone } = useDatabase();
  const projects = getProjectList();
  const groupedProjects = projects.reduce((groups, project) => {
    const group = project.group ?? "";
    groups.set(group, [...(groups.get(group) ?? []), project]);
    return groups;
  }, new Map<string, ProjectListItemPresentation[]>());

  return (
    <ul className="flex h-[calc(100dvh-236px)] w-full flex-col overflow-y-auto">
      {!initialLoadingDone && <span className="loading loading-spinner loading-xl" />}
      {initialLoadingDone &&
        Array.from(groupedProjects).map(([group, projects]) => (
          <li key={group ? `group:${group}` : "ungrouped"}>
            {group && <p className="text-base-300/50 px-1.5 pb-1 text-xs font-bold uppercase">{group}</p>}
            <ul>
              {projects.map((project) => (
                <li
                  key={project.id}
                  className={`${props.currentProjectId === project.id && "bg-base-200/10"} flex w-full items-start justify-between rounded-lg px-1.5 pb-1 transition-normal duration-200 ease-in-out`}
                >
                  <Link to={`/projects/${project.id}`} viewTransition className="w-full">
                    <p className="break-all">{project.name}</p>
                    {props.currentProjectId === project.id && (
                      <p className="text-base-300/50 text-xs">zuletzt am {project.updatedAt} geändert</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
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
