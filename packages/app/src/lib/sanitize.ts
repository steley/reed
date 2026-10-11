import DOMPurify from "dompurify";

/**
 * Sanitize rendered article HTML (AUDIT-001): feed content is untrusted
 * third-party input; DOMPurify strips script-bearing markup and javascript:
 * URLs while keeping ordinary formatting tags. Applied to every string that
 * reaches dangerouslySetInnerHTML.
 */
export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
