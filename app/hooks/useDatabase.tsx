const PouchDB = require("pouchdb");
import { useEffect, useState } from "react";
import { CouchDatabase } from "~/hooks/api/PouchDatabase";
import type { Project } from "~/models/Project";

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
          const projectFromDoc: Project = {
            id: updatedDoc._id,
            name: updatedDoc.name,
            url: updatedDoc.url,
            createdAt: new Date(updatedDoc.createdAt),
            updatedAt: new Date(updatedDoc.updatedAt),
            counters: updatedDoc.counters || []
          };

          if (index === -1) {
            // Add new project
            return [...prev, projectFromDoc];
          }

          // Update existing project
          const newProjects = [...prev];
          newProjects[index] = projectFromDoc;
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
