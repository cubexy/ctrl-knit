import { useEffect, useRef } from "react";
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
  const targetRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  const firstIncrementableId = project?.counters.find((counter) => {
    const hasTarget = counter.count.target !== null && counter.count.target !== undefined;
    if (!hasTarget) return true;
    const isBelowCountTarget = counter.count.current < counter.count.target!;
    if (counter.stepOver) {
      const isBelowStepOverTarget = counter.stepOver.current < counter.stepOver.target;
      return isBelowStepOverTarget || isBelowCountTarget;
    }
    return isBelowCountTarget;
  })?.id;

  useEffect(() => {
    if (firstIncrementableId && targetRef.current && !hasScrolled.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      hasScrolled.current = true;
    }
  }, [firstIncrementableId]);

  if (!project) {
    return <span className="text-error">Das Projekt konnte nicht gefunden werden!</span>;
  }

  return (
    <>
      <ProjectHeaderDisplay
        project={{ name: project.name, url: project.url }}
        onConfirmEdit={(project: CreateProject) => updateProject(props.id, project)}
        onDelete={() => deleteProject(props.id)}
      />
      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        {project.counters.map((counter) => (
          <CounterDisplay
            key={counter.id}
            ref={counter.id === firstIncrementableId ? targetRef : undefined}
            id={counter.id}
            name={counter.name}
            count={counter.count}
            stepOver={counter.stepOver}
            onIncrement={() => incrementCounter(props.id, counter.id, 1)}
            onDecrement={() => incrementCounter(props.id, counter.id, -1)}
            onEdit={(update: EditCounter) => updateCounter(props.id, counter.id, update)}
            onDelete={() => deleteCounter(props.id, counter.id)}
          />
        ))}
        <AddCounterModal onAddCounter={(counter: CreateCounter) => createCounter(props.id, counter)} />
      </div>
    </>
  );
}

export default ProjectPage;
