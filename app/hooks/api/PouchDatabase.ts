import PouchDB from "pouchdb";
import { v4 as uuidv4 } from "uuid";
import type { CouchDbSession } from "~/models/CouchDbSession";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import type { EditCounter } from "~/models/entities/counter/EditCounter";
import type { CreateProject } from "~/models/entities/project/CreateProject";
import type { CouchDbProject, DatabaseProject } from "~/models/entities/project/DatabaseProject";
import type { Project } from "~/models/entities/project/Project";
import { ProjectMigrationError } from "~/models/error/ProjectMigrationError";
import { clamp } from "~/utility/clamp";
import { isValidProjectUrl } from "~/utility/isValidProjectUrl";
import {
  AuthenticationError,
  ConnectionError,
  ForbiddenError,
  UnexpectedError
} from "../../models/error/ConnectionError";
import { PROJECT_DOCUMENT_PREFIX } from "./migrations/Migration";
import { MigratingProjectStore } from "./migrations/MigratingProjectStore";

export class PouchDatabase {
  private localDb: PouchDB.Database;
  private readonly projectStore: MigratingProjectStore;
  private remoteDb: PouchDB.Database | null = null;
  private remoteDbBaseUrl: string | null = null;
  private syncHandler: PouchDB.Replication.Sync<{}> | null = null;

  constructor() {
    this.localDb = new PouchDB("ctrl-knit");
    this.projectStore = new MigratingProjectStore(this.localDb);
  }

  private async authenticateRemote(username: string, password: string, url: string) {
    let response: Response;
    try {
      response = await fetch(`https://${url}/_session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password: password }),
        credentials: "include"
      });
    } catch (error) {
      throw new ConnectionError(
        `Failed to reach remote database at ${url}. Please check your connection and try again.`
      );
    }
    if (!response.ok) {
      throw new AuthenticationError(
        `Authentication failed for user ${username} at ${url}. Please check your credentials and try again. Response: ${response.statusText}`
      );
    }
  }

  public async initializeRemoteDb(username: string, password: string, url: string, dbName: string) {
    await this.authenticateRemote(username, password, url);
    const remoteDb = new PouchDB(`https://${url}/${dbName}`);
    try {
      await remoteDb.info();
    } catch (error) {
      throw new ConnectionError(
        `Failed to connect to remote database at ${url}/${dbName}. Please check your connection and try again.`
      );
    }
    this.remoteDb = remoteDb;
    this.remoteDbBaseUrl = url;
    this.sync();
  }

  private sync() {
    if (!this.remoteDb) {
      throw new Error("Remote database is not initialized. Call initializeRemoteDb first.");
    }
    this.cancelSync();
    this.syncHandler = this.localDb.sync(this.remoteDb, { live: true, retry: true });
  }

  private cancelSync() {
    this.syncHandler?.cancel();
    this.syncHandler = null;
  }

  public async getSession(baseUrl: string, dbName: string): Promise<CouchDbSession> {
    let response: Response;
    try {
      response = await fetch(`https://${baseUrl}/_session?basic=false`, {
        method: "GET",
        credentials: "include"
      });
    } catch (error) {
      throw new ConnectionError(`Failed to connect to remote database at ${baseUrl}. Please check your connection.`);
    }
    if (response.status === 401) {
      throw new AuthenticationError("Failed to authenticate. Please check your credentials and try again.");
    }
    if (response.status === 403) {
      throw new ForbiddenError("Access denied. You do not have permission to access this resource.");
    }
    this.remoteDb = new PouchDB(`https://${baseUrl}/${dbName}`);
    this.remoteDbBaseUrl = baseUrl;
    this.sync();
    return (await response.json()) as CouchDbSession;
  }

  public async signOut() {
    let response: Response;
    try {
      response = await fetch(`https://${this.remoteDbBaseUrl}/_session`, {
        method: "DELETE",
        credentials: "include"
      });
    } catch (error) {
      throw new ConnectionError(
        `Failed to sign out from remote database at ${this.remoteDbBaseUrl}. Please check your connection and try again.`
      );
    }
    if (!response.ok) {
      throw new AuthenticationError(`Failed to sign out. Response: ${response.statusText}`);
    }
    this.cancelSync();
    this.remoteDb = null;
    this.remoteDbBaseUrl = null;
  }

  public shutdown() {
    this.cancelSync();
  }

  public onChange(
    onDelete: (id: string) => void,
    onUpdate: (project: Project) => void,
    onError: (error: unknown) => void = console.error,
    signal?: AbortSignal
  ) {
    let queue: Promise<void> = Promise.resolve();
    let active = true;
    return this.localDb
      .changes({ live: true, since: "now" })
      .on("change", (change) => {
        if (!change.id.startsWith(PROJECT_DOCUMENT_PREFIX)) return;
        // Re-read instead of trusting event payloads: replication and migration commits can make them stale.
        queue = queue
          .then(async () => {
            if (!active || signal?.aborted) return;
            if (change.deleted) {
              onDelete(change.id);
              return;
            }
            try {
              const document = await this.projectStore.get(change.id, signal);
              if (active && !signal?.aborted) onUpdate(this.projectFromDocument(document));
            } catch (error) {
              if (typeof error === "object" && error !== null && "status" in error && error.status === 404) {
                if (active && !signal?.aborted) onDelete(change.id);
                return;
              }
              throw error;
            }
          })
          .catch((error: unknown) => {
            if (active && !signal?.aborted) onError(error);
          });
      })
      .on("complete", () => {
        active = false;
      })
      .on("error", onError);
  }

  public async createProject(project: CreateProject) {
    const now = new Date().toJSON();
    return this.runProjectOperation("create project", () =>
      this.projectStore.create({
        _id: `${PROJECT_DOCUMENT_PREFIX}${now}`,
        name: project.name,
        url: isValidProjectUrl(project.url) ? project.url : undefined,
        createdAt: now,
        updatedAt: now,
        lastUpdatedCounter: undefined,
        trackedTime: 0,
        counters: []
      })
    );
  }

  public async updateProject(id: string, project: CreateProject) {
    return this.editProject(id, "update project", (existing) => ({
      ...existing,
      ...project,
      url: isValidProjectUrl(project.url) ? project.url : undefined,
      updatedAt: new Date().toJSON()
    }));
  }

  public async startTimer(projectId: string): Promise<void> {
    const startedAt = new Date().toJSON();
    await this.editProject(projectId, "start timer", (project) => {
      if (project.timeSpanStart) return;
      return { ...project, timeSpanStart: startedAt, updatedAt: startedAt };
    });
  }

  public async stopTimer(projectId: string): Promise<void> {
    const endedAt = new Date();
    await this.editProject(projectId, "stop timer", (project) => {
      if (!project.timeSpanStart) return;
      const startedAt = Date.parse(project.timeSpanStart);
      const duration = endedAt.getTime() - startedAt;
      if (!Number.isFinite(startedAt) || duration < 0) {
        throw new UnexpectedError("Failed to stop timer: the timer start time is invalid.");
      }
      const { timeSpanStart, ...withoutTimer } = project;
      return { ...withoutTimer, trackedTime: project.trackedTime + duration, updatedAt: endedAt.toJSON() };
    });
  }

  public async deleteProject(id: string) {
    return this.runProjectOperation("delete project", () => this.projectStore.remove(id));
  }

  public async getProjects(signal?: AbortSignal, onError?: (error: ProjectMigrationError) => void): Promise<Project[]> {
    const documents = await this.projectStore.getAll(signal, onError);
    return documents.map((document) => this.projectFromDocument(document));
  }

  public async createCounter(projectId: string, counter: CreateCounter) {
    const counterId = `counter:${uuidv4()}`;
    const now = new Date().toJSON();
    return this.editProject(projectId, "create counter", (project) => ({
      ...project,
      counters: [
        {
          id: counterId,
          name: counter.name,
          order: 0,
          count: { current: 0, target: counter.count?.target },
          stepOver: counter.stepOver ? { target: counter.stepOver.target } : undefined,
          createdAt: now,
          editedAt: now
        },
        ...project.counters.map((existing) => ({ ...existing, order: existing.order + 1 }))
      ],
      updatedAt: now,
      lastUpdatedCounter: counterId
    }));
  }

  public async updateCounter(projectId: string, counterId: string, update: EditCounter) {
    return this.editProject(projectId, "update counter", (project) => ({
      ...project,
      counters: project.counters.map((counter) => {
        if (counter.id !== counterId) return counter;
        const stepOverMultiplier = update.stepOver?.target ?? counter.stepOver?.target ?? 1;
        const updatedTarget = update.count?.target ?? counter.count.target;
        const clampMax = updatedTarget ? updatedTarget * stepOverMultiplier : Number.MAX_VALUE;
        return {
          ...counter,
          count: {
            current: clamp(counter.count.current, 0, clampMax),
            target: updatedTarget
          },
          stepOver: update.stepOver ? { target: update.stepOver.target ?? counter.stepOver?.target } : undefined,
          name: update.name ?? counter.name
        };
      }),
      updatedAt: new Date().toJSON()
    }));
  }

  public async incrementCounter(projectId: string, counterId: string, increment: number) {
    return this.editProject(projectId, "increment counter", (project) => ({
      ...project,
      counters: project.counters.map((counter) => {
        if (counter.id !== counterId) return counter;
        const current = counter.count.current + increment;
        const max =
          counter.count.target === undefined
            ? undefined
            : counter.stepOver
              ? counter.stepOver.target * counter.count.target
              : counter.count.target;
        return {
          ...counter,
          count: { ...counter.count, current: max === undefined ? Math.max(current, 0) : clamp(current, 0, max) },
          editedAt: new Date().toJSON()
        };
      }),
      updatedAt: new Date().toJSON(),
      lastUpdatedCounter: counterId
    }));
  }

  public async deleteCounter(projectId: string, counterId: string) {
    return this.editProject(projectId, "delete counter", (project) => {
      const counters = project.counters.filter((counter) => counter.id !== counterId);
      return {
        ...project,
        counters,
        updatedAt: new Date().toJSON(),
        lastUpdatedCounter:
          project.lastUpdatedCounter !== counterId
            ? project.lastUpdatedCounter
            : this.findLastIncrementedCounter(counters)
      };
    });
  }

  public async reorderCounters(projectId: string, orderedIds: string[]) {
    return this.editProject(projectId, "reorder counters", (project) => ({
      ...project,
      counters: project.counters.map((counter) => {
        const order = orderedIds.indexOf(counter.id);
        return { ...counter, order: order !== -1 ? order : counter.order };
      }),
      updatedAt: new Date().toJSON()
    }));
  }

  public async disconnectRemote() {
    if (!this.remoteDb) {
      throw new Error("Remote database is not initialized. Call initializeRemoteDb first.");
    }
    this.cancelSync();
    await this.remoteDb.close();
    this.remoteDb = null;
  }

  public async close() {
    this.cancelSync();
    await this.localDb.close();
    await this.remoteDb?.close();
    this.remoteDb = null;
  }

  private editProject(id: string, operation: string, update: (project: CouchDbProject) => DatabaseProject | undefined) {
    return this.runProjectOperation(operation, () => this.projectStore.update(id, update));
  }

  private async runProjectOperation<T>(operation: string, work: () => Promise<T>): Promise<T> {
    try {
      return await work();
    } catch (error) {
      if (error instanceof ProjectMigrationError || error instanceof UnexpectedError) throw error;
      throw new UnexpectedError(`Failed to ${operation}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private findLastIncrementedCounter(counters: DatabaseProject["counters"]) {
    return counters.reduce<(typeof counters)[number] | undefined>((latest, counter) => {
      if (!latest || Date.parse(counter.editedAt) > Date.parse(latest.editedAt)) return counter;
      return latest;
    }, undefined)?.id;
  }

  private projectFromDocument(document: DatabaseProject): Project {
    return {
      id: document._id,
      name: document.name,
      url: document.url,
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt),
      counters: document.counters.map((counter) => ({
        ...counter,
        createdAt: new Date(counter.createdAt),
        editedAt: new Date(counter.editedAt)
      })),
      lastUpdatedCounter: document.lastUpdatedCounter,
      trackedTime: document.trackedTime,
      timeSpanStart: document.timeSpanStart ? new Date(document.timeSpanStart) : undefined
    };
  }
}
