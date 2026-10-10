import type { DB } from "../db/client.ts";
import { feeds } from "../db/schema.ts";
import { refreshFeed } from "../lib/refresh.ts";

export async function runCron(db: DB): Promise<void> {
  const allFeeds = await db.select({ id: feeds.id }).from(feeds);
  await Promise.allSettled(allFeeds.map((f) => refreshFeed(f.id, db)));
}
