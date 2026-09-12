import type { Counter } from "../counter/Counter";
import type { CounterCategory } from "../counter/CounterCategory";

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
  group?: string;
  url: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  categories: CounterCategory[];
  counters: Counter[];
  lastUpdatedCounter: string | undefined;
  trackedTime: number;
  timeSpanStart?: Date;
};
