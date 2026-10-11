// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderArticleHtml } from "./render.ts";

describe("renderArticleHtml", () => {
  it("renders markdown through marked", () => {
    const html = renderArticleHtml("# Title\n\nbody with **bold**");
    expect(html).toContain("<h1>");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("does not run already-HTML content through marked", () => {
    // Regression: a whitespace-indented <blockquote> (Readability output
    // shape) was mangled into a literal code block by the markdown pass.
    const raw = "<div><p>intro</p>\n  \n\n          <blockquote>\n<p>声明</p>\n</blockquote></div>";
    const html = renderArticleHtml(raw);
    expect(html).not.toContain("<pre>");
    expect(html).not.toContain("&lt;blockquote&gt;");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<p>声明</p>");
  });

  it("sanitizes script tags in both paths", () => {
    expect(renderArticleHtml("<p>ok</p><script>alert(1)</script>")).not.toContain("<script");
    expect(renderArticleHtml("text\n\n<script>alert(1)</script>")).not.toContain("<script");
  });
});
