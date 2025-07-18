import CounterDisplay from "~/components/ui/displays/CounterDisplay";
import ProjectHeaderDisplay from "~/components/ui/displays/ProjectHeaderDisplay";
import AddCounterModal from "~/components/ui/modals/AddCounterModal";
import { useDatabase } from "~/contexts/DatabaseContext";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import type { EditCounter } from "~/models/entities/counter/EditCounter";
import type { CreateProject } from "~/models/entities/project/CreateProject";

type ProjectPageProps = {
  id: string;
};

function ProjectPage(props: ProjectPageProps) {
  const {
    getProjectById,
    incrementCounter,
    updateCounter,
    createCounter,
    deleteCounter,
    updateProject,
    deleteProject
  } = useDatabase();

  const project = getProjectById(props.id);

  if (!project) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  return (
    <>
      <ProjectHeaderDisplay
        project={{ name: project.name, url: project.url }}
        onConfirmEdit={(project: CreateProject) => updateProject(props.id, project)}
        onDelete={() => deleteProject(props.id)}
      />
      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        {project.counters.map((counter) => {
          return (
            <CounterDisplay
              key={counter.id}
              id={counter.id}
              name={counter.name}
              count={counter.count}
              stepOver={counter.stepOver}
              onIncrement={() => incrementCounter(props.id, counter.id, 1)}
              onDecrement={() => incrementCounter(props.id, counter.id, -1)}
              onEdit={(update: EditCounter) => updateCounter(props.id, counter.id, update)}
              onDelete={() => deleteCounter(props.id, counter.id)}
            />
          );
        })}
        <AddCounterModal onAddCounter={(counter: CreateCounter) => createCounter(props.id, counter)} />
      </div>
    </>
  );
}

export default ProjectPage;
