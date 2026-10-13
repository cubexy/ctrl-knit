import type { Migration, MigrationDocument } from "../Migration";

function record(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${field} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function string(value: unknown, field: string): void {
  if (typeof value !== "string") throw new Error(`${field} must be a string.`);
}

function optionalString(value: unknown, field: string): void {
  if (value !== undefined) string(value, field);
}

function number(value: unknown, field: string): void {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${field} must be a finite number.`);
}

function timestamp(value: unknown, field: string): void {
  string(value, field);
  if (!Number.isFinite(Date.parse(value as string))) throw new Error(`${field} must be a valid timestamp.`);
}

/** This schema is frozen at v1. Future schema changes belong in a new migration file. */
const initToV1: Migration = {
  from: undefined,
  to: "v1",
  up(document) {
    const counters = document.counters ?? [];
    if (!Array.isArray(counters)) throw new Error("counters must be an array.");
    return {
      ...document,
      counters: counters.map((value, index) => {
        const counter = record(value, `counters[${index}]`);
        return { ...counter, order: counter.order ?? index };
      }),
      trackedTime: document.trackedTime ?? 0
    };
  },
  validate(document: Readonly<MigrationDocument>) {
    string(document._id, "_id");
    optionalString(document._rev, "_rev");
    if (document.version !== "v1") throw new Error("version must be v1.");
    string(document.name, "name");
    optionalString(document.url, "url");
    optionalString(document.lastUpdatedCounter, "lastUpdatedCounter");
    timestamp(document.createdAt, "createdAt");
    timestamp(document.updatedAt, "updatedAt");
    if (document.timeSpanStart !== undefined) timestamp(document.timeSpanStart, "timeSpanStart");
    number(document.trackedTime, "trackedTime");
    if ((document.trackedTime as number) < 0) throw new Error("trackedTime must not be negative.");
    if (!Array.isArray(document.counters)) throw new Error("counters must be an array.");
    document.counters.forEach((value, index) => {
      const field = `counters[${index}]`;
      const counter = record(value, field);
      string(counter.id, `${field}.id`);
      string(counter.name, `${field}.name`);
      timestamp(counter.createdAt, `${field}.createdAt`);
      timestamp(counter.editedAt, `${field}.editedAt`);
      number(counter.order, `${field}.order`);
      if (!Number.isInteger(counter.order) || (counter.order as number) < 0) {
        throw new Error(`${field}.order must be a non-negative integer.`);
      }
      const count = record(counter.count, `${field}.count`);
      number(count.current, `${field}.count.current`);
      if (count.target !== undefined) number(count.target, `${field}.count.target`);
      if (counter.stepOver !== undefined) {
        const stepOver = record(counter.stepOver, `${field}.stepOver`);
        number(stepOver.target, `${field}.stepOver.target`);
      }
    });
  }
};

export default initToV1;
