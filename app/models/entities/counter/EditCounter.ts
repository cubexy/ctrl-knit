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
