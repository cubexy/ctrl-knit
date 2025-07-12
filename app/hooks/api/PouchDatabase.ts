import PouchDB from "pouchdb";
import { v4 as uuidv4 } from "uuid";
import type { CouchDbSession } from "~/models/CouchDbSession";
import type { Counter } from "~/models/entities/counter/Counter";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import type { EditCounter } from "~/models/entities/counter/EditCounter";
import type { CreateProject } from "~/models/entities/project/CreateProject";
import type { DatabaseProject } from "~/models/entities/project/DatabaseProject";
import type { Project } from "~/models/entities/project/Project";
import { clamp } from "~/utility/clamp";
import { AuthenticationError, ConnectionError, ForbiddenError } from "../../models/error/ConnectionError";

export class PouchDatabase {
  private localDb: PouchDB.Database;
  private remoteDb: PouchDB.Database | null = null;
  private remoteDbBaseUrl: string | null = null;
  constructor() {
    this.localDb = new PouchDB("ctrl-knit");
  }

  /**
   * Authenticates with remote CouchDB server using session-based auth.
   * Throws AuthenticationError or ConnectionError on failure.
   */
  private async authenticateRemote(username: string, password: string, url: string) {
    let response: Response;
    try {
      response = await fetch(`https://${url}/_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

  /**
   * Initializes connection to remote CouchDB and starts syncing.
   * Returns sync promise after successful authentication.
   */
  public async initializeRemoteDb(username: string, password: string, url: string, dbName: string) {
    try {
      await this.authenticateRemote(username, password, url);
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof ConnectionError) {
        throw error; // Re-throw known errors
      }
      throw new Error(`Unexpected error`);
    }
    this.remoteDb = new PouchDB(`https://${url}/${dbName}`);
    try {
      await this.remoteDb.info();
    } catch (error) {
      throw new ConnectionError(
        `Failed to connect to remote database at ${url}/${dbName}. Please check your connection and try again.`
      );
    }
    this.remoteDbBaseUrl = url;
    return this.sync();
  }

  /**
   * Starts live bidirectional sync between local and remote databases.
   */
  private async sync() {
    if (!this.remoteDb) {
      throw new Error("Remote database is not initialized. Call initializeRemoteDb first.");
    }
    this.localDb.sync(this.remoteDb, {
      live: true,
      retry: true
    });
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
      throw new AuthenticationError(`Authentication failed. Please check your credentials and try again.`);
    }

    if (response.status === 403) {
      throw new ForbiddenError(`Access denied. You do not have permission to access this resource.`);
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
        `Failed to sign out from remote database at ${this.remoteDbBaseUrl}. Please check your connection.`
      );
    }
    if (!response.ok) {
      throw new AuthenticationError(`Failed to sign out. Response: ${response.statusText}`);
    }
    this.remoteDb = null; // Clear remote database reference
    return response.json();
  }

  /**
   * Generates unique identifier with type prefix and UUID.
   */
  private generateIdentifier(type: "project" | "counter") {
    return `${type}:${uuidv4()}`;
  }

  /**
   * Sets up live change listener for database updates and deletions.
   * Returns change listener instance.
   */
  public onChange(onDelete: (id: string) => void, onUpdate: (doc: any) => void) {
    return this.localDb
      .changes({
        live: true,
        since: "now",
        include_docs: true
      })
      .on("change", (change) => {
        if (change.deleted) {
          // Document (project) was deleted
          const deletedDocumentIdentifier = change.id;
          onDelete(deletedDocumentIdentifier);
        } else {
          // Document (project, counter, ...) was added or updated
          const updatedDocument = change.doc;
          onUpdate(updatedDocument);
        }
      })
      .on("error", console.log.bind(console));
  }

  /**
   * Creates new project with timestamp ID and initial metadata.
   */
  public async createProject(project: CreateProject) {
    return await this.localDb.put({
      _id: new Date().toJSON(), // use timestamp as ID for default sorting
      name: project.name,
      url: project.url,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Updates existing project with new data and timestamp.
   */
  public async updateProject(id: string, project: CreateProject) {
    const existingProject = await this.localDb.get(id);
    const updatedProject = {
      ...existingProject,
      ...project,
      updatedAt: new Date()
    };
    return await this.localDb.put(updatedProject);
  }

  /**
   * Deletes project from database.
   */
  public async deleteProject(id: string) {
    const project = await this.localDb.get(id);
    return await this.localDb.remove(project);
  }

  /**
   * Retrieves all projects with proper date conversion and mapping.
   */
  public async getProjects(): Promise<Array<Project>> {
    const result = await this.localDb.allDocs({
      include_docs: true
    });
    const mappedDocs = result.rows.map((row) => {
      const doc = row.doc as unknown as DatabaseProject;
      return {
        id: doc._id,
        name: doc.name,
        url: doc.url,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
        counters: doc.counters || []
      };
    });
    return mappedDocs;
  }

  /**
   * Internal helper to fetch project document by ID.
   */
  private async getProjectById(id: string) {
    const project = await this.localDb.get(id);
    return project;
  }

  /**
   * Creates new counter and adds it to specified project.
   */
  public async createCounter(projectId: string, counter: CreateCounter) {
    const project = await this.getProjectById(projectId);
    const newCounter: Counter = {
      id: this.generateIdentifier("counter"),
      name: counter.name,
      count: {
        current: 0,
        target: counter.count ? counter.count.target : undefined
      },
      stepOver: counter.stepOver
        ? {
            target: counter.stepOver.target
          }
        : undefined,
      createdAt: new Date()
    };

    const updatedProject = {
      ...project,
      counters: [...((project as any).counters || []), newCounter],
      updatedAt: new Date()
    };

    return await this.localDb.put(updatedProject);
  }

  /**
   * Updates counter properties and clamps current value within limits.
   */
  public async updateCounter(projectId: string, counterId: string, update: EditCounter) {
    const project = await this.getProjectById(projectId);
    const updatedCounters = (project as unknown as Project).counters.map((c: Counter) => {
      if (c.id === counterId) {
        const stepOverMultiplier = update.stepOver?.target ?? c.stepOver?.target ?? 1;
        const updatedTarget = update.count?.target ?? c.count.target;
        const clampMax = updatedTarget ? updatedTarget * stepOverMultiplier : Number.MAX_VALUE;
        return {
          ...c,
          count: {
            current: clamp(c.count.current, 0, clampMax),
            target: update.count?.target ?? c.count.target
          },
          stepOver: update.stepOver ? { target: update.stepOver.target ?? c.stepOver?.target } : undefined,
          name: update.name ?? c.name
        };
      }
      return c;
    });

    const updatedProject = {
      ...project,
      counters: updatedCounters,
      updatedAt: new Date()
    };

    return await this.localDb.put(updatedProject);
  }

  /**
   * Increments counter value with clamping to valid range.
   */
  public async incrementCounter(projectId: string, counterId: string, increment: number) {
    const project = await this.getProjectById(projectId);

    const updatedCounters = (project as unknown as Project).counters.map((c: Counter) => {
      if (c.id === counterId) {
        const incrementedCurrent = c.count.current + increment;
        if (c.count.target === undefined) {
          return {
            ...c,
            count: {
              ...c.count,
              current: Math.max(incrementedCurrent, 0) // No target, just clamp to 0
            }
          };
        }
        // If stepOver is defined, calculate max based on target
        const max = c.stepOver ? c.stepOver.target * c.count.target : c.count.target;
        return {
          ...c,
          count: {
            ...c.count,
            current: clamp(incrementedCurrent, 0, max)
          }
        };
      }
      return c;
    });

    const updatedProject = {
      ...project,
      counters: updatedCounters,
      updatedAt: new Date()
    };

    return await this.localDb.put(updatedProject);
  }

  /**
   * Removes counter from project by filtering out the specified ID.
   */
  public async deleteCounter(projectId: string, counterId: string) {
    const project = await this.getProjectById(projectId);
    const updatedCounters = (project as unknown as Project).counters.filter((c: Counter) => c.id !== counterId);

    const updatedProject = {
      ...project,
      counters: updatedCounters,
      updatedAt: new Date()
    };

    return await this.localDb.put(updatedProject);
  }

  /**
   * Disconnects from remote database and cleans up connection.
   */
  public async disconnectRemote() {
    if (!this.remoteDb) {
      throw new Error("Remote database is not initialized. Call initializeRemoteDb first.");
    }
    this.remoteDb.close();
    this.remoteDb = null;
  }

  /**
   * Closes both local and remote database connections.
   */
  public async close() {
    await this.localDb.close();
    await this.remoteDb?.close();
    this.remoteDb = null;
  }
}
