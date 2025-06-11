import CounterDisplay from "~/components/ui/displays/CounterDisplay";
import ProjectHeaderDisplay from "~/components/ui/displays/ProjectHeaderDisplay";
import AddCounterModal from "~/components/ui/modals/AddCounterModal";
import { useProject } from "~/hooks/useProject";

function ProjectPage() {
  const { project, isLoading, error, fetchProject, editCounter, editProject, addCounter, counterStep } = useProject({
    projectId: "12345"
  });

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!project) {
    return <div className="text-center">Project not found</div>;
  }

  return (
    <>
      <ProjectHeaderDisplay name={project.name} url={project.url} />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {project.counters.map((counter) => (
          <CounterDisplay
            key={counter.id}
            id={counter.id}
            name={counter.name}
            createdAt={counter.createdAt}
            count={counter.count}
            stepOver={counter.stepOver}
            onIncrement={() => counterStep(counter.id, 1)}
            onDecrement={() => counterStep(counter.id, -1)}
            onEdit={(update) => editCounter({ ...update, id: counter.id })}
          />
        ))}
        <AddCounterModal onAddCounter={addCounter} />
      </div>
    </>
  );
}

export default ProjectPage;
