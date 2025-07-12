import type { EditCounter } from "../counter/EditCounter";

/**
 * Represents the data structure for creating or updating a project.
 * It includes the project's unique identifier, name, optional URL,
 * and an array of counters.
 */
export type EditProject = {
  id: string;
  name?: string;
  url?: string;
  counters?: EditCounter[];
};
