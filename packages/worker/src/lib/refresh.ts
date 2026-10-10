import { eq } from "drizzle-orm";
import type { RefreshResult } from "@reed/types";
import type { DB } from "../db/client.ts";
import { articles, feeds } from "../db/schema.ts";
import { parseFeed } from "./parse.ts";

/**
 * Fetch a feed URL, parse its contents, update feed metadata in the database,
 * and upsert articles. Returns counts of added and updated articles.
 *
 * Throws if the HTTP request fails or the feed cannot be parsed.
 */
export async function refreshFeed(feedId: string, db: DB): Promise<RefreshResult> {
  // Load the feed record
  const feedRows = await db.select().from(feeds).where(eq(feeds.id, feedId)).limit(1);

  const feed = feedRows[0];
  if (!feed) {
    throw new Error(`Feed not found: ${feedId}`);
  }

  // Fetch the RSS/Atom XML (browser-like UA — many sites 403 the default
  // fetch UA, e.g. ruanyifeng.com behind anti-bot)
  const response = await fetch(feed.url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
    },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch feed ${feed.url}: ${response.status} ${response.statusText}`);
  }
  const xml = await response.text();

  // Parse the feed
  const parsed = parseFeed(xml);
  if (!parsed) {
    throw new Error(`Failed to parse feed ${feed.url}: unrecognized format`);
  }

  // Update feed metadata
  await db
    .update(feeds)
    .set({
      title: parsed.meta.title ?? feed.title,
      siteUrl: parsed.meta.siteUrl ?? feed.siteUrl,
      description: parsed.meta.description ?? feed.description,
      imageUrl: parsed.meta.imageUrl ?? feed.imageUrl,
      lastFetchedAt: Date.now(),
    })
    .where(eq(feeds.id, feedId));

  // Upsert articles
  let added = 0;
  let updated = 0;

  for (const article of parsed.articles) {
    if (!article.url) continue;

    // Check if article already exists
    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.url, article.url))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(articles).values({
        id: crypto.randomUUID(),
        feedId,
        url: article.url,
        title: article.title,
        summary: article.summary,
        content: article.content,
        publishedAt: article.publishedAt,
        createdAt: Date.now(),
      });
      added++;
    } else {
      await db
        .update(articles)
        .set({
          title: article.title,
          summary: article.summary,
          content: article.content,
          publishedAt: article.publishedAt,
        })
        .where(eq(articles.url, article.url));
      updated++;
    }
  }

  return { added, updated };
}
