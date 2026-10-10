import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema.ts";

/**
 * Canonical database type used across the API, cron/refresh scripts, and tests.
 */
export type DB = LibSQLDatabase<typeof schema>;

let client: Client | undefined;

/**
 * Lazily create a singleton libsql client from environment variables.
 *
 * Supported TURSO_DATABASE_URL values:
 * - `libsql://<db>-<org>.turso.io`  — remote Turso database (production)
 * - `file:local.db`                 — local SQLite file (offline development)
 *
 * authToken is required for remote URLs, ignored for file: URLs.
 */
export function getDb(): DB {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) {
      throw new Error(
        "TURSO_DATABASE_URL is not set. Set it to a libsql:// (Turso) or file: (local SQLite) URL.",
      );
    }
    const authToken = process.env.TURSO_AUTH_TOKEN;
    client = createClient(authToken ? { url, authToken } : { url });
  }
  return drizzle(client, { schema });
}
