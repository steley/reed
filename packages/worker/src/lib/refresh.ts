import { eq } from "drizzle-orm";
import type { RefreshResult } from "@cloud-reader/types";
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

  // Fetch the RSS/Atom XML
  const response = await fetch(feed.url);
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
