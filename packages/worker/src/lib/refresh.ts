import { isIP } from "node:net";
import { lookup } from "node:dns/promises";
import { and, eq } from "drizzle-orm";
import type { RefreshResult } from "@reed/types";
import type { DB } from "../db/client.ts";
import { articles, feeds } from "../db/schema.ts";
import { parseFeed } from "./parse.ts";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 5_000_000;
const MAX_REDIRECTS = 5;

/**
 * Validate a feed URL's scheme. Called at feed-insert time (400 to the client)
 * and again before every fetch hop (redirects must re-qualify).
 */
export function assertFetchableUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid feed URL: ${url}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Feed URL must be http(s): ${url}`);
  }
}

/**
 * Refuse loopback / private / link-local targets (SSRF guard). Literal IPs are
 * checked directly; hostnames are resolved so rebinding doesn't bypass the
 * range checks. IPv6 matches unique-local (fc00::/7) and link-local (fe80::/10).
 */
function isPrivateIp(ip: string): boolean {
  if (ip.includes(":")) {
    const v6 = ip.toLowerCase();
    if (v6 === "::" || v6 === "::1") return true;
    if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
    return /^(f[cd]|fe[89ab])/.test(v6);
  }
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;
  const [a, b] = parts as [number, number, number, number];
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 169 && b === 254) return true; // link-local (incl. cloud metadata)
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

async function assertPublicHost(hostname: string): Promise<void> {
  const addresses = isIP(hostname)
    ? [hostname]
    : (await lookup(hostname, { all: true })).map((a) => a.address);
  if (addresses.some(isPrivateIp)) {
    throw new Error(`Refusing to fetch private address for ${hostname}`);
  }
}

/** Read the response body as text, refusing responses larger than the cap. */
async function readBodyWithLimit(response: Response, url: string): Promise<string> {
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > MAX_RESPONSE_BYTES) {
    throw new Error(`Feed response from ${url} exceeds ${MAX_RESPONSE_BYTES} byte limit`);
  }
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let text = "";
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error(`Feed response from ${url} exceeds ${MAX_RESPONSE_BYTES} byte limit`);
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

/**
 * Fetch the feed XML with SSRF guardrails: scheme + public-host validation on
 * every hop (redirects re-validated), per-request timeout, capped redirects
 * and response size.
 */
async function fetchFeedXml(url: string): Promise<string> {
  let target = url;
  for (let hop = 0; ; hop++) {
    assertFetchableUrl(target);
    await assertPublicHost(new URL(target).hostname);
    const response = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      if (hop >= MAX_REDIRECTS) {
        throw new Error(`Too many redirects fetching ${url}`);
      }
      target = new URL(location, target).href;
      continue;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch feed ${target}: ${response.status} ${response.statusText}`);
    }
    return readBodyWithLimit(response, target);
  }
}

/**
 * Fetch a feed URL, parse its contents, update feed metadata in the database,
 * and upsert articles. Returns counts of added and updated articles.
 *
 * Throws if the URL fails validation, the HTTP request fails, or the feed
 * cannot be parsed.
 */
export async function refreshFeed(feedId: string, db: DB): Promise<RefreshResult> {
  // Load the feed record
  const feedRows = await db.select().from(feeds).where(eq(feeds.id, feedId)).limit(1);

  const feed = feedRows[0];
  if (!feed) {
    throw new Error(`Feed not found: ${feedId}`);
  }

  const xml = await fetchFeedXml(feed.url);

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

  // Upsert articles. articles are unique per (feed_id, url): two users
  // subscribing to the same feed URL each keep their own article rows.
  let added = 0;
  let updated = 0;

  for (const article of parsed.articles) {
    if (!article.url) continue;

    const existingRows = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.feedId, feedId), eq(articles.url, article.url)))
      .limit(1);
    const existing = existingRows[0];

    if (!existing) {
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
        .where(eq(articles.id, existing.id));
      updated++;
    }
  }

  return { added, updated };
}
