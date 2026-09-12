/**
 * Represents the data structure for creating a new counter.
 * It includes the counter's name, count target, and optional stepOver target.
 */
export type CreateCounter = {
  name: string;
  categoryId?: string;
  count?: {
    target: number;
  };
  stepOver?: {
    target: number;
  };
};
