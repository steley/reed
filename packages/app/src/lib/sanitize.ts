import DOMPurify from "dompurify";

/**
 * Sanitize rendered article HTML (AUDIT-001): feed content is untrusted
 * third-party input; DOMPurify strips script-bearing markup and javascript:
 * URLs while keeping ordinary formatting tags. Applied to every string that
 * reaches dangerouslySetInnerHTML.
 */

/**
 * Open all article links in a new tab so reading is never interrupted
 * (2026-10-16). The hook runs on every sanitized node; DOMPurify already
 * removed javascript: URLs and unsafe attributes before this fires.
 */
let hookInstalled = false;
function installLinkHook(): void {
  if (hookInstalled) return;
  hookInstalled = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName !== "A") return;
    const anchor = node as HTMLAnchorElement;
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  });
}

export function sanitizeArticleHtml(html: string): string {
  installLinkHook();
  return DOMPurify.sanitize(html);
}
