import { Hono } from "hono";
import { feeds, folders } from "../../db/schema.ts";
import { buildOpml, parseOpml } from "../../lib/opml.ts";
import type { Variables } from "../index.ts";

export const opmlRouter = new Hono<{ Variables: Variables }>();

// GET /api/opml — export subscriptions as an OPML download
opmlRouter.get("/", async (c) => {
  const db = c.get("db");
  const [folderRows, feedRows] = await Promise.all([
    db.select().from(folders),
    db.select().from(feeds),
  ]);

  const folderNames = new Map(folderRows.map((f) => [f.id, f.name]));
  const xml = buildOpml({
    title: "Reed subscriptions",
    feeds: feedRows.map((f) => ({
      url: f.url,
      title: f.title,
      folder: f.folderId ? (folderNames.get(f.folderId) ?? null) : null,
    })),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Content-Disposition": 'attachment; filename="reed.opml"',
    },
  });
});

// POST /api/opml — import an OPML body (text/xml). Feeds are matched by URL:
// existing ones are skipped untouched; folders are matched by name and created
// when missing. New feeds are picked up by the hourly refresh.
opmlRouter.post("/", async (c) => {
  const xml = await c.req.text();
  if (xml.length > 4_000_000) {
    return c.json({ error: "OPML file too large" }, 413);
  }
  const data = parseOpml(xml);
  if (!data) {
    return c.json({ error: "Invalid OPML file" }, 400);
  }
  if (data.feeds.length === 0) {
    return c.json({ error: "No feeds found in OPML" }, 400);
  }

  const db = c.get("db");
  const existingUrls = new Set((await db.select({ url: feeds.url }).from(feeds)).map((r) => r.url));
  const existingFolders = new Map((await db.select().from(folders)).map((f) => [f.name, f.id]));

  let feedsAdded = 0;
  let foldersCreated = 0;
  const feedsSkipped = data.feeds.filter((item) => existingUrls.has(item.url)).length;

  // ponytail: sequential inserts, no transaction — drizzle's libsql transaction
  // opens a fresh connection on file:/memory: DBs (fails in tests/local dev), and
  // single-user scale accepts the mid-import partial-failure ceiling (AUDIT-006).
  // Upgrade path: batch via the raw libsql client when it matters.
  const now = Date.now();
  for (const item of data.feeds) {
    if (existingUrls.has(item.url)) continue;

    let folderId: string | null = null;
    if (item.folder) {
      folderId = existingFolders.get(item.folder) ?? null;
      if (!folderId) {
        folderId = crypto.randomUUID();
        await db.insert(folders).values({ id: folderId, name: item.folder, createdAt: now });
        existingFolders.set(item.folder, folderId);
        foldersCreated++;
      }
    }

    await db.insert(feeds).values({
      id: crypto.randomUUID(),
      url: item.url,
      title: item.title,
      folderId,
      createdAt: now,
    });
    existingUrls.add(item.url);
    feedsAdded++;
  }

  return c.json({ feedsAdded, foldersCreated, feedsSkipped });
});
