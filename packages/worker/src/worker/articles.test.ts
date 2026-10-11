import { beforeEach, describe, expect, it } from "vitest";
import { articles, feeds, folders } from "../db/schema.ts";
import { createTestDb } from "../lib/test-helpers.ts";
import { createApp } from "./index.ts";

let db: ReturnType<typeof createTestDb>;
let app: ReturnType<typeof createApp>;

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

beforeEach(async () => {
  db = createTestDb();
  app = createApp(db);
  await db
    .insert(feeds)
    .values({ id: FEED_ID, url: "https://example.com/feed", createdAt: Date.now() });
  await db.insert(articles).values(ARTICLE_1);
  await db.insert(articles).values(ARTICLE_2);
});

// ---------------------------------------------------------------------------
// GET /api/articles
// ---------------------------------------------------------------------------

describe("GET /api/articles", () => {
  it("returns all articles", async () => {
    const res = await app.request("/api/articles");
    expect(res.status).toBe(200);
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(2);
  });

  it("filters by feed_id", async () => {
    // Insert article for a different feed
    await db
      .insert(feeds)
      .values({ id: "feed-2", url: "https://other.com/feed", createdAt: Date.now() });
    await db.insert(articles).values({
      id: "art-3",
      feedId: "feed-2",
      url: "https://other.com/one",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await app.request(`/api/articles?feed_id=${FEED_ID}`);
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(2);
  });

  it("filters by unread=true", async () => {
    const res = await app.request("/api/articles?unread=true");
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(1);
    expect((body[0] as Record<string, unknown>)["id"]).toBe("art-1");
  });

  it("combines feed_id and unread filters", async () => {
    await db
      .insert(feeds)
      .values({ id: "feed-2", url: "https://other.com/feed", createdAt: Date.now() });
    await db.insert(articles).values({
      id: "art-3",
      feedId: "feed-2",
      url: "https://other.com/one",
      createdAt: Date.now(),
      read: 0,
    });

    const res = await app.request(`/api/articles?feed_id=${FEED_ID}&unread=true`);
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(1);
    expect((body[0] as Record<string, unknown>)["id"]).toBe("art-1");
  });

  it("filters by folder_id across its feeds", async () => {
    await db.insert(folders).values({ id: "fol-1", name: "Tech", createdAt: Date.now() });
    // feed-2 joins the folder; feed-1 (FEED_ID) stays uncategorized
    await db.insert(feeds).values({
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

    const res = await app.request("/api/articles?folder_id=fol-1");
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(1);
    expect((body[0] as Record<string, unknown>)["id"]).toBe("art-3");

    // Empty folder matches nothing
    await db.insert(folders).values({ id: "fol-2", name: "Empty", createdAt: Date.now() });
    const empty = await app.request("/api/articles?folder_id=fol-2");
    expect(await empty.json()).toEqual([]);
  });

  it("searches title and summary with q", async () => {
    const res = await app.request("/api/articles?q=one");
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

    const res = await app.request("/api/articles?q=deep+quantum");
    const body = (await res.json()) as Array<Record<string, unknown>>;
    expect(body).toHaveLength(1);
    expect(body[0]?.["id"]).toBe("art-3");

    const both = await app.request("/api/articles?q=quantum+article");
    expect(await both.json()).toEqual([]);
  });

  it("combines q with unread", async () => {
    const res = await app.request("/api/articles?q=two&unread=true");
    expect(await res.json()).toEqual([]);
  });

  it("treats FTS syntax in q as literal text", async () => {
    // Raw FTS5 would error or match everything on this input
    const res = await app.request(`/api/articles?q=${encodeURIComponent('" OR 1=1 --')}`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/articles/:id
// ---------------------------------------------------------------------------

describe("PATCH /api/articles/:id", () => {
  it("marks an article as read", async () => {
    const res = await app.request("/api/articles/art-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["read"]).toBe(1);
  });

  it("marks an article as unread", async () => {
    const res = await app.request("/api/articles/art-2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: false }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["read"]).toBe(0);
  });

  it("returns 404 for unknown article", async () => {
    const res = await app.request("/api/articles/nonexistent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 400 when read field is missing", async () => {
    const res = await app.request("/api/articles/art-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await app.request("/api/articles/art-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });
});
