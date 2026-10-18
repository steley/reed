import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { feeds, folders } from "../db/schema.ts";
import { buildOpml, parseOpml } from "../lib/opml.ts";
import { authedRequest, createTestDb, seedUser } from "../lib/test-helpers.ts";
import { createApp } from "./index.ts";

let db: Awaited<ReturnType<typeof createTestDb>>;
let app: ReturnType<typeof createApp>;
let call: ReturnType<typeof authedRequest>;

beforeEach(async (ctx) => {
  db = await createTestDb(ctx);
  app = createApp(db);
  await seedUser(db, "u1");
  call = authedRequest(app, "u1");
});

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head><title>Subs</title></head>
  <body>
    <outline text="Tech">
      <outline type="rss" text="Alpha" xmlUrl="https://a.com/feed" />
      <outline type="rss" text="Beta" xmlUrl="https://b.com/rss.xml" />
    </outline>
    <outline type="rss" text="Solo" xmlUrl="https://solo.com/feed" />
  </body>
</opml>`;

// ---------------------------------------------------------------------------
// lib/opml.ts
// ---------------------------------------------------------------------------

describe("parseOpml", () => {
  it("extracts feeds with their folders", () => {
    const data = parseOpml(SAMPLE);
    expect(data?.title).toBe("Subs");
    expect(data?.feeds).toEqual([
      { url: "https://a.com/feed", title: "Alpha", folder: "Tech" },
      { url: "https://b.com/rss.xml", title: "Beta", folder: "Tech" },
      { url: "https://solo.com/feed", title: "Solo", folder: null },
    ]);
  });

  it("returns null for non-OPML XML", () => {
    expect(parseOpml("<rss><channel /></rss>")).toBeNull();
  });

  it("returns null for invalid XML", () => {
    expect(parseOpml("not xml at all <<<")).toBeNull();
  });
});

describe("buildOpml", () => {
  it("escapes XML special characters in titles and folders", () => {
    const xml = buildOpml({
      title: null,
      feeds: [{ url: "https://a.com/feed?x=1&y=2", title: 'A "B" <C>', folder: null }],
    });
    expect(xml).toContain('xmlUrl="https://a.com/feed?x=1&amp;y=2"');
    expect(xml).toContain('text="A &quot;B&quot; &lt;C&gt;"');
  });

  it("round-trips through parseOpml", () => {
    const original = {
      title: "Reed subscriptions",
      feeds: [
        { url: "https://a.com/feed", title: "Alpha", folder: "Tech" },
        { url: "https://solo.com/feed", title: null, folder: null },
      ],
    };
    const parsed = parseOpml(buildOpml(original));
    // buildOpml emits uncategorized feeds before foldered ones
    expect(parsed?.feeds).toEqual([
      { url: "https://solo.com/feed", title: "https://solo.com/feed", folder: null },
      { url: "https://a.com/feed", title: "Alpha", folder: "Tech" },
    ]);
  });
});

// ---------------------------------------------------------------------------
// GET /api/opml — export
// ---------------------------------------------------------------------------

describe("GET /api/opml", () => {
  it("returns OPML with folders nested and attachment headers", async () => {
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: Date.now() });
    await db.insert(feeds).values([
      {
        userId: "u1",
        id: "f1",
        url: "https://a.com/feed",
        title: "Alpha",
        folderId: "fol-1",
        createdAt: 1,
      },
      {
        userId: "u1",
        id: "f2",
        url: "https://b.com/feed",
        title: null,
        folderId: null,
        createdAt: 2,
      },
    ]);

    const res = await call("/api/opml");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/xml");
    expect(res.headers.get("Content-Disposition")).toMatch(
      /^attachment; filename="reed-\d{4}-\d{2}-\d{2}\.opml"$/,
    );

    const xml = await res.text();
    const data = parseOpml(xml);
    expect(data?.feeds).toEqual([
      { url: "https://b.com/feed", title: "https://b.com/feed", folder: null },
      { url: "https://a.com/feed", title: "Alpha", folder: "Tech" },
    ]);
  });
});

// ---------------------------------------------------------------------------
// POST /api/opml — import
// ---------------------------------------------------------------------------

describe("POST /api/opml", () => {
  it("creates folders and feeds, returns counts", async () => {
    const res = await call("/api/opml", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: SAMPLE,
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ feedsAdded: 3, foldersCreated: 1, feedsSkipped: 0 });

    const folderRows = await db.select().from(folders);
    expect(folderRows).toHaveLength(1);
    expect(folderRows[0]?.name).toBe("Tech");

    const inFolder = await db.select().from(feeds).where(eq(feeds.url, "https://a.com/feed"));
    expect(inFolder[0]?.folderId).toBe(folderRows[0]?.id);

    const solo = await db.select().from(feeds).where(eq(feeds.url, "https://solo.com/feed"));
    expect(solo[0]?.folderId).toBeNull();
  });

  it("skips already-existing feed URLs without moving them", async () => {
    await db.insert(feeds).values({
      userId: "u1",
      id: "f-existing",
      url: "https://a.com/feed",
      folderId: null,
      createdAt: 1,
    });

    const res = await call("/api/opml", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: SAMPLE,
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ feedsAdded: 2, foldersCreated: 1, feedsSkipped: 1 });

    const untouched = await db.select().from(feeds).where(eq(feeds.url, "https://a.com/feed"));
    expect(untouched[0]?.folderId).toBeNull();
  });

  it("reuses an existing folder with the same name", async () => {
    await db.insert(folders).values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: 1 });

    const res = await call("/api/opml", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: SAMPLE,
    });
    const body = (await res.json()) as { foldersCreated: number };
    expect(body.foldersCreated).toBe(0);

    const folderRows = await db.select().from(folders);
    expect(folderRows).toHaveLength(1);
  });

  it("returns 400 for non-OPML body", async () => {
    const res = await call("/api/opml", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: "<html><body>nope</body></html>",
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 when the OPML has no feeds", async () => {
    const res = await call("/api/opml", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: '<opml version="2.0"><head /><body /></opml>',
    });
    expect(res.status).toBe(400);
  });
});
