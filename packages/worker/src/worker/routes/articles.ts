import { Hono } from "hono";
import { and, desc, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { articles, feeds } from "../../db/schema.ts";
import { requireAuth } from "../../lib/auth.ts";
import type { Variables } from "../index.ts";

export const articlesRouter = new Hono<{ Variables: Variables }>();

articlesRouter.use("*", requireAuth);

// GET /api/articles?feed_id=&folder_id=&unread=true&q=
articlesRouter.get("/", async (c) => {
  const db = c.get("db");
  const feedId = c.req.query("feed_id");
  const folderId = c.req.query("folder_id");
  const unread = c.req.query("unread");
  const q = c.req.query("q")?.trim();

  const conditions: (SQL | undefined)[] = [
    // Every view is scoped to the session user's feeds
    inArray(
      articles.feedId,
      db
        .select({ id: feeds.id })
        .from(feeds)
        .where(eq(feeds.userId, c.get("userId"))),
    ),
  ];
  if (q) {
    // ILIKE substring search directly on articles, backed by the pg_trgm GIN
    // index (works for any token length — Chinese words are often 2 chars).
    // Backslash is LIKE/ILIKE's default escape char in Postgres, so % and _
    // in user input stay literal without an ESCAPE clause.
    for (const token of q.split(/\s+/)) {
      const pattern = `%${token
        .replaceAll("\\", "\\\\")
        .replaceAll("%", "\\%")
        .replaceAll("_", "\\_")}%`;
      conditions.push(
        or(
          ilike(articles.title, pattern),
          ilike(articles.summary, pattern),
          ilike(articles.content, pattern),
        ),
      );
    }
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

  // List responses omit `content` — full bodies are fetched per-article via
  // GET /api/articles/:id, keeping feed-switch payloads small.
  const rows = await db
    .select({
      id: articles.id,
      feedId: articles.feedId,
      url: articles.url,
      title: articles.title,
      summary: articles.summary,
      publishedAt: articles.publishedAt,
      read: articles.read,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt));

  return c.json(rows);
});

// GET /api/articles/:id — full article including content
articlesRouter.get("/:id", async (c) => {
  const db = c.get("db");
  const rows = await db
    .select({ article: articles })
    .from(articles)
    .innerJoin(feeds, eq(articles.feedId, feeds.id))
    .where(and(eq(articles.id, c.req.param("id")), eq(feeds.userId, c.get("userId"))))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return c.json({ error: "Article not found" }, 404);
  }
  return c.json(row.article);
});

// POST /api/articles/read-all — mark every unread article read,
// optionally scoped to one feed { feedId: string }
articlesRouter.post("/read-all", async (c) => {
  const db = c.get("db");

  let body: unknown = {};
  try {
    body = await c.req.json();
  } catch {
    // empty body = mark everything
  }

  const feedId = (body as Record<string, unknown> | null)?.feedId;
  if (feedId !== undefined && typeof feedId !== "string") {
    return c.json({ error: "feedId must be a string" }, 400);
  }

  const ownFeeds = inArray(
    articles.feedId,
    db
      .select({ id: feeds.id })
      .from(feeds)
      .where(eq(feeds.userId, c.get("userId"))),
  );
  const result = await db
    .update(articles)
    .set({ read: 1 })
    .where(
      feedId
        ? and(eq(articles.read, 0), eq(articles.feedId, feedId), ownFeeds)
        : and(eq(articles.read, 0), ownFeeds),
    );

  return c.json({ marked: result.rowCount ?? 0 });
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

  const read = (body as Record<string, unknown> | null)?.read;
  if (typeof read !== "boolean") {
    return c.json({ error: "read (boolean) is required" }, 400);
  }

  const existing = await db
    .select({ id: articles.id })
    .from(articles)
    .innerJoin(feeds, eq(articles.feedId, feeds.id))
    .where(and(eq(articles.id, id), eq(feeds.userId, c.get("userId"))))
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
