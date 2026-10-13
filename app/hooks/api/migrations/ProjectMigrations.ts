import type { DatabaseProject } from "../../../models/entities/project/DatabaseProject";
import {
  InvalidProjectVersionError,
  MigrationStepError,
  UnsupportedProjectVersionError
} from "../../../models/error/ProjectMigrationError";
import { CURRENT_PROJECT_VERSION, INVALID_PROJECT_VERSION, type Migration, type MigrationDocument } from "./Migration";
import initToV1 from "./versions/init-to-v1";

/** Keep this ordered list explicit. Add one imported migration for each schema change. */
const migrations: readonly Migration[] = [initToV1];

export class ProjectMigrations {
  private readonly bySource = new Map<string | undefined, Migration>();
  private readonly current: Migration;

  constructor() {
    let expectedSource: string | undefined;
    const visited = new Set<string | undefined>([undefined]);
    for (const migration of migrations) {
      if (
        migration.from !== expectedSource ||
        this.bySource.has(migration.from) ||
        visited.has(migration.to) ||
        migration.to === INVALID_PROJECT_VERSION
      ) {
        throw new Error("Project migrations must form one continuous, non-branching chain from a missing version.");
      }
      this.bySource.set(migration.from, migration);
      visited.add(migration.to);
      expectedSource = migration.to;
    }
    const lastMigration = migrations.at(-1);
    if (!lastMigration || lastMigration.to !== CURRENT_PROJECT_VERSION) {
      throw new Error("The project migration chain must end at CURRENT_PROJECT_VERSION.");
    }
    this.current = lastMigration;
  }

  assertSupported(document: Readonly<MigrationDocument>): void {
    if (document.version === INVALID_PROJECT_VERSION) throw new InvalidProjectVersionError(document._id);
    // A malformed version is not the same thing as a missing version field.
    if (
      (Object.hasOwn(document, "version") && typeof document.version !== "string") ||
      (document.version !== CURRENT_PROJECT_VERSION && !this.bySource.has(document.version))
    ) {
      throw new UnsupportedProjectVersionError(document._id, document.version);
    }
  }

  migrate(original: Readonly<MigrationDocument>): DatabaseProject {
    this.assertSupported(original);
    let draft = structuredClone(original);
    while (draft.version !== CURRENT_PROJECT_VERSION) {
      const migration = this.bySource.get(draft.version);
      if (!migration) throw new UnsupportedProjectVersionError(original._id, draft.version);
      try {
        draft = migration.up(draft);
        // Identity, revision, and version are owned by the runner, not migration files.
        draft = { ...draft, _id: original._id, _rev: original._rev, version: migration.to };
        migration.validate(structuredClone(draft));
      } catch (cause) {
        throw new MigrationStepError(
          original._id,
          {
            originalVersion: original.version ?? null,
            failedFrom: migration.from ?? null,
            failedTo: migration.to,
            message: cause instanceof Error ? cause.message : "Unknown migration failure."
          },
          cause
        );
      }
    }
    // Also quarantine malformed documents already claiming to have the current schema.
    try {
      this.validateCurrent(draft);
    } catch (cause) {
      throw new MigrationStepError(
        original._id,
        {
          originalVersion: original.version ?? null,
          failedFrom: CURRENT_PROJECT_VERSION,
          failedTo: CURRENT_PROJECT_VERSION,
          message: cause instanceof Error ? cause.message : "Invalid current project schema."
        },
        cause
      );
    }
    // SAFETY: the current migration's runtime validator checked every persisted project field.
    return draft as unknown as DatabaseProject;
  }

  validateCurrent(document: Readonly<MigrationDocument>): void {
    this.assertSupported(document);
    if (document.version !== CURRENT_PROJECT_VERSION) {
      throw new UnsupportedProjectVersionError(document._id, document.version);
    }
    this.current.validate(structuredClone(document));
  }
}
