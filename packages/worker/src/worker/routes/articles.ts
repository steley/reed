import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { articles, feeds } from "../../db/schema.ts";
import type { Variables } from "../index.ts";

export const articlesRouter = new Hono<{ Variables: Variables }>();

// GET /api/articles?feed_id=&folder_id=&unread=true
articlesRouter.get("/", async (c) => {
  const db = c.get("db");
  const feedId = c.req.query("feed_id");
  const folderId = c.req.query("folder_id");
  const unread = c.req.query("unread");

  const conditions = [];
  if (feedId) conditions.push(eq(articles.feedId, feedId));
  if (folderId) {
    conditions.push(
      inArray(
        articles.feedId,
        db.select({ id: feeds.id }).from(feeds).where(eq(feeds.folderId, folderId)),
      ),
    );
  }
  if (unread === "true") conditions.push(eq(articles.read, 0));

  const rows = await db
    .select()
    .from(articles)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(articles.publishedAt);

  return c.json(rows);
});

// PATCH /api/articles/:id
articlesRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const read = (body as Record<string, unknown>).read;
  if (typeof read !== "boolean") {
    return c.json({ error: "read (boolean) is required" }, 400);
  }

  const existing = await db
    .select({ id: articles.id })
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  if (existing.length === 0) {
    return c.json({ error: "Article not found" }, 404);
  }

  await db
    .update(articles)
    .set({ read: read ? 1 : 0 })
    .where(eq(articles.id, id));

  const updated = await db.select().from(articles).where(eq(articles.id, id)).limit(1);

  return c.json(updated[0]);
});
