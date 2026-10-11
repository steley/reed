import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { articles, feeds } from "../db/schema.ts";
import { createTestDb } from "../lib/test-helpers.ts";
import { runCron } from "./cron.ts";

// refreshFeed's SSRF guard resolves hostnames — keep it off the network here.
vi.mock("node:dns/promises", () => ({
  lookup: vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]),
}));

const RSS_FEED_A = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed A</title>
    <link>https://a.example.com</link>
    <description>Feed A</description>
    <item>
      <title>Article A1</title>
      <link>https://a.example.com/one</link>
      <description>Summary A1</description>
    </item>
  </channel>
</rss>`;

const RSS_FEED_B = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed B</title>
    <link>https://b.example.com</link>
    <description>Feed B</description>
    <item>
      <title>Article B1</title>
      <link>https://b.example.com/one</link>
      <description>Summary B1</description>
    </item>
  </channel>
</rss>`;

let db: ReturnType<typeof createTestDb>;

beforeEach(async () => {
  db = createTestDb();
  await db
    .insert(feeds)
    .values({ id: "feed-a", url: "https://a.example.com/feed", createdAt: Date.now() });
  await db
    .insert(feeds)
    .values({ id: "feed-b", url: "https://b.example.com/feed", createdAt: Date.now() });
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("runCron", () => {
  it("refreshes all feeds", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(RSS_FEED_A, { status: 200 }))
      .mockResolvedValueOnce(new Response(RSS_FEED_B, { status: 200 }));

    await runCron(db);

    const stored = await db.select().from(articles);
    expect(stored).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("continues refreshing remaining feeds when one fails", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response("error", { status: 500 }))
      .mockResolvedValueOnce(new Response(RSS_FEED_B, { status: 200 }));

    // Should not throw even though feed-a fails — but the failure is reported
    const failures = await runCron(db);
    expect(failures).toHaveLength(1);
    expect(failures[0]!.feedId).toBe("feed-a");

    const stored = await db.select().from(articles);
    // Only feed-b articles stored — feed-a failed
    expect(stored).toHaveLength(1);
    expect(stored[0]!.feedId).toBe("feed-b");
  });

  it("succeeds with no feeds", async () => {
    // Clear feeds
    await db.delete(feeds);
    await expect(runCron(db)).resolves.toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });
});
