import type { MigrationFailure } from "../../hooks/api/migrations/Migration";

export class ProjectMigrationError extends Error {
  constructor(
    public readonly projectId: string,
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = "ProjectMigrationError";
  }
}

export class InvalidProjectVersionError extends ProjectMigrationError {
  constructor(projectId: string) {
    super(projectId, `Project ${projectId} is marked invalid. Explicit repair is required before retrying migrations.`);
    this.name = "InvalidProjectVersionError";
  }
}

export class UnsupportedProjectVersionError extends ProjectMigrationError {
  constructor(projectId: string, version: unknown) {
    super(projectId, `Project ${projectId} has an unsupported schema version: ${String(version)}.`);
    this.name = "UnsupportedProjectVersionError";
  }
}

export class MigrationStepError extends ProjectMigrationError {
  constructor(
    projectId: string,
    public readonly failure: MigrationFailure,
    cause: unknown
  ) {
    super(projectId, `Failed to migrate project ${projectId} to ${failure.failedTo}: ${failure.message}`, { cause });
    this.name = "MigrationStepError";
  }
}
