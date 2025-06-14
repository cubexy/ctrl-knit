const PouchDB = require("pouchdb");
import { useEffect } from "react";

export function useDatabase() {
  // Initialize the PouchDB database instance
  useEffect(() => {
    const db = new PouchDB("my_database");
    console.log(db.info());
  }, []);
}
