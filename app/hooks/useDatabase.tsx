const PouchDB = require("pouchdb");
import { useEffect } from "react";
import { CouchDatabase } from "~/pouchdb";

const db = new CouchDatabase();

export function useDatabase() {
  useEffect(() => {
    // Initialize or perform any setup needed for the database
    db.getProjects()
      .then((result) => {
        console.log("Projects loaded:", result);
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
      });
  }, []);

  return {
    createProject: db.createProject.bind(db),
    updateProject: db.updateProject.bind(db),
    deleteProject: db.deleteProject.bind(db),
    getProjects: db.getProjects.bind(db),
    getProjectById: db.getProjectById.bind(db),
    createCounter: db.createCounter.bind(db),
    updateCounter: db.updateCounter.bind(db),
    deleteCounter: db.deleteCounter.bind(db)
  };
}
