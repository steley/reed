import { XMLParser } from "fast-xml-parser";
import type { ParsedArticle, ParsedFeed, ParsedFeedMeta } from "@reed/types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => ["item", "entry"].includes(name),
  // Raise entity expansion limit — default of 1000 is too low for feeds with
  // rich content:encoded fields containing many escaped HTML entities.
  processEntities: { maxTotalExpansions: 100000 },
  // Decode numeric entities (&#8211;, &#039;, …) — without this only the five
  // named XML entities are decoded and titles keep raw "&amp;#8211;" text.
  htmlEntities: true,
});

/**
 * Parse a raw RSS 2.0 or Atom feed XML string into a normalized ParsedFeed.
 * Returns null if the XML cannot be recognized as either format.
 */
export function parseFeed(xml: string): ParsedFeed | null {
  let parsed: Record<string, unknown>;
  try {
    parsed = parser.parse(xml) as Record<string, unknown>;
  } catch {
    return null;
  }

  if (isRss(parsed)) {
    return parseRss(parsed);
  }
  if (isAtom(parsed)) {
    return parseAtom(parsed);
  }
  return null;
}

// ---------------------------------------------------------------------------
// RSS 2.0
// ---------------------------------------------------------------------------

function isRss(parsed: Record<string, unknown>): boolean {
  const rss = parsed["rss"] as Record<string, unknown> | undefined;
  return rss !== undefined;
}

function parseRss(parsed: Record<string, unknown>): ParsedFeed {
  const rss = parsed["rss"] as Record<string, unknown>;
  const channel = rss["channel"] as Record<string, unknown>;

  const image = channel["image"] as Record<string, unknown> | undefined;

  const meta: ParsedFeedMeta = {
    title: str(channel["title"]),
    siteUrl: str(channel["link"]),
    description: str(channel["description"]),
    imageUrl: image ? str(image["url"]) : null,
  };

  const items = arr(channel["item"]);
  const articles: ParsedArticle[] = items
    .map((item) => {
      const i = item as Record<string, unknown>;
      return {
        url: str(i["link"]) ?? str(i["guid"]) ?? "",
        title: str(i["title"]),
        summary: str(i["description"]),
        content: str(i["content:encoded"]),
        publishedAt: parseDate(str(i["pubDate"])),
      };
    })
    .filter((a) => a.url !== "");

  return { meta, articles };
}

// ---------------------------------------------------------------------------
// Atom
// ---------------------------------------------------------------------------

function isAtom(parsed: Record<string, unknown>): boolean {
  const feed = parsed["feed"] as Record<string, unknown> | undefined;
  return feed !== undefined;
}

function parseAtom(parsed: Record<string, unknown>): ParsedFeed {
  const feed = parsed["feed"] as Record<string, unknown>;

  const meta: ParsedFeedMeta = {
    title: str(atomText(feed["title"])),
    siteUrl: atomLink(feed["link"], "alternate") ?? atomLink(feed["link"], null),
    description: str(atomText(feed["subtitle"])),
    imageUrl: str(feed["icon"]) ?? str(feed["logo"]),
  };

  const entries = arr(feed["entry"]);
  const articles: ParsedArticle[] = entries
    .map((entry) => {
      const e = entry as Record<string, unknown>;
      const url =
        atomLink(e["link"], "alternate") ?? atomLink(e["link"], null) ?? str(e["id"]) ?? "";
      return {
        url,
        title: str(atomText(e["title"])),
        summary: str(atomText(e["summary"])),
        content: str(atomText(e["content"])),
        publishedAt: parseDate(str(e["published"]) ?? str(e["updated"])),
      };
    })
    .filter((a) => a.url !== "");

  return { meta, articles };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Safely extract a string value from an unknown node. */
function str(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "number") return String(val);
  // fast-xml-parser may return objects with a `#text` key for mixed content
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if ("#text" in obj) return str(obj["#text"]);
  }
  return null;
}

/** Safely extract an array, handling single-item cases. */
function arr(val: unknown): unknown[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

/** Parse a date string into Unix milliseconds, or null if unparseable. */
function parseDate(val: string | null): number | null {
  if (!val) return null;
  const ms = Date.parse(val);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Extract text content from an Atom text construct.
 * Can be a plain string or `{ #text, @_type }`.
 */
function atomText(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    return str(obj["#text"]);
  }
  return null;
}

/**
 * Extract href from an Atom <link> element.
 * Handles both single objects and arrays of link objects.
 * Pass `rel` to filter by relation, or null to take the first link that is
 * not rel="self" (the feed's own URL is never a useful site/article link).
 */
function atomLink(val: unknown, rel: string | null): string | null {
  const links = arr(val);
  for (const link of links) {
    const l = link as Record<string, unknown>;
    const href = str(l["@_href"]);
    if (!href) continue;
    const linkRel = str(l["@_rel"]);
    if (rel === null) {
      if (linkRel !== "self") return href;
      continue;
    }
    if (linkRel === rel) return href;
  }
  return null;
}
