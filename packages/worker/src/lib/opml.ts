import { XMLParser } from "fast-xml-parser";

export interface OpmlFeed {
  url: string;
  title: string | null;
  /** Name of the enclosing outline folder, or null for uncategorized */
  folder: string | null;
}

export interface OpmlData {
  title: string | null;
  feeds: OpmlFeed[];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Match the feed parser's expansion cap — subscription lists with lots of
  // escaped HTML in titles shouldn't fail the 10k default.
  processEntities: { maxTotalExpansions: 100000 },
});

// Outline children may be single objects or arrays — normalize with toArray.
function toArray(value: unknown): Record<string, unknown>[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value as Record<string, unknown>[];
  return [value as Record<string, unknown>];
}

/** Collect every outline that has an xmlUrl, remembering its nearest folder ancestor. */
function collectOutlines(
  nodes: Record<string, unknown>[],
  folder: string | null,
  out: OpmlFeed[],
): void {
  for (const node of nodes) {
    const xmlUrl = node["@_xmlUrl"];
    if (typeof xmlUrl === "string" && xmlUrl.trim()) {
      const text = node["@_text"] ?? node["@_title"];
      out.push({
        url: xmlUrl.trim(),
        title: typeof text === "string" && text.trim() ? text.trim() : null,
        folder,
      });
      continue;
    }
    // Folder outline — recurse; feeds deeper than one level attach to the
    // nearest ancestor folder
    const text = node["@_text"] ?? node["@_title"];
    const name = typeof text === "string" && text.trim() ? text.trim() : folder;
    collectOutlines(toArray(node["outline"]), name, out);
  }
}

/**
 * Parse an OPML 1.0/2.0 subscription list into its folders and feeds.
 * Returns null if the XML is not an OPML document.
 */
export function parseOpml(xml: string): OpmlData | null {
  let parsed: Record<string, unknown>;
  try {
    parsed = parser.parse(xml) as Record<string, unknown>;
  } catch {
    return null;
  }

  const opml = parsed["opml"] as Record<string, unknown> | undefined;
  if (!opml) return null;

  const head = opml["head"] as Record<string, unknown> | undefined;
  const headTitle = head?.["title"];
  const feeds: OpmlFeed[] = [];
  const body = opml["body"] as Record<string, unknown> | undefined;
  collectOutlines(toArray(body?.["outline"]), null, feeds);

  return {
    title: typeof headTitle === "string" ? headTitle : null,
    feeds,
  };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build an OPML 2.0 document: one folder outline per folder, feeds nested inside. */
export function buildOpml(data: OpmlData): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<opml version="2.0">',
    "  <head>",
    `    <title>${esc(data.title ?? "Reed subscriptions")}</title>`,
    "  </head>",
    "  <body>",
  ];

  const uncategorized = data.feeds.filter((f) => f.folder === null);
  const folders = [
    ...new Set(data.feeds.map((f) => f.folder).filter((f): f is string => f !== null)),
  ];

  for (const feed of uncategorized) {
    lines.push(
      `    <outline type="rss" text="${esc(feed.title ?? feed.url)}" xmlUrl="${esc(feed.url)}" />`,
    );
  }
  for (const folder of folders) {
    lines.push(`    <outline text="${esc(folder)}">`);
    for (const feed of data.feeds.filter((f) => f.folder === folder)) {
      lines.push(
        `      <outline type="rss" text="${esc(feed.title ?? feed.url)}" xmlUrl="${esc(feed.url)}" />`,
      );
    }
    lines.push("    </outline>");
  }

  lines.push("  </body>", "</opml>", "");
  return lines.join("\n");
}
