import type { DB } from "../db/client.ts";
import { feeds } from "../db/schema.ts";
import { refreshFeed } from "../lib/refresh.ts";

/**
 * Refresh every feed, tolerating individual failures. Returns the failures so
 * the caller (scripts/refresh.ts under GitHub Actions) can report them and
 * exit non-zero — otherwise a broken feed is invisible in the Actions log.
 */
export async function runCron(db: DB): Promise<Array<{ feedId: string; error: string }>> {
  const allFeeds = await db.select({ id: feeds.id }).from(feeds);
  const results = await Promise.allSettled(allFeeds.map((f) => refreshFeed(f.id, db)));
  return results.flatMap((result, i) => {
    const feed = allFeeds[i];
    if (!feed || result.status === "fulfilled") return [];
    return [
      {
        feedId: feed.id,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      },
    ];
  });
}
