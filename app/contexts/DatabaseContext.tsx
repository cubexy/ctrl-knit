import { createContext, useContext } from "react";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import type { EditCounter } from "~/models/entities/counter/EditCounter";
import type { CreateProject } from "~/models/entities/project/CreateProject";
import type { projectPresenter, ProjectListItemPresentation } from "~/models/entities/project/ProjectPresentation";
import type { LoginParameters } from "~/models/LoginParameters";
import type { DatabaseConnectionPresentation } from "~/models/presenter/DatabaseConnectionPresentation";

export interface DatabaseContextType {
  getProjectById: (id: string) => ReturnType<typeof projectPresenter>;
  getProjectList: () => ProjectListItemPresentation[];
  createProject: (project: CreateProject) => Promise<any>;
  updateProject: (id: string, project: CreateProject) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  startTimer: (projectId: string) => Promise<void>;
  stopTimer: (projectId: string) => Promise<void>;
  createCounter: (projectId: string, counter: CreateCounter) => Promise<any>;
  updateCounter: (projectId: string, counterId: string, update: EditCounter) => Promise<any>;
  deleteCounter: (projectId: string, counterId: string) => Promise<any>;
  incrementCounter: (projectId: string, counterId: string, step: number) => Promise<any>;
  reorderCounters: (projectId: string, orderedIds: string[]) => Promise<any>;
  remoteLogin: (login: LoginParameters) => Promise<void>;
  authStatus: DatabaseConnectionPresentation;
  signOut: () => Promise<void>;
  initialLoadingDone: boolean;
}

export const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function useDatabase(): DatabaseContextType {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
