export const CURRENT_PROJECT_VERSION = "v1";
export const INVALID_PROJECT_VERSION = "invalid";
export const PROJECT_DOCUMENT_PREFIX = "knit-project:";

/** Raw serialized data. Only migration files need to understand historical fields. */
export interface MigrationDocument {
  _id: string;
  _rev?: string;
  _conflicts?: string[];
  version?: string;
  [field: string]: unknown;
}

export interface MigrationFailure {
  originalVersion: string | null;
  failedFrom: string | null;
  failedTo: string;
  message: string;
}

/** undefined means that the source document has no version field. */
export interface Migration {
  readonly from: string | undefined;
  readonly to: string;
  /** Pure, synchronous transformation of a disposable clone; no external side effects. */
  up(document: Readonly<MigrationDocument>): MigrationDocument;
  validate(document: Readonly<MigrationDocument>): void;
}
