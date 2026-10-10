import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { feeds } from "../../db/schema.ts";
import { refreshFeed } from "../../lib/refresh.ts";
import type { Variables } from "../index.ts";

export const feedsRouter = new Hono<{ Variables: Variables }>();

// GET /api/feeds
feedsRouter.get("/", async (c) => {
  const db = c.get("db");
  const rows = await db.select().from(feeds).orderBy(feeds.createdAt);
  return c.json(rows);
});

// POST /api/feeds
feedsRouter.post("/", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const feedUrl = (body as Record<string, unknown>).url;
  if (typeof feedUrl !== "string" || !feedUrl.trim()) {
    return c.json({ error: "url is required" }, 400);
  }

  const db = c.get("db");

  const existing = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(eq(feeds.url, feedUrl.trim()))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: "Feed URL already exists" }, 409);
  }

  const id = crypto.randomUUID();
  await db.insert(feeds).values({
    id,
    url: feedUrl.trim(),
    createdAt: Date.now(),
  });

  const created = await db.select().from(feeds).where(eq(feeds.id, id)).limit(1);
  return c.json(created[0], 201);
});

// DELETE /api/feeds/:id
feedsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");

  const existing = await db.select({ id: feeds.id }).from(feeds).where(eq(feeds.id, id)).limit(1);

  if (existing.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }

  await db.delete(feeds).where(eq(feeds.id, id));
  return new Response(null, { status: 204 });
});

// POST /api/feeds/:id/refresh
feedsRouter.post("/:id/refresh", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");

  const existing = await db.select({ id: feeds.id }).from(feeds).where(eq(feeds.id, id)).limit(1);

  if (existing.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }

  try {
    const result = await refreshFeed(id, db);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refresh failed";
    return c.json({ error: message }, 502);
  }
});
