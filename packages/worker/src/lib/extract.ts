import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import { fetchWithGuards } from "./refresh.ts";

const ACCEPT_HTML = "text/html,application/xhtml+xml,*/*;q=0.8";

// Upstream _headerDuplicatesTitle uses token-overlap similarity, which
// misfires on CJK: a section heading sharing one Latin token with the page
// title ("Foundermail 的缺点" vs "FounderMail - 免费的域名邮箱") scored
// 0.81 and was deleted mid-article. A title-duplicate heading is one that
// IS the title — require normalized containment instead of token overlap.
{
  const proto = Readability.prototype as unknown as {
    _articleTitle: string;
    _headerDuplicatesTitle(node: { tagName: string; textContent: string | null }): boolean;
  };
  proto._headerDuplicatesTitle = function (node) {
    // Keep the upstream tagName guard. Without it the top-down cleanup loop
    // treats ANY node whose text is contained in the title as a duplicate
    // header — e.g. an inline <a>TempMail.cc</a> at the start of a paragraph
    // whose text happens to be a substring of the title gets deleted whole.
    if (!/^H[1-6]$/.test(node.tagName ?? "")) return false;
    const heading = (node.textContent ?? "").toLowerCase().replace(/\s+/g, " ").trim();
    const title = (this._articleTitle ?? "").toLowerCase().replace(/\s+/g, " ").trim();
    return heading.length > 0 && title.includes(heading);
  };
}

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
 * Remove article-scoped headers carrying page metadata (date, tags). The
 * reader shows title and date from parsed metadata itself; Readability
 * otherwise folds such a header's meta paragraph into the body text (a
 * date glued to a run of tag links).
 */
function stripArticleHeaders(document: ReturnType<typeof parseHTML>["document"]): void {
  for (const header of document.querySelectorAll("article header, main header")) {
    if (header.querySelector("time")) header.remove();
  }
}

/**
 * Unwrap <blockquote> elements before extraction. Readability scores
 * paragraphs by their container, so a long quoted statement inside a
 * blockquote (e.g. a bilingual post quoting a source) out-competes the real
 * article body as a candidate and gets promoted alone — the surrounding
 * prose is dropped. Each direct child is tagged `data-reed-quote` first so
 * `restoreQuotes()` can wrap the run back into a <blockquote> afterwards
 * (class attributes are stripped by Readability; data attributes survive).
 */
function unwrapBlockquotes(document: ReturnType<typeof parseHTML>["document"]): void {
  for (const bq of [...document.querySelectorAll("blockquote")]) {
    const parent = bq.parentNode;
    if (!parent) continue;
    for (const child of [...bq.children]) {
      child.setAttribute("data-reed-quote", "");
    }
    while (bq.firstChild) parent.insertBefore(bq.firstChild, bq);
    bq.remove();
  }
}

/**
 * Re-wrap consecutive `data-reed-quote`-tagged siblings (unwrapped by
 * `unwrapBlockquotes`) into blockquotes, restoring the quote formatting.
 */
function restoreQuotes(html: string): string {
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`);
  for (const first of [...document.querySelectorAll("[data-reed-quote]")]) {
    // consumed nodes have their marker removed below — skip them
    if (!first.hasAttribute("data-reed-quote")) continue;
    const parent = first.parentNode;
    if (!parent) continue;
    const quote = document.createElement("blockquote");
    parent.insertBefore(quote, first);
    let node: typeof first | null = first;
    while (node && node.hasAttribute("data-reed-quote")) {
      const next: typeof first | null = node.nextElementSibling;
      node.removeAttribute("data-reed-quote");
      quote.appendChild(node);
      node = next;
    }
  }
  return document.body.innerHTML;
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
    stripArticleHeaders(document);
    unwrapBlockquotes(document);
    const parsed = new Readability(document).parse();
    const content = parsed?.content?.trim();
    if (!content) return null;
    return absolutizeUrls(restoreQuotes(content), url);
  } catch {
    return null;
  }
}

// Strip tags (and script/style bodies) for rough plain-text length
// comparison. Good enough for a sanity ratio — this is a truncation
// detector, not a text extractor. Markdown syntax (`[text](url)`, `**`) is
// left in on purpose: link text and emphasis text still count toward the
// length, which is what the ratio needs.
const HTML_NOISE_RE = /<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi;
const HTML_TAG_RE = /<[^>]*>/g;

export function htmlToTextLength(html: string): number {
  return html.replace(HTML_NOISE_RE, " ").replace(HTML_TAG_RE, " ").replace(/\s+/g, " ").trim()
    .length;
}

// Below this reference length the ratio is noise — a one-line excerpt next
// to a short-but-valid extraction flips the verdict for no benefit.
const TRUNCATION_CHECK_MIN_REF = 200;

/**
 * Guard against extraction disasters: if the extracted plain text is
 * drastically shorter than the feed-provided text we already hold
 * (content ?? summary), Readability likely deleted real body content
 * (e.g. a patch misfiring on an inline element) and the extraction should
 * be discarded in favor of the feed-provided text. Catches whole-chunk
 * loss; partial paragraph loss inside an otherwise longer extraction is
 * undetectable by length alone.
 */
export function extractionLooksTruncated(extractedHtml: string, referenceHtml: string): boolean {
  const reference = htmlToTextLength(referenceHtml);
  if (reference < TRUNCATION_CHECK_MIN_REF) return false;
  return htmlToTextLength(extractedHtml) < reference * 0.5;
}
