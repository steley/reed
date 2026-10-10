import { Hono } from "hono";
import { sql } from "drizzle-orm";
import type { DB } from "../db/client.ts";
import { getDb } from "../db/client.ts";
import { feedsRouter } from "./routes/feeds.ts";
import { articlesRouter } from "./routes/articles.ts";

// Hono context variable: db is injected by middleware so routes are testable
export type Variables = {
  db: DB;
};

export function createApp(dbOverride?: DB) {
  const app = new Hono<{ Variables: Variables }>();

  // Inject db into context — allows tests/dev to pass in a db override.
  // getDb() failure is swallowed here: /api/health reports the real reason,
  // other routes fail through onError.
  app.use("*", async (c, next) => {
    if (dbOverride) {
      c.set("db", dbOverride);
    } else {
      try {
        c.set("db", getDb());
      } catch {
        // leave db unset — onError / health handle it
      }
    }
    await next();
  });

  // Real health check: verifies the database connection, not just the process.
  app.get("/api/health", async (c) => {
    try {
      const db = getDb();
      await db.run(sql`SELECT 1`);
      return c.json({ status: "ok", db: "connected" });
    } catch (err) {
      return c.json(
        { status: "degraded", db: err instanceof Error ? err.message : String(err) },
        503,
      );
    }
  });

  app.onError((err, c) => c.json({ error: err.message }, 500));

  app.route("/api/feeds", feedsRouter);
  app.route("/api/articles", articlesRouter);
  app.notFound((c) => c.json({ error: "Not found" }, 404));

  return app;
}
