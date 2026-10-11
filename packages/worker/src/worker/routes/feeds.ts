import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { articles, feeds, folders } from "../../db/schema.ts";
import { assertFetchableUrl, refreshFeed } from "../../lib/refresh.ts";
import { requireAuth } from "../../lib/auth.ts";
import type { Variables } from "../index.ts";

export const feedsRouter = new Hono<{ Variables: Variables }>();

feedsRouter.use("*", requireAuth);

// GET /api/feeds
feedsRouter.get("/", async (c) => {
  const db = c.get("db");
  const rows = await db
    .select()
    .from(feeds)
    .where(eq(feeds.userId, c.get("userId")))
    .orderBy(feeds.createdAt);
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

  const feedUrl = (body as Record<string, unknown> | null)?.url;
  if (typeof feedUrl !== "string" || !feedUrl.trim()) {
    return c.json({ error: "url is required" }, 400);
  }
  try {
    assertFetchableUrl(feedUrl.trim());
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "Invalid URL" }, 400);
  }

  const db = c.get("db");
  const userId = c.get("userId");

  const existing = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(and(eq(feeds.userId, userId), eq(feeds.url, feedUrl.trim())))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: "Feed URL already exists" }, 409);
  }

  const id = crypto.randomUUID();
  try {
    await db.insert(feeds).values({
      id,
      userId,
      url: feedUrl.trim(),
      createdAt: Date.now(),
    });
  } catch (err) {
    // Concurrent duplicate insert (check-then-insert race) → 409, not 500
    if (err instanceof Error && /UNIQUE|duplicate key/i.test(err.message)) {
      return c.json({ error: "Feed URL already exists" }, 409);
    }
    throw err;
  }

  const created = await db.select().from(feeds).where(eq(feeds.id, id)).limit(1);
  return c.json(created[0], 201);
});

// DELETE /api/feeds/:id
feedsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");

  const existing = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(and(eq(feeds.id, id), eq(feeds.userId, c.get("userId"))))
    .limit(1);

  if (existing.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }

  // Postgres enforces the FK's ON DELETE cascade, so articles go with the
  // feed; the explicit delete is belt-and-braces for cascade misconfiguration.
  await db.delete(articles).where(eq(articles.feedId, id));
  await db.delete(feeds).where(eq(feeds.id, id));
  return new Response(null, { status: 204 });
});

// PATCH /api/feeds/:id — move feed into/out of a folder
feedsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const folderId = (body as Record<string, unknown> | null)?.folderId;
  if (folderId !== null && typeof folderId !== "string") {
    return c.json({ error: "folderId (string | null) is required" }, 400);
  }

  const db = c.get("db");
  const userId = c.get("userId");

  const existing = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(and(eq(feeds.id, id), eq(feeds.userId, userId)))
    .limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }

  if (folderId !== null) {
    const folder = await db
      .select({ id: folders.id })
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))
      .limit(1);
    if (folder.length === 0) {
      return c.json({ error: "Folder not found" }, 404);
    }
  }

  await db.update(feeds).set({ folderId }).where(eq(feeds.id, id));

  const updated = await db.select().from(feeds).where(eq(feeds.id, id)).limit(1);
  return c.json(updated[0]);
});

// POST /api/feeds/:id/refresh
feedsRouter.post("/:id/refresh", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");

  const existing = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(and(eq(feeds.id, id), eq(feeds.userId, c.get("userId"))))
    .limit(1);

  if (existing.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }

  try {
    const result = await refreshFeed(id, db);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refresh failed";
    // Same failure surfacing the hourly cron does — sidebar error dot
    await db
      .update(feeds)
      .set({ lastError: message.slice(0, 500) })
      .where(eq(feeds.id, id));
    return c.json({ error: message }, 502);
  }
});
