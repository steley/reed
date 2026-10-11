import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";

/**
 * Canonical database type used across the API, cron/refresh scripts, and tests.
 */
export type DB = NeonHttpDatabase<typeof schema>;

let db: DB | undefined;

/**
 * Lazily create a singleton Neon HTTP client from DATABASE_URL.
 *
 * The neon-http driver runs each query as a stateless HTTPS request to Neon's
 * proxy — no sockets, no pooling — so the same code runs identically on Vercel
 * serverless functions, GitHub Actions, and local dev.
 *
 * Values are trimmed to survive whitespace picked up when pasting secrets.
 */
export function getDb(): DB {
  if (!db) {
    const url = (process.env.DATABASE_URL ?? "").trim();
    if (!url) {
      throw new Error("DATABASE_URL is not set. Set it to a Neon postgresql:// connection string.");
    }
    db = drizzle(neon(url), { schema });
  }
  return db;
}
