import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { articles, feeds } from "../db/schema.ts";
import { refreshFeed } from "./refresh.ts";
import { createTestDb } from "./test-helpers.ts";

// Hostnames resolve to a public IP in tests — refreshFeed's SSRF guard does a
// DNS lookup per hop, which must never hit the network here.
vi.mock("node:dns/promises", () => ({
  lookup: vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]),
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const RSS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>My Blog</title>
    <link>https://blog.example.com</link>
    <description>A test blog</description>
    <image><url>https://blog.example.com/logo.png</url></image>
    <item>
      <title>Article One</title>
      <link>https://blog.example.com/one</link>
      <description>Summary one</description>
      <content:encoded><![CDATA[<p>Content one</p>]]></content:encoded>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Article Two</title>
      <link>https://blog.example.com/two</link>
      <description>Summary two</description>
      <pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const RSS_XML_UPDATED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Blog Updated</title>
    <link>https://blog.example.com</link>
    <description>Updated description</description>
    <item>
      <title>Article One — Edited</title>
      <link>https://blog.example.com/one</link>
      <description>Updated summary one</description>
      <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const INVALID_XML = `not xml`;

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

let db: Awaited<ReturnType<typeof createTestDb>>;
const FEED_ID = "feed-test-id";
const FEED_URL = "https://blog.example.com/feed.xml";

beforeEach(async (ctx) => {
  db = await createTestDb(ctx);
  // Insert a base feed record
  await db.insert(feeds).values({
    id: FEED_ID,
    url: FEED_URL,
    createdAt: Date.now(),
  });
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function mockFetch(body: string, status = 200) {
  vi.mocked(fetch).mockResolvedValue(new Response(body, { status }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("refreshFeed", () => {
  it("returns added count for new articles", async () => {
    mockFetch(RSS_XML);
    const result = await refreshFeed(FEED_ID, db);
    expect(result.added).toBe(2);
    expect(result.updated).toBe(0);
  });

  it("stores articles in the database", async () => {
    mockFetch(RSS_XML);
    await refreshFeed(FEED_ID, db);
    const stored = await db.select().from(articles).where(eq(articles.feedId, FEED_ID));
    expect(stored).toHaveLength(2);
  });

  it("updates feed metadata after refresh", async () => {
    mockFetch(RSS_XML);
    await refreshFeed(FEED_ID, db);
    const feed = await db.select().from(feeds).where(eq(feeds.id, FEED_ID)).limit(1);
    expect(feed[0]!.title).toBe("My Blog");
    expect(feed[0]!.siteUrl).toBe("https://blog.example.com");
    expect(feed[0]!.description).toBe("A test blog");
    expect(feed[0]!.imageUrl).toBe("https://blog.example.com/logo.png");
    expect(feed[0]!.lastFetchedAt).toBeTypeOf("number");
  });

  it("stores article fields correctly", async () => {
    mockFetch(RSS_XML);
    await refreshFeed(FEED_ID, db);
    const stored = await db
      .select()
      .from(articles)
      .where(eq(articles.url, "https://blog.example.com/one"))
      .limit(1);
    const article = stored[0]!;
    expect(article.title).toBe("Article One");
    expect(article.summary).toBe("Summary one");
    expect(article.content).toBe("<p>Content one</p>");
    expect(article.publishedAt).toBe(Date.parse("Mon, 01 Jan 2024 00:00:00 GMT"));
    expect(article.read).toBe(0);
  });

  it("upserts articles on re-refresh — updates title and content", async () => {
    mockFetch(RSS_XML);
    await refreshFeed(FEED_ID, db);

    mockFetch(RSS_XML_UPDATED);
    const result = await refreshFeed(FEED_ID, db);
    expect(result.added).toBe(0);
    expect(result.updated).toBe(1);

    const stored = await db
      .select()
      .from(articles)
      .where(eq(articles.url, "https://blog.example.com/one"))
      .limit(1);
    expect(stored[0]!.title).toBe("Article One — Edited");
    expect(stored[0]!.summary).toBe("Updated summary one");
  });

  it("preserves read flag on upsert", async () => {
    mockFetch(RSS_XML);
    await refreshFeed(FEED_ID, db);

    // Mark the article as read
    await db
      .update(articles)
      .set({ read: 1 })
      .where(eq(articles.url, "https://blog.example.com/one"));

    // Re-refresh
    mockFetch(RSS_XML_UPDATED);
    await refreshFeed(FEED_ID, db);

    const stored = await db
      .select()
      .from(articles)
      .where(eq(articles.url, "https://blog.example.com/one"))
      .limit(1);
    expect(stored[0]!.read).toBe(1);
  });

  it("throws when feed is not found in DB", async () => {
    await expect(refreshFeed("nonexistent-id", db)).rejects.toThrow("Feed not found");
  });

  it("throws when HTTP fetch fails", async () => {
    mockFetch("Not Found", 404);
    await expect(refreshFeed(FEED_ID, db)).rejects.toThrow("404");
  });

  it("throws when XML cannot be parsed", async () => {
    mockFetch(INVALID_XML);
    await expect(refreshFeed(FEED_ID, db)).rejects.toThrow("unrecognized format");
  });

  it("rejects a non-http(s) feed URL without fetching", async () => {
    await db.insert(feeds).values({ id: "f-ftp", url: "ftp://example.com/feed", createdAt: 1 });
    await expect(refreshFeed("f-ftp", db)).rejects.toThrow("must be http(s)");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects a loopback feed URL without fetching", async () => {
    await db
      .insert(feeds)
      .values({ id: "f-local", url: "http://127.0.0.1:9000/feed", createdAt: 1 });
    await expect(refreshFeed("f-local", db)).rejects.toThrow("private");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("follows redirects and re-validates each hop", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(null, {
          status: 301,
          headers: { Location: "https://blog.example.com/moved.xml" },
        }),
      )
      .mockResolvedValueOnce(new Response(RSS_XML, { status: 200 }));

    const result = await refreshFeed(FEED_ID, db);

    expect(result.added).toBe(2);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(vi.mocked(fetch).mock.calls[1]![0]).toBe("https://blog.example.com/moved.xml");
  });

  it("rejects a redirect to a private address", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { Location: "http://169.254.169.254/latest/meta-data" },
      }),
    );

    await expect(refreshFeed(FEED_ID, db)).rejects.toThrow("private");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("skips an article URL owned by another feed instead of overwriting it", async () => {
    await db
      .insert(feeds)
      .values({ id: "feed-a", url: "https://a.example.com/feed", createdAt: 1 });
    await db
      .insert(feeds)
      .values({ id: "feed-b", url: "https://b.example.com/feed", createdAt: 2 });

    mockFetch(RSS_XML);
    await refreshFeed("feed-a", db);

    // feed-b serves the same article URL with different content
    const clashing = RSS_XML.replace("Article One", "Feed B Hijacked");
    mockFetch(clashing);
    const result = await refreshFeed("feed-b", db);

    // Both URLs already exist under feed-a → both skipped, nothing changed
    expect(result.added).toBe(0);
    expect(result.updated).toBe(0);

    const stored = await db
      .select()
      .from(articles)
      .where(eq(articles.url, "https://blog.example.com/one"))
      .limit(1);
    expect(stored[0]!.feedId).toBe("feed-a"); // stays owned by feed-a
    expect(stored[0]!.title).toBe("Article One"); // content not overwritten
  });
});
