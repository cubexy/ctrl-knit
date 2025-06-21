import { useParams } from "react-router";
import CounterDisplay from "~/components/ui/displays/CounterDisplay";
import ProjectHeaderDisplay from "~/components/ui/displays/ProjectHeaderDisplay";
import AddCounterModal from "~/components/ui/modals/AddCounterModal";
import { useDatabase } from "~/hooks/useDatabase";
import type { CreateCounter } from "~/models/Counter";

function ProjectPage() {
  let { id } = useParams();

  if (!id) {
    return <div className="text-center">Kein Projekt ausgewählt</div>;
  }

  const { getProjectById, incrementCounter, updateCounter, createCounter } = useDatabase();

  const project = getProjectById(id);

  if (!project) {
    return <div className="text-center">Projekt nicht gefunden</div>;
  }

  return (
    <>
      <ProjectHeaderDisplay name={project.name} url={project.url} />
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
            />
          );
        })}
        <AddCounterModal onAddCounter={(counter: CreateCounter) => createCounter(id, counter)} />
      </div>
    </>
  );
}

export default ProjectPage;
