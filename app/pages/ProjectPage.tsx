import { useParams } from "react-router";
import CounterDisplay from "~/components/ui/displays/CounterDisplay";
import ProjectHeaderDisplay from "~/components/ui/displays/ProjectHeaderDisplay";
import AddCounterModal from "~/components/ui/modals/AddCounterModal";
import { useDatabase } from "~/contexts/DatabaseContext";
import type { CreateCounter } from "~/models/Counter";
import type { CreateProject } from "~/models/Project";

function ProjectPage() {
  let { id } = useParams();

  if (!id) {
    return <div className="text-center">Kein Projekt ausgewählt</div>;
  }

  const {
    getProjectById,
    incrementCounter,
    updateCounter,
    createCounter,
    deleteCounter,
    updateProject,
    deleteProject
  } = useDatabase();

  const project = getProjectById(id);

  if (!project) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  return (
    <>
      <ProjectHeaderDisplay
        project={{ name: project.name, url: project.url }}
        onConfirmEdit={(project: CreateProject) => updateProject(id, project)}
        onDelete={() => deleteProject(id)}
      />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {project.counters.map((counter) => {
          return (
            <CounterDisplay
              key={counter.id}
              id={counter.id}
              name={counter.name}
              count={counter.count}
              stepOver={counter.stepOver}
              onIncrement={() => incrementCounter(id, counter.id, 1)}
              onDecrement={() => incrementCounter(id, counter.id, -1)}
              onEdit={(update) => updateCounter(id, counter.id, update)}
              onDelete={() => deleteCounter(id, counter.id)}
            />
          );
        })}
        <AddCounterModal onAddCounter={(counter: CreateCounter) => createCounter(id, counter)} />
      </div>
    </>
  );
}

export default ProjectPage;
