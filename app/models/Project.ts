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
