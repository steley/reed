/**
 * Local API dev server (replaces `wrangler dev`). Listens on :8787 — the Vite
 * dev server proxies /api/* here.
 *
 * Supports both local SQLite files and a remote Turso DB:
 *   TURSO_DATABASE_URL=file:local.db  pnpm dev
 *   TURSO_DATABASE_URL=libsql://...   TURSO_AUTH_TOKEN=... pnpm dev
 *
 * The app itself only uses the pure-JS web client (remote URLs); this script
 * builds a full Node client so local file: databases work too, and injects it
 * as a db override.
 */
import { serve } from "@hono/node-server";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { createApp } from "../src/worker/index.ts";
import * as schema from "../src/db/schema.ts";

const url = (process.env.TURSO_DATABASE_URL ?? "file:local.db").trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
const client = createClient(authToken ? { url, authToken } : { url });
const db = drizzle(client, { schema });

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: createApp(db).fetch, port }, (info) => {
  console.log(`cloud-reader API listening on http://localhost:${info.port} (db: ${url})`);
});
