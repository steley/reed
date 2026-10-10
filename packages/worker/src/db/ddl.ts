/**
 * Schema SQL for test databases (:memory:) and local file DBs
 * (scripts/local-db.ts), loaded from the drizzle migrations in ./drizzle.
 * Those generated migrations are the single source of schema truth — never
 * duplicate the DDL by hand here.
 */
import { readFileSync, readdirSync } from "node:fs";

const migrationsDir = new URL("../../drizzle/", import.meta.url);

export const SCHEMA_SQL = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .map((f) => readFileSync(new URL(f, migrationsDir), "utf8"))
  .join("\n");
