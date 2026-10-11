import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import { fetchWithGuards } from "./refresh.ts";

const ACCEPT_HTML = "text/html,application/xhtml+xml,*/*;q=0.8";

/**
 * Rewrite relative img src / a href against the article page URL. Extracted
 * content is rendered on a different origin, so a relative src would resolve
 * against the reader's own domain and 404. Absolute and protocol-relative
 * URLs pass through unchanged, so this is idempotent.
 */
export function absolutizeUrls(html: string, baseUrl: string): string {
  // linkedom quirk: a bare <body> fragment yields an empty body.innerHTML —
  // the fragment must be wrapped in a full document shell.
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`);
  for (const el of document.querySelectorAll("img[src], a[href]")) {
    const attr = el.hasAttribute("src") ? "src" : "href";
    const value = el.getAttribute(attr);
    if (!value) continue;
    try {
      el.setAttribute(attr, new URL(value, baseUrl).href);
    } catch {
      // malformed URL — leave as-is
    }
  }
  return document.body.innerHTML;
}

/**
 * Unwrap <blockquote> elements before extraction. Readability scores
 * paragraphs by their container, so a long quoted statement inside a
 * blockquote (e.g. a bilingual post quoting a source) out-competes the real
 * article body as a candidate and gets promoted alone — the surrounding
 * prose is dropped. Merging quoted paragraphs into the article flow keeps
 * all the score on the actual content container. Styling loss of the quote
 * itself is accepted: completeness beats indent formatting.
 */
function unwrapBlockquotes(document: ReturnType<typeof parseHTML>["document"]): void {
  for (const bq of [...document.querySelectorAll("blockquote")]) {
    const parent = bq.parentNode;
    if (!parent) continue;
    while (bq.firstChild) parent.insertBefore(bq.firstChild, bq);
    bq.remove();
  }
}

/**
 * Fetch an article page and extract its main content as HTML (Firefox reader
 * mode). Any failure — network, non-HTML body, unparseable page — returns
 * null: a missing full text is acceptable, the reader falls back to the
 * feed-provided summary.
 */
export async function extractFullText(url: string): Promise<string | null> {
  try {
    const html = await fetchWithGuards(url, ACCEPT_HTML);
    const { document } = parseHTML(html);
    unwrapBlockquotes(document);
    const parsed = new Readability(document).parse();
    const content = parsed?.content?.trim();
    if (!content) return null;
    return absolutizeUrls(content, url);
  } catch {
    return null;
  }
}
