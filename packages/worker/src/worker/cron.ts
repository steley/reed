import { eq } from "drizzle-orm";
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
  const failures: Array<{ feedId: string; error: string }> = [];
  for (let i = 0; i < allFeeds.length; i++) {
    const feed = allFeeds[i];
    const result = results[i];
    if (!feed || !result || result.status === "fulfilled") continue;
    const error = result.reason instanceof Error ? result.reason.message : String(result.reason);
    // Surface the failure in the UI (sidebar error dot); capped at 500 chars
    // so one pathological parser message can't bloat every row read
    await db
      .update(feeds)
      .set({ lastError: error.slice(0, 500) })
      .where(eq(feeds.id, feed.id));
    failures.push({ feedId: feed.id, error });
  }
  return failures;
}
