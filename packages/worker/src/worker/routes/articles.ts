import { Hono } from "hono";
import { and, eq, inArray, sql } from "drizzle-orm";
import { articles, feeds } from "../../db/schema.ts";
import type { Variables } from "../index.ts";

export const articlesRouter = new Hono<{ Variables: Variables }>();

// GET /api/articles?feed_id=&folder_id=&unread=true&q=
articlesRouter.get("/", async (c) => {
  const db = c.get("db");
  const feedId = c.req.query("feed_id");
  const folderId = c.req.query("folder_id");
  const unread = c.req.query("unread");
  const q = c.req.query("q")?.trim();

  const conditions = [];
  if (q) {
    // Quote each whitespace-separated token so user input can't inject FTS5
    // query syntax; multiple words AND together.
    const match = q
      .split(/\s+/)
      .map((word) => `"${word.replaceAll('"', '""')}"`)
      .join(" ");
    const ftsRows = await db.all<{ article_id: string }>(
      sql`SELECT article_id FROM articles_fts WHERE articles_fts MATCH ${match}`,
    );
    const ids = ftsRows.map((row) => row.article_id);
    if (ids.length === 0) return c.json([]);
    conditions.push(inArray(articles.id, ids));
  }
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
