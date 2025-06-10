import { createContext, useContext, useState, type ReactNode } from "react";

// Define the shape of your context data
interface ProjectData {
  // Example: replace with your actual project data structure
  id: string | null;
  name: string;
  counters: any[]; // Replace 'any' with your counter type
}

interface ProjectContextType {
  project: ProjectData | null;
  isLoading: boolean;
  error: Error | null;
  fetchProject: (projectId: string) => Promise<void>;
  updateCounter: (counterId: string, newValue: number) => Promise<void>;
  // Add other actions like createProject, etc.
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProject = async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProject(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCounter = async (counterId: string, newValue: number) => {
    // Example: optimistic update or refetch
    if (!project) return;

    // Optimistic update
    const updatedCounters = project.counters.map((c) =>
      c.id === counterId ? { ...c, value: newValue } : c
    );
    setProject({ ...project, counters: updatedCounters });

    try {
      // Replace with your actual API call
      const response = await fetch(
        `/api/projects/${project.id}/counters/${counterId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: newValue }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update counter");
        // Revert optimistic update if necessary
      }
      // Optionally refetch or update state with response
    } catch (e) {
      setError(e as Error);
      // Revert optimistic update
      // fetchProject(project.id); // Or revert manually
    }
  };

  // Add other functions for creating, updating projects, etc.

  return (
    <ProjectContext.Provider
      value={{ project, isLoading, error, fetchProject, updateCounter }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
