import { marked } from "marked";
import { sanitizeArticleHtml } from "./sanitize.ts";

marked.setOptions({ async: false, gfm: true, breaks: false });

/**
 * Render article content (markdown or HTML) to sanitized HTML. Content that
 * is already HTML — full-text extraction output, HTML content:encoded —
 * skips marked: its markdown pass mangles whitespace-indented block tags
 * into literal code blocks (e.g. an indented <blockquote> rendered as text).
 */
export function renderArticleHtml(raw: string): string {
  if (/^\s*</.test(raw)) {
    return sanitizeArticleHtml(raw);
  }
  return sanitizeArticleHtml(marked.parse(raw) as string);
}
