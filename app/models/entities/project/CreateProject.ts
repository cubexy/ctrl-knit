/**
 * Represents the data structure for creating a new project.
 * It includes the project's name and an optional URL.
 */
export type CreateProject = {
  name: string;
  url: string | undefined;
  trackedTime?: number;
};
