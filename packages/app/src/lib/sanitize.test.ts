// @vitest-environment jsdom
// (happy-dom's DOM implementation misparses template content — DOMPurify
// officially supports jsdom, so the tests run there.)
import { describe, expect, it } from "vitest";
import { sanitizeArticleHtml } from "./sanitize.ts";

describe("sanitizeArticleHtml", () => {
  it("keeps ordinary formatting HTML", () => {
    const html = sanitizeArticleHtml(
      '<p>Hi <strong>there</strong></p><a href="https://x.com">x</a>',
    );
    expect(html).toContain("<p>");
    expect(html).toContain("<strong>there</strong>");
    expect(html).toContain('href="https://x.com"');
  });

  it("strips <script> tags", () => {
    const html = sanitizeArticleHtml("<p>ok</p><script>alert(1)</script>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(1)");
  });

  it("strips event-handler attributes", () => {
    const html = sanitizeArticleHtml('<img src="https://x.com/i.png" onerror="alert(1)">');
    expect(html).not.toContain("onerror");
  });

  it("neutralizes javascript: URLs in links and images", () => {
    const html = sanitizeArticleHtml('<a href="javascript:alert(1)">click</a>');
    expect(html).not.toContain("javascript:");
    const img = sanitizeArticleHtml('<img src="javascript:alert(1)">');
    expect(img).not.toContain("javascript:");
  });

  it("strips svg onload vectors", () => {
    const html = sanitizeArticleHtml('<svg onload="alert(1)"><circle/></svg>');
    expect(html).not.toContain("onload");
  });

  it("opens all links in a new tab with noopener", () => {
    const html = sanitizeArticleHtml(
      '<p><a href="https://a.com">A</a> <a href="/relative">B</a></p>',
    );
    expect(html.match(/target="_blank"/g)).toHaveLength(2);
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(2);
  });

  it("forces new-tab attributes even when the source claims its own target", () => {
    const html = sanitizeArticleHtml('<a href="https://a.com" target="_self">A</a>');
    expect(html).toContain('target="_blank"');
    expect(html).not.toContain("_self");
  });
});
