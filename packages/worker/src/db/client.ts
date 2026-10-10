import { createClient, type Client } from "@libsql/client/web";
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
 * Uses the pure-JS `@libsql/client/web` entry (HTTP transport, zero native
 * dependencies, statically importable) so the same bundle runs on any
 * serverless platform. Only supports remote URLs — local `file:` development
 * goes through scripts/dev.ts, which builds a Node client and injects it as a
 * db override (see createApp).
 *
 * Supported TURSO_DATABASE_URL values:
 * - `libsql://<db>-<org>.turso.io`  — remote Turso database (production)
 * - `wss://` / `https://`           — any other remote libsql server
 *
 * authToken is required for remote URLs. Values are trimmed to survive
 * whitespace picked up when pasting secrets.
 */
export function getDb(): DB {
  if (!client) {
    const url = (process.env.TURSO_DATABASE_URL ?? "").trim();
    if (!url) {
      throw new Error("TURSO_DATABASE_URL is not set. Set it to a libsql:// (Turso) URL.");
    }
    if (url.startsWith("file:")) {
      throw new Error(
        "file: URLs are not supported by the web client. For local dev, run scripts/dev.ts (it injects a Node client); for production use libsql://.",
      );
    }
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
    if (!authToken) {
      throw new Error("TURSO_AUTH_TOKEN is not set.");
    }
    client = createClient({ url, authToken });
  }
  return drizzle(client, { schema });
}
