import type { Counter } from "../counter/Counter";
import type { Project } from "./Project";

/**
 * Represents a counter as serialized by PouchDB.
 */
type DatabaseCounter = Omit<Counter, "createdAt" | "editedAt"> & {
  createdAt: string;
  editedAt: string;
};

/**
 * Represents a project as serialized by PouchDB.
 */
export type DatabaseProject = Omit<
  Project,
  "id" | "createdAt" | "updatedAt" | "counters" | "trackedTime" | "timeSpanStart"
> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  counters?: DatabaseCounter[];
  trackedTime?: number;
  timeSpanStart?: string;
};

export type CouchDbProject = PouchDB.Core.ExistingDocument<PouchDB.Core.ChangesMeta> & DatabaseProject;
