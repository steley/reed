import { Hono } from "hono";
import type { DB } from "../db/client.ts";
import { getDb } from "../db/client.ts";
import { feedsRouter } from "./routes/feeds.ts";
import { articlesRouter } from "./routes/articles.ts";

/**
 * No platform bindings — the database is reached over HTTP (libsql client) and
 * configured via environment variables (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN).
 * Kept as Hono's Bindings type for route typing consistency.
 */
export type Env = Record<string, string>;

// Hono context variable: db is injected by middleware so routes are testable
export type Variables = {
  db: DB;
};

export function createApp(dbOverride?: DB) {
  const app = new Hono<{ Bindings: Env; Variables: Variables }>();

  // Inject db into context — allows tests to pass in a test db
  app.use("*", async (c, next) => {
    c.set("db", dbOverride ?? getDb());
    await next();
  });

  app.get("/api/health", (c) => c.json({ status: "ok" }));
  app.route("/api/feeds", feedsRouter);
  app.route("/api/articles", articlesRouter);
  app.notFound((c) => c.json({ error: "Not found" }, 404));

  return app;
}
