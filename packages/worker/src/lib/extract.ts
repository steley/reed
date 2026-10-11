import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import { fetchWithGuards } from "./refresh.ts";

const ACCEPT_HTML = "text/html,application/xhtml+xml,*/*;q=0.8";

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
    const parsed = new Readability(document).parse();
    return parsed?.content?.trim() || null;
  } catch {
    return null;
  }
}
