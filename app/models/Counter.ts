/**
 * Represents a counter in a knitting project.
 * A counter has a unique identifier, a name,
 * timestamps for creation, and a count with current and target values.
 * It may also have a stepOver with current and target values.
 *
 * Counters are used for specific tasks in a project.
 */
export type Counter = {
  id: string;
  name: string;
  createdAt: Date;
  count: {
    current: number;
    target: number;
  };
  stepOver?: {
    target: number;
  };
};

/**
 * Represents the data structure for editing a counter.
 * It includes the counter's unique identifier, optional name,
 * and optional count and stepOver targets.
 */
export type EditCounter = {
  id: string;
  name?: string;
  count?: {
    target: number;
  };
  stepOver?: {
    target: number;
  };
};

/**
 * Represents the data structure for creating a new counter.
 * It includes the counter's name, count target, and optional stepOver target.
 */
export type CreateCounter = {
  name: string;
  count: {
    target: number;
  };
  stepOver?: {
    target: number;
  };
};
