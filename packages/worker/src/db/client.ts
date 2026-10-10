import { drizzle } from "drizzle-orm/libsql";
import type { Client } from "@libsql/client";
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
 * Remote URLs (libsql://, https://, wss://) use the pure-JS `@libsql/client/web`
 * entry via dynamic import — zero native dependencies, safe on any serverless
 * platform. Local `file:` URLs (dev only) load the full Node entry, which can
 * use the native libsql binding. Remote imports are deferred to call time so a
 * broken native module never breaks the whole bundle in production.
 *
 * Supported TURSO_DATABASE_URL values:
 * - `libsql://<db>-<org>.turso.io`  — remote Turso database (production)
 * - `file:local.db`                 — local SQLite file (offline development)
 *
 * authToken is required for remote URLs, ignored for file: URLs.
 */
export async function getDb(): Promise<DB> {
  if (!client) {
    const url = (process.env.TURSO_DATABASE_URL ?? "").trim();
    if (!url) {
      throw new Error(
        "TURSO_DATABASE_URL is not set. Set it to a libsql:// (Turso) or file: (local SQLite) URL.",
      );
    }
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
    const mod = url.startsWith("file:")
      ? await import("@libsql/client")
      : await import("@libsql/client/web");
    client = mod.createClient(authToken ? { url, authToken } : { url }) as Client;
  }
  return drizzle(client, { schema });
}
