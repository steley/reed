/**
 * Clean a raw feed summary for display in list cards.
 * Strips HTML tags and HN-style metadata blocks ("Article URL: …
 * Comments URL: … Points: … # Comments: …") that pollute list cards.
 * Returns "" when nothing meaningful remains (card shows title only).
 */
export function cleanSummary(raw: string | null | undefined): string {
  if (!raw) return "";
  // Strip HTML tags and decode a few common entities
  let s = raw.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  s = s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Truncate at the first HN-style metadata key
  const cutAt = s.search(/(Article URL|Comments URL|Points:|# Comments)/);
  if (cutAt >= 0) s = s.slice(0, cutAt);

  s = s
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return s.length >= 24 ? s : "";
}

/** Compact relative time: "now", "12m", "3h", "5d", then "Oct 9" / "2025/6/1". */
export function relativeTime(timestamp: number | null | undefined): string {
  if (!timestamp) return "";
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const d = new Date(timestamp);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return sameYear
    ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : d.toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric" });
}

export function fullDate(timestamp: number | null | undefined): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Fallback display name for feeds without a title: the URL hostname. */
export function feedDisplayName(feed: { title: string | null; url: string }): string {
  if (feed.title) return feed.title;
  try {
    return new URL(feed.url).hostname.replace(/^www\./, "");
  } catch {
    return feed.url;
  }
}

/**
 * Locale-aware case-insensitive name comparison for auto-ascending sidebar
 * order (feeds, folders). localeCompare handles mixed Chinese/English names.
 */
export function compareNames(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

/**
 * The article list's display order (publishedAt, newest/oldest first).
 * Shared with App's keyboard navigation so j/k walks the exact visible order.
 */
export function sortArticles<T extends { publishedAt: number | null }>(
  list: T[],
  asc: boolean,
): T[] {
  const av = (a: T) => a.publishedAt ?? 0;
  return [...list].sort((a, b) => (asc ? av(a) - av(b) : av(b) - av(a)));
}

const AVATAR_HUES = [14, 32, 95, 150, 172, 200, 225, 262, 290, 330];

/** Deterministic muted hue for a feed's letter avatar. */
export function avatarColor(seed: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const hue = AVATAR_HUES[Math.abs(hash) % AVATAR_HUES.length];
  return {
    bg: `oklch(0.88 0.06 ${hue})`,
    fg: `oklch(0.42 0.11 ${hue})`,
  };
}

/**
 * Split `text` into segments for client-side search highlighting: `hit` marks
 * the parts matching any whitespace-separated token in `query` (case-
 * insensitive, regex-safe). Mirrors the server's tokenization closely enough
 * for display purposes — the server (LIKE on the trigram index) decides what
 * matched; this only decides what to paint.
 */
export function highlightParts(text: string, query: string): Array<{ text: string; hit: boolean }> {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  if (tokens.length === 0 || !text) return [{ text, hit: false }];
  const pattern = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return text
    .split(new RegExp(`(${pattern})`, "gi"))
    .map((part, i) => ({ text: part, hit: i % 2 === 1 }))
    .filter((part) => part.text !== "");
}
