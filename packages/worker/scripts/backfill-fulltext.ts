/**
 * One-shot backfill: fetch full text for articles stored before the
 * full-text feature shipped (refreshFeed only extracts for new articles,
 * so pre-existing rows never get revisited). Reads DATABASE_URL from the
 * environment. Safe to re-run — rows that already have full content are
 * skipped, extraction failures are left untouched (re-run retries them).
 * A second fetch-free pass absolutizes relative img/a URLs in already-stored
 * content (rows extracted before absolutization existed point their images
 * at the reader's own domain).
 *
 * Usage: backfill [--force] [url-substring]
 * --force re-runs extraction even for rows that already have content
 * (e.g. after an extraction-quality fix); a failed re-extract keeps the
 * stored content. The optional substring narrows the selection by URL.
 */
import { and, eq, type SQL, sql } from "drizzle-orm";
import { getDb } from "../src/db/client.ts";
import { articles } from "../src/db/schema.ts";
import { absolutizeUrls, extractFullText } from "../src/lib/extract.ts";

const POOL = 4;
const args = process.argv.slice(2);
const force = args.includes("--force");
const urlSubstring = args.find((a) => !a.startsWith("--"));

const db = getDb();
const conditions: SQL[] = [];
if (!force) {
  conditions.push(sql`(${articles.content} IS NULL OR length(${articles.content}) < 500)`);
}
if (urlSubstring) {
  conditions.push(sql`${articles.url} LIKE ${`%${urlSubstring}%`}`);
}
const rows = await db
  .select({ id: articles.id, url: articles.url })
  .from(articles)
  .where(conditions.length === 0 ? undefined : and(...conditions));
console.log(`Backfilling full text for ${rows.length} article(s)${force ? " (force)" : ""}...`);

let filled = 0;
let failed = 0;
for (let i = 0; i < rows.length; i += POOL) {
  const batch = rows.slice(i, i + POOL);
  const results = await Promise.allSettled(batch.map((row) => extractFullText(row.url)));
  for (const [j, row] of batch.entries()) {
    const result = results[j];
    if (result?.status === "fulfilled" && result.value) {
      await db.update(articles).set({ content: result.value }).where(eq(articles.id, row.id));
      filled++;
    } else {
      failed++;
      console.error(`No full text for ${row.url}`);
    }
  }
  console.log(`  ${Math.min(i + POOL, rows.length)}/${rows.length}`);
}

console.log(`Done: ${filled} filled, ${failed} without full text.`);

// Second pass: absolutize relative img/a URLs in already-stored content.
// Rows extracted before absolutization existed carry src="/..." paths that
// resolve against the reader's own domain and 404. Pure local rewrite — no
// fetches, idempotent (absolute URLs are returned unchanged).
const stored = await db
  .select({ id: articles.id, url: articles.url, content: articles.content })
  .from(articles)
  .where(sql`${articles.content} IS NOT NULL`);
let fixed = 0;
for (const row of stored) {
  if (!row.content) continue;
  const absolute = absolutizeUrls(row.content, row.url);
  if (absolute !== row.content) {
    await db.update(articles).set({ content: absolute }).where(eq(articles.id, row.id));
    fixed++;
  }
}
console.log(`URL fix: ${fixed} row(s) rewritten.`);
