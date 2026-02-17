import { formatDate } from "~/utility/formatDate";
import type { Counter } from "./Counter";

export type CounterPresentation = {
  id: string;
  name: string;
  order: number;
  count: {
    current: number;
    target?: number;
  };
  stepOver?: {
    current: number;
    target: number;
  };
  createdAt: string;
  editedAt: string;
};

export const counterPresenter = (counter: Counter): CounterPresentation => {
  if (counter.count.target === undefined) {
    return {
      id: counter.id,
      name: counter.name,
      order: counter.order ?? 0,
      count: {
        current: counter.count.current
      },
      stepOver: undefined,
      createdAt: counter.createdAt
        ? formatDate(new Date(counter.createdAt))
        : "Nach erneuter Änderung des Zählerwertes wird der Zeitstempel hier angezeigt.",
      editedAt: counter.editedAt
        ? formatDate(new Date(counter.editedAt))
        : "Nach erneuter Änderung des Zählerwertes wird der Zeitstempel hier angezeigt."
    };
  }

  const currentCountMod = counter.count.current % counter.count.target;
  const currentCount = currentCountMod === 0 ? counter.count.target : currentCountMod;
  const isZero = counter.count.current === 0;

  return {
    id: counter.id,
    name: counter.name,
    order: counter.order ?? 0,
    count: {
      current: isZero ? 0 : currentCount,
      target: counter.count.target
    },
    createdAt: counter.createdAt
      ? formatDate(new Date(counter.createdAt))
      : "Nach erneuter Änderung des Zählerwertes wird der Zeitstempel hier angezeigt.",
    editedAt: counter.editedAt
      ? formatDate(new Date(counter.editedAt))
      : "Nach erneuter Änderung des Zählerwertes wird der Zeitstempel hier angezeigt.",
    stepOver: counter.stepOver
      ? {
          current: Math.max(1, Math.ceil(counter.count.current / counter.count.target)),
          target: counter.stepOver.target
        }
      : undefined
  };
};
