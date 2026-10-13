import type { CouchDbProject, DatabaseProject } from "../../../models/entities/project/DatabaseProject";
import { MigrationStepError, ProjectMigrationError } from "../../../models/error/ProjectMigrationError";
import {
  CURRENT_PROJECT_VERSION,
  INVALID_PROJECT_VERSION,
  PROJECT_DOCUMENT_PREFIX,
  type MigrationDocument
} from "./Migration";
import { ProjectMigrations } from "./ProjectMigrations";

type ProjectUpdate = (project: CouchDbProject) => DatabaseProject | undefined;

export class MigratingProjectStore {
  private readonly migrations = new ProjectMigrations();
  private readonly queues = new Map<string, Promise<void>>();

  constructor(private readonly db: PouchDB.Database) {}

  async get(id: string, signal?: AbortSignal): Promise<CouchDbProject> {
    return (await this.access(id, undefined, signal)).document;
  }

  async getAll(signal?: AbortSignal, onError?: (error: ProjectMigrationError) => void): Promise<CouchDbProject[]> {
    signal?.throwIfAborted();
    const result = await this.db.allDocs({
      startkey: PROJECT_DOCUMENT_PREFIX,
      endkey: `${PROJECT_DOCUMENT_PREFIX}\ufff0`
    });
    const projects: CouchDbProject[] = [];
    for (const row of result.rows) {
      try {
        projects.push(await this.get(row.id, signal));
      } catch (error) {
        // A document can disappear between listing its ID and loading its payload.
        if (this.hasStatus(error, 404)) continue;
        if (!(error instanceof ProjectMigrationError) || !onError) throw error;
        onError(error);
      }
    }
    return projects;
  }

  async create(project: Omit<DatabaseProject, "version">, signal?: AbortSignal): Promise<PouchDB.Core.Response> {
    return this.exclusive(project._id, async () => {
      signal?.throwIfAborted();
      this.assertProjectId(project._id);
      const document = this.serialize({ ...project, version: CURRENT_PROJECT_VERSION });
      this.migrations.validateCurrent(document);
      signal?.throwIfAborted();
      return this.db.put(document);
    });
  }

  async update(id: string, update: ProjectUpdate, signal?: AbortSignal): Promise<PouchDB.Core.Response | undefined> {
    return (await this.access(id, update, signal)).response;
  }

  async remove(id: string, signal?: AbortSignal): Promise<PouchDB.Core.Response | undefined> {
    return this.update(id, (project) => ({ ...project, _deleted: true }), signal);
  }

  private async access(id: string, update?: ProjectUpdate, signal?: AbortSignal) {
    this.assertProjectId(id);
    return this.exclusive(id, async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        signal?.throwIfAborted();
        const original = await this.db.get<MigrationDocument>(id, { conflicts: true });
        let document: CouchDbProject;
        let response: PouchDB.Core.Response | undefined;
        try {
          const winner = await this.findWinner(original, signal);
          let migrated: DatabaseProject;
          try {
            migrated = this.migrations.migrate(winner);
          } catch (error) {
            if (!(error instanceof MigrationStepError)) throw error;
            signal?.throwIfAborted();
            // Restore the actual winning snapshot, not a partially transformed draft or a conflict leaf.
            const { _conflicts, ...snapshot } = original;
            await this.db.put({
              ...snapshot,
              version: INVALID_PROJECT_VERSION,
              migrationFailure: { ...error.failure, originalVersion: original.version ?? null }
            });
            throw error;
          }
          const staged = {
            ...migrated,
            _id: original._id,
            _rev: original._rev
          };
          const changed = update?.(structuredClone(staged));
          const needsCommit =
            changed !== undefined || winner._rev !== original._rev || winner.version !== CURRENT_PROJECT_VERSION;
          const serialized = this.serialize(changed ?? staged);
          // Business edits cannot change the schema version or the identity/revision we read.
          serialized._id = original._id;
          serialized._rev = original._rev;
          serialized.version = CURRENT_PROJECT_VERSION;
          delete serialized._conflicts;
          this.migrations.validateCurrent(serialized);
          signal?.throwIfAborted();
          if (needsCommit) response = await this.db.put(serialized);
          // SAFETY: validated current-schema fields plus an existing (or newly committed) revision.
          document = { ...serialized, _rev: response?.rev ?? original._rev } as unknown as CouchDbProject;
        } catch (error) {
          // Only retry an uncommitted operation. Never repeat a successful business edit after cleanup fails.
          if (this.hasStatus(error, 409) && attempt < 2) continue;
          throw error;
        }

        // Cleanup follows a successful commit/validation; a crash here only leaves redundant conflict leaves.
        for (const rev of original._conflicts ?? []) {
          try {
            signal?.throwIfAborted();
            await this.db.remove(id, rev);
          } catch (error) {
            console.error(`Failed to clean up conflict ${id}@${rev}; the project operation already succeeded.`, error);
            break;
          }
        }
        return { document, response };
      }
      throw new Error(`Failed to access project ${id} after repeated revision conflicts.`);
    });
  }

  private async findWinner(original: MigrationDocument, signal?: AbortSignal): Promise<MigrationDocument> {
    this.migrations.assertSupported(original);
    let winner = original;
    for (const rev of original._conflicts ?? []) {
      signal?.throwIfAborted();
      const candidate = await this.db.get<MigrationDocument>(original._id, { rev });
      // Never discard a quarantined or unsupported schema during conflict resolution.
      this.migrations.assertSupported(candidate);
      const winnerTime = this.updatedAt(winner);
      const candidateTime = this.updatedAt(candidate);
      if (candidateTime > winnerTime || (candidateTime === winnerTime && candidate._rev > (winner._rev ?? ""))) {
        winner = candidate;
      }
    }
    return winner;
  }

  private updatedAt(document: MigrationDocument): number {
    const time = typeof document.updatedAt === "string" ? Date.parse(document.updatedAt) : NaN;
    if (!Number.isFinite(time)) {
      throw new ProjectMigrationError(document._id, `Project ${document._id} has an invalid conflict timestamp.`);
    }
    return time;
  }

  private serialize(document: DatabaseProject): MigrationDocument {
    try {
      // SAFETY: PouchDB payloads are JSON; this freezes Date values as strings and removes undefined fields.
      return JSON.parse(JSON.stringify(document)) as MigrationDocument;
    } catch (cause) {
      throw new Error(`Project ${document._id} cannot be serialized.`, { cause });
    }
  }

  private assertProjectId(id: string): void {
    if (!id.startsWith(PROJECT_DOCUMENT_PREFIX)) throw new Error(`Not a project document: ${id}.`);
  }

  private hasStatus(error: unknown, status: number): boolean {
    return typeof error === "object" && error !== null && "status" in error && error.status === status;
  }

  private async exclusive<T>(id: string, work: () => Promise<T>): Promise<T> {
    const previous = this.queues.get(id) ?? Promise.resolve();
    const operation = previous.then(work);
    const tail = operation.then(
      () => undefined,
      () => undefined
    );
    this.queues.set(id, tail);
    try {
      return await operation;
    } finally {
      if (this.queues.get(id) === tail) this.queues.delete(id);
    }
  }
}
