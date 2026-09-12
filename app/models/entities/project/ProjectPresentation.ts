import { formatDate } from "~/utility/formatDate";
import { type CounterPresentation, counterPresenter } from "../counter/CounterPresentation";
import type { CounterCategory } from "../counter/CounterCategory";
import type { Project } from "./Project";

export type ProjectListItemPresentation = {
  id: string;
  name: string;
  group?: string;
  updatedAt: string;
};

export const projectListItemPresenter = (project: Project): ProjectListItemPresentation => {
  return {
    id: project.id,
    name: project.name,
    group: project.group,
    updatedAt: formatDate(project.updatedAt)
  };
};

export type ProjectPresentation = {
  id: string;
  name: string;
  group?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  categories: CounterCategory[];
  counters: CounterPresentation[];
  lastUpdatedCounter?: string;
  trackedTime: number;
  timeSpanStart?: Date;
};

export const projectPresenter = (project: Project | undefined): ProjectPresentation | null => {
  if (!project) return null;

  return {
    id: project.id,
    name: project.name,
    group: project.group,
    url: project.url,
    createdAt: formatDate(project.createdAt),
    updatedAt: formatDate(project.updatedAt),
    categories: [...(project.categories ?? [])].sort((a, b) => a.order - b.order),
    counters: project.counters
      .map((counter, index) => counterPresenter({ ...counter, order: counter.order ?? index }))
      .sort((a, b) => a.order - b.order),
    lastUpdatedCounter: project.lastUpdatedCounter,
    trackedTime: project.trackedTime ?? 0,
    timeSpanStart: project.timeSpanStart
  };
};
