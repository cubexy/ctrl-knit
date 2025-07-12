import type { Project } from "../entities/project/Project";
import { counterPresenter, type CounterPresentation } from "./CounterPresentation";

export type ProjectListItemPresentation = {
  id: string;
  name: string;
  updatedAt: string;
};

export const projectListItemPresenter = (project: Project): ProjectListItemPresentation => {
  return {
    id: project.id,
    name: project.name,
    updatedAt: project.updatedAt.toISOString()
  };
};

export type ProjectPresentation = {
  id: string;
  name: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  counters: CounterPresentation[];
};

export const projectPresenter = (project: Project | undefined): ProjectPresentation | undefined => {
  if (!project) return undefined;

  return {
    id: project.id,
    name: project.name,
    url: project.url,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    counters: project.counters.map((counter) => counterPresenter(counter))
  };
};
