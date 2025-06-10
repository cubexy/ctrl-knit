import { useState } from "react";
import type { CreateCounter, EditCounter } from "~/models/Counter";
import type { EditProject, Project } from "~/models/Project";

type UseProjectProps = {
  projectId: string;
};

export function useProject(props: UseProjectProps) {
  const { projectId } = props;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addCounter = async (counter: CreateCounter) => {
    if (project === null) return;
    setIsLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newCounter = {
      id: Date.now().toString(),
      createdAt: new Date(),
      name: counter.name,
      count: {
        current: 0,
        target: counter.count.target,
      },
      stepOver: counter.stepOver
        ? {
            current: 0,
            target: counter.stepOver.target,
          }
        : undefined,
    };
    setProject((prev) => ({
      ...prev!,
      counters: [...prev!.counters, newCounter],
    }));
    setIsLoading(false);
  };

  const editCounter = async (update: EditCounter) => {
    if (project === null) return;
    setIsLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const updatedCounters = project.counters.map((counter) => {
      if (counter.id === update.id) {
        return {
          ...counter,
          name: update.name ?? counter.name,
          count: {
            ...counter.count,
            target: update.count?.target ?? counter.count.target,
          },
          stepOver: counter.stepOver
            ? {
                ...counter.stepOver,
                target: update.stepOver?.target ?? counter.stepOver?.target,
              }
            : undefined,
        };
      }
      return counter;
    });
    setProject((prev) => ({ ...prev!, counters: updatedCounters }));
    setIsLoading(false);
  };

  const counterStep = async (counterId: string, direction: 1 | -1) => {
    if (project === null) return;
    setIsLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const updatedCounters = project.counters.map((counter) => {
      if (counter.id === counterId) {
        return {
          ...counter,
          count: {
            ...counter.count,
            current: Math.min(
              counter.count.current + direction,
              counter.count.target
            ),
          },
        };
      }
      return counter;
    });
    setProject((prev) => ({ ...prev!, counters: updatedCounters }));
    setIsLoading(false);
  };

  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setProject({
      id: "1",
      name: "Sample Project",
      counters: [
        {
          id: "counter1",
          name: "Counter 1",
          createdAt: new Date(),
          count: {
            current: 5,
            target: 50,
          },
          stepOver: {
            current: 5,
            target: 50,
          },
        },
        {
          id: "counter2",
          name: "Counter 2",
          createdAt: new Date(),
          count: {
            current: 20,
            target: 200,
          },
          stepOver: {
            current: 10,
            target: 100,
          },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      url: "https://example.com/project/1",
    });
    setIsLoading(false);
  };

  const editProject = async (update: EditProject) => {
    if (project === null) return;
    setIsLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const updatedProject = {
      ...project,
      name: update.name ?? project.name,
      url: update.url ?? project.url,
      counters: update.counters
        ? project.counters.map((counter) => {
            const updatedCounter = update.counters?.find(
              (c) => c.id === counter.id
            );
            if (updatedCounter) {
              return {
                ...counter,
                name: updatedCounter.name ?? counter.name,
                count: {
                  ...counter.count,
                  target: updatedCounter.count?.target ?? counter.count.target,
                },
                stepOver:
                  updatedCounter.stepOver && counter.stepOver
                    ? {
                        current: counter.stepOver.current,
                        target:
                          updatedCounter.stepOver.target ??
                          counter.stepOver.target,
                      }
                    : counter.stepOver,
              };
            }
            return counter;
          })
        : project.counters,
    };
    setProject(updatedProject);
    setIsLoading(false);
  };

  return {
    project,
    isLoading,
    error,
    fetchProject,
    editProject,
    counterStep,
    addCounter,
    editCounter,
  };
}
