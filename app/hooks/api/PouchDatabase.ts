import PouchDB from "pouchdb";
import { v4 as uuidv4 } from "uuid";
import { clamp } from "~/utility/clamp";
import type { Counter, CreateCounter, EditCounter } from "../../models/Counter";
import type { CreateProject, DatabaseProject, Project } from "../../models/Project";

export class PouchDatabase {
  private localDb: PouchDB.Database;
  constructor() {
    this.localDb = new PouchDB("ctrl-knit");
  }

  private generateIdentifier(type: "project" | "counter") {
    return `${type}:${uuidv4()}`;
  }

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
      .on("error", console.log.bind(console)); // log errors to console for debugging
  }

  public async createProject(project: CreateProject) {
    return await this.localDb.put({
      _id: new Date().toJSON(), // use timestamp as ID for default sorting
      name: project.name,
      url: project.url,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public async updateProject(id: string, project: CreateProject) {
    const existingProject = await this.localDb.get(id);
    const updatedProject = {
      ...existingProject,
      ...project,
      updatedAt: new Date()
    };
    return await this.localDb.put(updatedProject);
  }

  public async deleteProject(id: string) {
    const project = await this.localDb.get(id);
    return await this.localDb.remove(project);
  }

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

  private async getProjectById(id: string) {
    const project = await this.localDb.get(id);
    return project;
  }

  public async createCounter(projectId: string, counter: CreateCounter) {
    const project = await this.getProjectById(projectId);
    const newCounter: Counter = {
      id: this.generateIdentifier("counter"),
      name: counter.name,
      count: {
        current: 0,
        target: counter.count.target
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

  public async updateCounter(projectId: string, counterId: string, update: EditCounter) {
    const project = await this.getProjectById(projectId);
    const updatedCounters = (project as unknown as Project).counters.map((c: Counter) => {
      if (c.id === counterId) {
        const stepOverMultiplier = update.stepOver ? update.stepOver.target : c.stepOver ? c.stepOver.target : 1;
        const updatedTarget = update.count?.target ?? c.count.target;
        return {
          ...c,
          count: {
            current: clamp(c.count.current, 0, updatedTarget * stepOverMultiplier),
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

  public async incrementCounter(projectId: string, counterId: string, increment: number) {
    const project = await this.getProjectById(projectId);

    const updatedCounters = (project as unknown as Project).counters.map((c: Counter) => {
      if (c.id === counterId) {
        const incrementedCurrent = c.count.current + increment;
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

  public async close() {
    await this.localDb.close();
  }
}
