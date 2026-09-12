import type { Counter } from "../counter/Counter";
import type { CounterCategory } from "../counter/CounterCategory";
import type { Project } from "./Project";

/**
 * Represents a counter as serialized by PouchDB.
 */
type DatabaseCounter = Omit<Counter, "createdAt" | "editedAt"> & {
  createdAt: string;
  editedAt: string;
  /** Legacy field used before counter categories became explicit entities. */
  group?: string;
};

/**
 * Represents a project as serialized by PouchDB.
 */
export type DatabaseProject = Omit<
  Project,
  "id" | "createdAt" | "updatedAt" | "categories" | "counters" | "trackedTime" | "timeSpanStart"
> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  categories?: CounterCategory[];
  counters?: DatabaseCounter[];
  trackedTime?: number;
  timeSpanStart?: string;
};

export type CouchDbProject = PouchDB.Core.ExistingDocument<PouchDB.Core.ChangesMeta> & DatabaseProject;
