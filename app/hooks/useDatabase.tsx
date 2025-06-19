const PouchDB = require("pouchdb");
import { useEffect, useState } from "react";
import type { Project } from "~/models/Project";
import { CouchDatabase } from "~/pouchdb";

const db = new CouchDatabase();

export function useDatabase() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      setProjects(await db.getProjects());
    };

    loadInitialData();
    const feed = db.onChange(
      (deletedId) => {
        setProjects((prev) => prev.filter((project) => project.id !== deletedId));
      },
      (updatedDoc) => {
        setProjects((prev) => {
          const index = prev.findIndex((p) => p.id === updatedDoc._id);
          if (index === -1) return prev;
          const updatedProject = {
            ...prev[index],
            ...updatedDoc,
            id: updatedDoc._id
          };
          const newProjects = [...prev];
          newProjects[index] = updatedProject;
          return newProjects;
        });
      }
    );

    return () => {
      feed.cancel();
    };
  }, []);

  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const getProjectList = () => {
    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      updatedAt: project.updatedAt
    }));
  };

  return {
    projects,
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
