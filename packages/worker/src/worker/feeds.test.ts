import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { articles, feeds, folders } from "../db/schema.ts";
import { createTestDb } from "../lib/test-helpers.ts";
import { createApp } from "./index.ts";

// refreshFeed's SSRF guard resolves hostnames — keep it off the network here.
vi.mock("node:dns/promises", () => ({
  lookup: vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]),
}));

const RSS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <link>https://example.com</link>
    <description>A test feed</description>
    <item>
      <title>Article One</title>
      <link>https://example.com/one</link>
      <description>Summary</description>
    </item>
  </channel>
</rss>`;

let db: ReturnType<typeof createTestDb>;
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  db = createTestDb();
  app = createApp(db);
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// GET /api/feeds
// ---------------------------------------------------------------------------

describe("GET /api/feeds", () => {
  it("returns empty array when no feeds exist", async () => {
    const res = await app.request("/api/feeds");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns all feeds", async () => {
    await db.insert(feeds).values({ id: "f1", url: "https://a.com/feed", createdAt: Date.now() });
    await db.insert(feeds).values({ id: "f2", url: "https://b.com/feed", createdAt: Date.now() });
    const res = await app.request("/api/feeds");
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// POST /api/feeds
// ---------------------------------------------------------------------------

describe("POST /api/feeds", () => {
  it("creates a feed and returns 201", async () => {
    const res = await app.request("/api/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://new.example.com/feed" }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["url"]).toBe("https://new.example.com/feed");
    expect(body["id"]).toBeTypeOf("string");
  });

  it("returns 409 on duplicate URL", async () => {
    await db
      .insert(feeds)
      .values({ id: "f1", url: "https://dupe.com/feed", createdAt: Date.now() });
    const res = await app.request("/api/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://dupe.com/feed" }),
    });
    expect(res.status).toBe(409);
  });

  it("returns 400 when url is missing", async () => {
    const res = await app.request("/api/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await app.request("/api/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/feeds/:id
// ---------------------------------------------------------------------------

describe("DELETE /api/feeds/:id", () => {
  it("deletes a feed and returns 204", async () => {
    await db
      .insert(feeds)
      .values({ id: "del-1", url: "https://del.com/feed", createdAt: Date.now() });
    const res = await app.request("/api/feeds/del-1", { method: "DELETE" });
    expect(res.status).toBe(204);

    const remaining = await db.select().from(feeds).where(eq(feeds.id, "del-1"));
    expect(remaining).toHaveLength(0);
  });

  it("returns 404 for unknown feed", async () => {
    const res = await app.request("/api/feeds/nonexistent", { method: "DELETE" });
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/feeds/:id — move into/out of a folder
// ---------------------------------------------------------------------------

describe("PATCH /api/feeds/:id", () => {
  it("moves a feed into a folder", async () => {
    await db.insert(folders).values({ id: "fol-1", name: "Tech", createdAt: Date.now() });
    await db
      .insert(feeds)
      .values({ id: "mv-1", url: "https://mv.com/feed", createdAt: Date.now() });

    const res = await app.request("/api/feeds/mv-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId: "fol-1" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["folderId"]).toBe("fol-1");
  });

  it("moves a feed out of a folder with folderId null", async () => {
    await db.insert(folders).values({ id: "fol-1", name: "Tech", createdAt: Date.now() });
    await db
      .insert(feeds)
      .values({ id: "mv-2", url: "https://mv.com/feed", folderId: "fol-1", createdAt: Date.now() });

    const res = await app.request("/api/feeds/mv-2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId: null }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["folderId"]).toBeNull();
  });

  it("returns 404 for unknown feed", async () => {
    const res = await app.request("/api/feeds/nonexistent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId: null }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 404 when the target folder does not exist", async () => {
    await db
      .insert(feeds)
      .values({ id: "mv-3", url: "https://mv.com/feed", createdAt: Date.now() });
    const res = await app.request("/api/feeds/mv-3", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId: "no-such-folder" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 400 for a non-string non-null folderId", async () => {
    await db
      .insert(feeds)
      .values({ id: "mv-4", url: "https://mv.com/feed", createdAt: Date.now() });
    const res = await app.request("/api/feeds/mv-4", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId: 42 }),
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// POST /api/feeds/:id/refresh
// ---------------------------------------------------------------------------

describe("POST /api/feeds/:id/refresh", () => {
  it("refreshes a feed and returns added/updated counts", async () => {
    await db
      .insert(feeds)
      .values({ id: "rf-1", url: "https://refresh.com/feed", createdAt: Date.now() });
    vi.mocked(fetch).mockResolvedValue(new Response(RSS_XML, { status: 200 }));

    const res = await app.request("/api/feeds/rf-1/refresh", { method: "POST" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["added"]).toBe(1);
    expect(body["updated"]).toBe(0);
  });

  it("returns 404 for unknown feed", async () => {
    const res = await app.request("/api/feeds/nonexistent/refresh", { method: "POST" });
    expect(res.status).toBe(404);
  });

  it("returns 502 when fetch fails", async () => {
    await db
      .insert(feeds)
      .values({ id: "rf-2", url: "https://broken.com/feed", createdAt: Date.now() });
    vi.mocked(fetch).mockResolvedValue(new Response("Error", { status: 500 }));

    const res = await app.request("/api/feeds/rf-2/refresh", { method: "POST" });
    expect(res.status).toBe(502);
  });

  it("returns 400 for a non-http(s) URL", async () => {
    const res = await app.request("/api/feeds", {
      method: "POST",
      body: JSON.stringify({ url: "ftp://example.com/feed" }),
    });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/feeds/:id — article cleanup", () => {
  it("deletes the feed's articles too, without relying on FK cascade", async () => {
    await db.insert(feeds).values({ id: "del-1", url: "https://del.com/feed", createdAt: 1 });
    await db.insert(articles).values({
      id: "art-1",
      feedId: "del-1",
      url: "https://del.com/one",
      createdAt: 1,
    });

    const res = await app.request("/api/feeds/del-1", { method: "DELETE" });
    expect(res.status).toBe(204);

    const remaining = await db.select().from(articles).where(eq(articles.feedId, "del-1"));
    expect(remaining).toHaveLength(0);
  });
});
