import type { Counter } from "./Counter";

export type CounterPresentation = {
  id: string;
  name: string;
  count: {
    current: number;
    target?: number;
  };
  stepOver?: {
    current: number;
    target: number;
  };
};

export const counterPresenter = (counter: Counter): CounterPresentation => {
  if (counter.count.target === undefined) {
    return {
      id: counter.id,
      name: counter.name,
      count: {
        current: counter.count.current
      },
      stepOver: undefined
    };
  }

  const currentCountMod = counter.count.current % counter.count.target;
  const currentCount = currentCountMod === 0 ? counter.count.target : currentCountMod;
  const isZero = counter.count.current === 0;

  return {
    id: counter.id,
    name: counter.name,
    count: {
      current: isZero ? 0 : currentCount,
      target: counter.count.target
    },
    stepOver: counter.stepOver
      ? {
          current: Math.max(1, Math.ceil(counter.count.current / counter.count.target)),
          target: counter.stepOver.target
        }
      : undefined
  };
};
