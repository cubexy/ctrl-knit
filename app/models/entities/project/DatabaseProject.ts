import type { Project } from "./Project";

/**
 * Represents a project as stored in the database.
 * It includes the project's unique identifier and all other properties
 * except for the `id` field, which is replaced with `_id` for database compatibility.
 */
export type DatabaseProject = {
  _id: string;
} & Omit<Project, "id">;
