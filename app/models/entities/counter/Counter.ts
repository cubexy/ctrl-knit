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
  editedAt: Date;
  count: {
    current: number;
    target?: number;
  };
  stepOver?: {
    target: number;
  };
};
