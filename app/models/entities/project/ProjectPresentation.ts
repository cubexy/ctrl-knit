import { formatDate } from "~/utility/formatDate";
import { type CounterPresentation, counterPresenter } from "../counter/CounterPresentation";
import type { Project } from "./Project";

export type ProjectListItemPresentation = {
  id: string;
  name: string;
  updatedAt: string;
};

export const projectListItemPresenter = (project: Project): ProjectListItemPresentation => {
  return {
    id: project.id,
    name: project.name,
    updatedAt: formatDate(project.updatedAt)
  };
};

export type ProjectPresentation = {
  id: string;
  name: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  counters: CounterPresentation[];
  lastUpdatedCounter?: string;
};

export const projectPresenter = (project: Project | undefined): ProjectPresentation | null => {
  if (!project) return null;

  return {
    id: project.id,
    name: project.name,
    url: project.url,
    createdAt: formatDate(project.createdAt),
    updatedAt: formatDate(project.updatedAt),
    counters: project.counters.map((counter) => counterPresenter(counter)),
    lastUpdatedCounter: undefined
  };
};
