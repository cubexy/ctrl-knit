import CounterDisplay from "~/components/ui/displays/CounterDisplay";
import ProjectHeaderDisplay from "~/components/ui/displays/ProjectHeaderDisplay";
import AddCounterModal from "~/components/ui/modals/AddCounterModal";
import { useProject } from "~/hooks/useProject";

function ProjectPage() {
  const project = useProject({
    projectId: "12345"
  });

  const data = {
    name: "Sophie Scarf",
    url: "https://www.google.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    counters: [
      {
        id: "1",
        name: "Oberseite",
        value: 7,
        stepover: 5
      },
      {
        id: "2",
        name: "Unterseite",
        value: 2,
        stepover: null
      }
    ]
  };

  return (
    <>
      <ProjectHeaderDisplay name={data.name} url={data.url} />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {data.counters.map((counter) => (
          <CounterDisplay
            key={counter.id}
            identifier={counter.id}
            name={counter.name}
            count={{
              current: counter.value,
              target: 12
            }}
            stepOver={{
              current: 3,
              target: 5
            }}
            onIncrement={() => console.log("Increment")}
            onDecrement={() => console.log("Decrement")}
          />
        ))}
        <AddCounterModal onAddCounter={() => console.log("Add Counter")} />
      </div>
    </>
  );
}

export default ProjectPage;
