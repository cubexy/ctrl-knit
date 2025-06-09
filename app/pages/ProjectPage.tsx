import CounterDisplay from "~/components/ui/displays/CounterDisplay";

function ProjectPage() {
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
        stepover: 5,
      },
      {
        id: "2",
        name: "Unterseite",
        value: 2,
        stepover: null,
      },
    ],
  };

  return (
    <>
      <div className="card bg-base-200 w-full">
        <div className="card-body justify-center items-center gap-0">
          <h2 className="card-title text-xl">{data.name}</h2>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>

            {data.url}
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
        {data.counters.map((counter) => (
          <CounterDisplay
            key={counter.id}
            identifier={counter.id}
            name={counter.name}
            count={{
              current: counter.value,
              target: 12,
            }}
            stepOver={{
              current: 3,
              target: 5,
            }}
            onIncrement={() => console.log("Increment")}
            onDecrement={() => console.log("Decrement")}
          />
        ))}
      </div>
    </>
  );
}

export default ProjectPage;
