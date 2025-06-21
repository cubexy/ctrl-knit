import type { Counter, EditCounter } from "./Counter";

/**
 * Represents a knitting project.
 * A project has a unique identifier, a name, an optional URL,
 * timestamps for creation and last update, and a list of counters.
 *
 * Examples of projects would be a sweater, a blanket, or a pair of socks.
 */
export type Project = {
  id: string;
  name: string;
  url: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  counters: Counter[];
};

/**
 * Represents a project as stored in the database.
 * It includes the project's unique identifier and all other properties
 * except for the `id` field, which is replaced with `_id` for database compatibility.
 */
export type DatabaseProject = {
  _id: string;
} & Omit<Project, "id">;

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

/**
 * Represents the data structure for creating a new project.
 * It includes the project's name and an optional URL.
 */
export type CreateProject = {
  name: string;
  url: string | undefined;
};
