import type { Counter } from "../counter/Counter";

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
