import { useEffect, useState } from "react";
import { PouchDatabase } from "~/hooks/api/PouchDatabase";
import {
  projectListItemPresenter,
  projectPresenter,
  type ProjectListItemPresentation
} from "~/models/presenter/ProjectPresentation";
import type { Project } from "~/models/Project";

const db = new PouchDatabase();

export function useDatabase() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      setProjects(await db.getProjects());
    };

    loadInitialData();
    const feed = db.onChange(onProjectDelete, onProjectUpsert);

    return () => {
      feed.cancel();
    };
  }, []);

  const onProjectDelete = (deletedId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== deletedId));
  };

  const onProjectUpsert = (updatedDoc: any) => {
    setProjects((prev) => {
      const index = prev.findIndex((p) => p.id === updatedDoc._id);
      const projectFromDoc: Project = {
        id: updatedDoc._id,
        name: updatedDoc.name,
        url: updatedDoc.url,
        createdAt: new Date(updatedDoc.createdAt),
        updatedAt: new Date(updatedDoc.updatedAt),
        counters: updatedDoc.counters || []
      };

      if (index === -1) {
        return [...prev, projectFromDoc];
      }

      const newProjects = [...prev];
      newProjects[index] = projectFromDoc;
      return newProjects;
    });
  };

  const getProjectById = (id: string) => {
    const locatedProject = projects.find((project: Project) => project.id === id);
    return projectPresenter(locatedProject);
  };

  /**
   * Fetches all projects.
   * @returns A list of projects with minimal information for display purposes.
   */
  const getProjectList = (): ProjectListItemPresentation[] => {
    return projects.map((project) => projectListItemPresenter(project));
  };

  return {
    getProjectById,
    getProjectList,
    createProject: db.createProject.bind(db),
    updateProject: db.updateProject.bind(db),
    deleteProject: db.deleteProject.bind(db),
    createCounter: db.createCounter.bind(db),
    updateCounter: db.updateCounter.bind(db),
    deleteCounter: db.deleteCounter.bind(db),
    incrementCounter: db.incrementCounter.bind(db)
  };
}
