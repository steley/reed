import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { articles, feeds, folders } from "../db/schema.ts";
import { authedRequest, createTestDb, seedUser } from "../lib/test-helpers.ts";
import { createApp } from "./index.ts";

let db: Awaited<ReturnType<typeof createTestDb>>;
let app: ReturnType<typeof createApp>;
let call: ReturnType<typeof authedRequest>;

const FEED_ID = "feed-1";
const ARTICLE_1 = {
  id: "art-1",
  feedId: FEED_ID,
  url: "https://example.com/one",
  title: "Article One",
  summary: "Summary one",
  content: null,
  publishedAt: 1000,
  read: 0,
  createdAt: Date.now(),
};
const ARTICLE_2 = {
  id: "art-2",
  feedId: FEED_ID,
  url: "https://example.com/two",
  title: "Article Two",
  summary: "Summary two",
  content: null,
  publishedAt: 2000,
  read: 1,
  createdAt: Date.now(),
};

beforeEach(async (ctx) => {
  db = await createTestDb(ctx);
  app = createApp(db);
  await seedUser(db, "u1");
  call = authedRequest(app, "u1");
  await db
    .insert(feeds)
    .values({ userId: "u1", id: FEED_ID, url: "https://example.com/feed", createdAt: Date.now() });
  await db.insert(articles).values(ARTICLE_1);
  await db.insert(articles).values(ARTICLE_2);
});

// ---------------------------------------------------------------------------
// GET /api/articles
// ---------------------------------------------------------------------------

describe("GET /api/articles", () => {
  it("returns all articles", async () => {
    const res = await call("/api/articles");
    expect(res.status).toBe(200);
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(2);
  });

  it("omits the content column from list responses", async () => {
    await db.insert(articles).values({
      id: "art-full",
      feedId: FEED_ID,
      url: "https://example.com/full",
      content: "very long body",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call("/api/articles");
    const body = (await res.json()) as Array<Record<string, unknown>>;
    for (const row of body) {
      expect(row).not.toHaveProperty("content");
    }
    expect(body).toHaveLength(3);
  });

  it("filters by feed_id", async () => {
    // Insert article for a different feed
    await db
      .insert(feeds)
      .values({ userId: "u1", id: "feed-2", url: "https://other.com/feed", createdAt: Date.now() });
    await db.insert(articles).values({
      id: "art-3",
      feedId: "feed-2",
      url: "https://other.com/one",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call(`/api/articles?feed_id=${FEED_ID}`);
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(2);
  });

  it("filters by unread=true", async () => {
    const res = await call("/api/articles?unread=true");
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(1);
    expect((body[0] as Record<string, unknown>)["id"]).toBe("art-1");
  });

  it("combines feed_id and unread filters", async () => {
    await db
      .insert(feeds)
      .values({ userId: "u1", id: "feed-2", url: "https://other.com/feed", createdAt: Date.now() });
    await db.insert(articles).values({
      id: "art-3",
      feedId: "feed-2",
      url: "https://other.com/one",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call(`/api/articles?feed_id=${FEED_ID}&unread=true`);
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(1);
    expect((body[0] as Record<string, unknown>)["id"]).toBe("art-1");
  });

  it("filters by folder_id across its feeds", async () => {
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: Date.now() });
    // feed-2 joins the folder; feed-1 (FEED_ID) stays uncategorized
    await db.insert(feeds).values({
      userId: "u1",
      id: "feed-2",
      url: "https://other.com/feed",
      folderId: "fol-1",
      createdAt: Date.now(),
    });
    await db.insert(articles).values({
      id: "art-3",
      feedId: "feed-2",
      url: "https://other.com/one",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call("/api/articles?folder_id=fol-1");
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(1);
    expect((body[0] as Record<string, unknown>)["id"]).toBe("art-3");

    // Empty folder matches nothing
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-2", name: "Empty", createdAt: Date.now() });
    const empty = await call("/api/articles?folder_id=fol-2");
    expect(await empty.json()).toEqual([]);
  });

  it("searches title and summary with q", async () => {
    const res = await call("/api/articles?q=one");
    const body = (await res.json()) as Array<Record<string, unknown>>;
    expect(body).toHaveLength(1);
    expect(body[0]?.["id"]).toBe("art-1");
  });

  it("searches content and ANDs multiple words", async () => {
    await db.insert(articles).values({
      id: "art-3",
      feedId: FEED_ID,
      url: "https://example.com/three",
      title: "Deep dive",
      content: "quantum entanglement explained",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call("/api/articles?q=deep+quantum");
    const body = (await res.json()) as Array<Record<string, unknown>>;
    expect(body).toHaveLength(1);
    expect(body[0]?.["id"]).toBe("art-3");

    const both = await call("/api/articles?q=quantum+article");
    expect(await both.json()).toEqual([]);
  });

  it("combines q with unread", async () => {
    const res = await call("/api/articles?q=two&unread=true");
    expect(await res.json()).toEqual([]);
  });

  it("treats FTS syntax in q as literal text", async () => {
    // Raw FTS5 would error or match everything on this input
    const res = await call(`/api/articles?q=${encodeURIComponent('" OR 1=1 --')}`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// GET /api/articles/:id
// ---------------------------------------------------------------------------

describe("GET /api/articles/:id", () => {
  it("returns the full article including content", async () => {
    await db.insert(articles).values({
      id: "art-full",
      feedId: FEED_ID,
      url: "https://example.com/full",
      content: "very long body",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call("/api/articles/art-full");
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["content"]).toBe("very long body");
    expect(body["id"]).toBe("art-full");
  });

  it("returns 404 for unknown article", async () => {
    const res = await call("/api/articles/nonexistent");
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/articles/:id
// ---------------------------------------------------------------------------

describe("PATCH /api/articles/:id", () => {
  it("marks an article as read", async () => {
    const res = await call("/api/articles/art-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["read"]).toBe(1);
  });

  it("marks an article as unread", async () => {
    const res = await call("/api/articles/art-2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: false }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["read"]).toBe(0);
  });

  it("returns 404 for unknown article", async () => {
    const res = await call("/api/articles/nonexistent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 400 when read field is missing", async () => {
    const res = await call("/api/articles/art-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await call("/api/articles/art-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// GET /api/articles?q= — CJK / wildcard behavior
// ---------------------------------------------------------------------------

describe("GET /api/articles?q= CJK and wildcards", () => {
  it("matches CJK substrings shorter than a trigram", async () => {
    await db.insert(articles).values({
      id: "art-cn",
      feedId: FEED_ID,
      url: "https://example.com/cn",
      title: "量子计算的新进展",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call(`/api/articles?q=${encodeURIComponent("量子")}`);
    const body = (await res.json()) as Array<Record<string, unknown>>;
    expect(body).toHaveLength(1);
    expect(body[0]?.["id"]).toBe("art-cn");
  });

  it("treats LIKE wildcards in q as literal text", async () => {
    await db.insert(articles).values({
      id: "art-pct",
      feedId: FEED_ID,
      url: "https://example.com/pct",
      title: "100% sure",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call(`/api/articles?q=${encodeURIComponent("100%")}`);
    const body = (await res.json()) as Array<Record<string, unknown>>;
    expect(body).toHaveLength(1);
    expect(body[0]?.["id"]).toBe("art-pct");

    // _ would match any char if unescaped
    const underscore = await call(`/api/articles?q=${encodeURIComponent("1_0")}`);
    expect(await underscore.json()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// POST /api/articles/read-all
// ---------------------------------------------------------------------------

describe("POST /api/articles/read-all", () => {
  it("marks all unread articles read", async () => {
    const res = await call("/api/articles/read-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { marked: number };
    expect(body.marked).toBe(1); // only art-1 starts unread

    const unread = await call("/api/articles?unread=true");
    expect(await unread.json()).toEqual([]);
  });

  it("scopes to feedId when given", async () => {
    await db
      .insert(feeds)
      .values({ userId: "u1", id: "feed-2", url: "https://other.com/feed", createdAt: Date.now() });
    await db.insert(articles).values({
      id: "art-3",
      feedId: "feed-2",
      url: "https://other.com/one",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await call("/api/articles/read-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedId: FEED_ID }),
    });
    const body = (await res.json()) as { marked: number };
    expect(body.marked).toBe(1);

    const unread = (await (await call("/api/articles?unread=true")).json()) as Array<
      Record<string, unknown>
    >;
    expect(unread).toHaveLength(1);
    expect(unread[0]?.["id"]).toBe("art-3");
  });

  it("accepts an empty body", async () => {
    const res = await call("/api/articles/read-all", { method: "POST" });
    expect(res.status).toBe(200);
  });

  it("returns 400 for a non-string feedId", async () => {
    const res = await call("/api/articles/read-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedId: 42 }),
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Multi-user scoping
// ---------------------------------------------------------------------------

describe("multi-user scoping", () => {
  it("hides other users' articles from list/get/read-all", async () => {
    await seedUser(db, "u2");
    await db
      .insert(feeds)
      .values({ userId: "u2", id: "feed-u2", url: "https://u2.com/feed", createdAt: 3 });
    await db.insert(articles).values({
      id: "art-u2",
      feedId: "feed-u2",
      url: "https://u2.com/one",
      read: 0,
      createdAt: Date.now(),
    });

    const list = (await (await call("/api/articles")).json()) as Array<{ id: string }>;
    expect(list.map((a) => a.id).sort()).toEqual(["art-1", "art-2"]);

    expect((await call("/api/articles/art-u2")).status).toBe(404);
    expect(
      (
        await call("/api/articles/art-u2", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        })
      ).status,
    ).toBe(404);

    const res = await call("/api/articles/read-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const body = (await res.json()) as { marked: number };
    expect(body.marked).toBe(1);

    const untouched = await db.select().from(articles).where(eq(articles.id, "art-u2"));
    expect(untouched[0]?.read).toBe(0);
  });
});
