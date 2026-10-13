# Project data migrations

ctrl-knit stores project documents in PouchDB. Each document has a `version` field that identifies its data structure. Reads, writes, deletes, and synced change delivery pass through the migration store so older documents are upgraded before the application uses them.

## How migrations work

Migration steps are kept in `app/hooks/api/migrations/versions/` and run in a fixed linear order. Each step transforms a cloned document and validates the result before the next step starts.

The migration runner:

- checks the document version before accessing project data;
- applies every required migration in order;
- validates the final document against the current schema;
- commits the fully migrated document in one PouchDB write;
- leaves the original document untouched until that write succeeds.

The initial migration converts a missing version field to `v1`. PouchDB does not provide a transaction across the entire database, so migration atomicity applies to one project document at a time.

## Adding a migration

For a schema change:

1. Add a file in `app/hooks/api/migrations/versions/` exporting one `Migration` with `from`, `to`, `up`, and a validator for the output schema.
2. Keep `up` synchronous and free of external side effects. It receives a disposable clone and must return the transformed document.
3. Manually import the migration and append it to the ordered list in `app/hooks/api/migrations/ProjectMigrations.ts`.
4. Update `CURRENT_PROJECT_VERSION` in `app/hooks/api/migrations/Migration.ts` and update the current application model.
5. Leave existing migration files unchanged. Every migration must remain available so documents from older versions can be upgraded later.

A migration chain must be continuous and non-branching. For example:

```text
missing version → v1 → v2 → v3
```

A new migration should always start at the version produced by the previous migration and end at the new current version.

## Failure and cancellation

If a migration or schema validation fails, the original project payload is preserved. The document is marked with `version: "invalid"` and includes failure details. Further access is blocked until the document is explicitly repaired and its original version is restored, or the version field is removed if the document was originally unversioned.

Unknown, future, malformed, and already-invalid versions are blocked without changing the document. A cancellation before the commit leaves the original document untouched. Once the write has completed, the document is fully migrated even if cancellation happens immediately afterwards.

Business-operation failures do not mark a document invalid. Migration quarantine is used only when a migration stage or schema validation fails.

## Conflict handling

When PouchDB reports conflicting revisions, the migration store validates the conflict leaves before selecting the winner. It chooses the supported revision with the newest `updatedAt` timestamp, migrates that revision, commits it, and then removes obsolete conflict leaves.

Unsupported or invalid conflict leaves block automatic conflict resolution so that no schema version is silently discarded.
