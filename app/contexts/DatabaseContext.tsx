import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LocalStorageController } from "~/hooks/api/LocalStorageController";
import { PouchDatabase } from "~/hooks/api/PouchDatabase";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import type { EditCounter } from "~/models/entities/counter/EditCounter";
import type { CreateProject } from "~/models/entities/project/CreateProject";
import type { Project } from "~/models/entities/project/Project";
import {
  projectListItemPresenter,
  projectPresenter,
  type ProjectListItemPresentation
} from "~/models/entities/project/ProjectPresentation";
import { AuthenticationError, ConnectionError } from "~/models/error/ConnectionError";
import type { LoginParameters } from "~/models/LoginParameters";
import {
  DEFAULT_DATABASE_CONNECTION_PRESENTATION,
  DEFAULT_LOADING_DATABASE_CONNECTION_PRESENTATION,
  type DatabaseConnectionPresentation
} from "~/models/presenter/DatabaseConnectionPresentation";

interface DatabaseContextType {
  getProjectById: (id: string) => ReturnType<typeof projectPresenter>;
  getProjectList: () => ProjectListItemPresentation[];
  createProject: (project: CreateProject) => Promise<any>;
  updateProject: (id: string, project: CreateProject) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  createCounter: (projectId: string, counter: CreateCounter) => Promise<any>;
  updateCounter: (projectId: string, counterId: string, update: EditCounter) => Promise<any>;
  deleteCounter: (projectId: string, counterId: string) => Promise<any>;
  incrementCounter: (projectId: string, counterId: string, step: number) => Promise<any>;
  remoteLogin: (login: LoginParameters) => Promise<void>;
  authStatus: DatabaseConnectionPresentation;
  signOut: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

let db: PouchDatabase | null = null;
let remoteDbHostInfo: { hostname: string; dbName: string } | null = null;

if (typeof window !== "undefined") {
  db = new PouchDatabase();
  remoteDbHostInfo = LocalStorageController.getRemoteDb();
}

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [authStatus, setAuthStatus] = useState<DatabaseConnectionPresentation>(
    DEFAULT_LOADING_DATABASE_CONNECTION_PRESENTATION
  );

  useEffect(() => {
    const loadInitialData = async () => {
      if (!db) {
        setProjects([]);
        console.error("error: db is not initialized. is this being called on the server?");
        return;
      }
      setProjects(await db.getProjects());
    };
    loadInitialData();
    const feed = db?.onChange(onProjectDelete, onProjectUpsert);

    const checkSession = async () => {
      if (!db || !remoteDbHostInfo) {
        setAuthStatus((_) => DEFAULT_DATABASE_CONNECTION_PRESENTATION);
        return;
      }
      try {
        const session = await db.getSession(remoteDbHostInfo.hostname, remoteDbHostInfo.dbName);
        setAuthStatus((_) => ({
          username: session.userCtx.name,
          dbString: `${remoteDbHostInfo.hostname}/${remoteDbHostInfo.dbName}`,
          hostname: remoteDbHostInfo.hostname,
          status: {
            type: "status-success",
            message: "Erfolgreich angemeldet.",
            loading: false
          },
          loggedIn: true,
          disabled: false
        }));
      } catch (error) {
        if (error instanceof AuthenticationError) {
          setAuthStatus((_) => ({
            status: {
              type: "status-error",
              message: "Automatische Anmeldung fehlgeschlagen. Bitte melde dich erneut an.",
              loading: false
            },
            loggedIn: false,
            disabled: false
          }));
          return;
        }
        if (error instanceof ConnectionError) {
          setAuthStatus((_) => ({
            status: {
              type: "status-warning",
              message: "Keine Verbindung zum Server möglich.",
              loading: false
            },
            loggedIn: false,
            disabled: false
          }));
          return;
        }
        console.error("Unexpected error during session check:", error);
        setAuthStatus((_) => ({
          status: {
            type: "status-error",
            message: "Unerwarteter Fehler beim Überprüfen der Verbindung.",
            loading: false
          },
          loggedIn: false,
          disabled: false
        }));
      }
    };

    checkSession();

    return () => {
      feed?.cancel();
      feed?.removeAllListeners();
    };
  }, []);

  const onProjectDelete = (deletedId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== deletedId));
  };

  const storeRemoteInLocalStorage = (hostname: string, dbName: string) => {
    LocalStorageController.setRemoteDb(hostname, dbName);
  };

  const signOut = () => {
    if (!db) {
      console.error("error: db is not initialized. is this being called on the server?");
      return;
    }
    db.signOut();
    setAuthStatus((_) => DEFAULT_DATABASE_CONNECTION_PRESENTATION);
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

  const remoteLogin = async (login: LoginParameters) => {
    if (!db) {
      console.error("error: db is not initialized. is this being called on the server?");
      return;
    }
    try {
      setAuthStatus((_) => ({
        status: {
          type: "status-warning",
          message: "Anmeldung läuft...",
          loading: true
        },
        loggedIn: false,
        disabled: true
      }));
      await db.initializeRemoteDb(login.username, login.password, login.hostname, login.dbName);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        setAuthStatus((_) => ({
          status: {
            type: "status-error",
            message: "Anmeldung fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.",
            loading: false
          },
          loggedIn: false,
          disabled: false
        }));
        return;
      }

      if (error instanceof ConnectionError) {
        setAuthStatus((_) => ({
          status: {
            type: "status-warning",
            message: "Keine Verbindung zum Server möglich.",
            loading: false
          },
          loggedIn: false,
          disabled: false
        }));
        return;
      }

      console.error("Unexpected error during remote login:", error);
      setAuthStatus((_) => ({
        status: {
          type: "status-error",
          message: "Unbekannter Fehler während der Anmeldung.",
          loading: false
        },
        loggedIn: false,
        disabled: false
      }));
      return;
    }
    setAuthStatus((_) => ({
      username: login.username,
      dbString: `${login.hostname}/${login.dbName}`,
      hostname: login.hostname,
      status: {
        type: "status-success",
        message: "Erfolgreich angemeldet.",
        loading: false
      },
      loggedIn: true,
      disabled: false
    }));
    storeRemoteInLocalStorage(login.hostname, login.dbName);
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
    return projects.map((project) => projectListItemPresenter(project)).reverse();
  };

  const createProject = async (project: CreateProject) => {
    return db?.createProject(project);
  };

  const updateProject = async (id: string, project: CreateProject) => {
    return db?.updateProject(id, project);
  };

  const deleteProject = async (id: string) => {
    return db?.deleteProject(id);
  };

  const createCounter = async (projectId: string, counter: CreateCounter) => {
    return db?.createCounter(projectId, counter);
  };

  const updateCounter = async (projectId: string, counterId: string, update: EditCounter) => {
    return db?.updateCounter(projectId, counterId, update);
  };

  const deleteCounter = async (projectId: string, counterId: string) => {
    return db?.deleteCounter(projectId, counterId);
  };

  const incrementCounter = async (projectId: string, counterId: string, step: number) => {
    return db?.incrementCounter(projectId, counterId, step);
  };

  const value: DatabaseContextType = {
    getProjectById,
    getProjectList,
    createProject,
    updateProject,
    deleteProject,
    createCounter,
    updateCounter,
    deleteCounter,
    incrementCounter,
    remoteLogin,
    authStatus,
    signOut
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase(): DatabaseContextType {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
