import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { SCHEMA_SQL } from "../db/ddl.ts";
import * as schema from "../db/schema.ts";

/**
 * Create an in-memory SQLite database with the reed schema applied.
 * Used in tests as a drop-in replacement for a real database connection.
 */
export function createTestDb(): LibSQLDatabase<typeof schema> {
  const client = createClient({ url: ":memory:" });
  const db = drizzle(client, { schema });

  // Apply schema synchronously via raw SQL
  client.executeMultiple(SCHEMA_SQL);

  return db;
}
