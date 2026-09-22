/**
 * Represents the data structure for creating a new project.
 * It includes the project's name, optional notes, and an optional URL.
 */
export type CreateProject = {
  name: string;
  notes?: string;
  url: string | undefined;
  trackedTime?: number;
};
