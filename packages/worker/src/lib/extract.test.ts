import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { extractFullText } from "./extract.ts";

// Hostnames resolve to a public IP in tests — the SSRF guard does a DNS
// lookup per hop, which must never hit the network here.
vi.mock("node:dns/promises", () => ({
  lookup: vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]),
}));

const ARTICLE_HTML = `<!doctype html>
<html>
  <head><title>T</title></head>
  <body>
    <nav>nav links nav links</nav>
    <article>
      <h1>Full Text Title</h1>
      ${Array.from({ length: 8 }, (_, i) => `<p>Paragraph ${i} with enough surrounding text for the readability scorer to keep this block.</p>`).join("\n      ")}
    </article>
  </body>
</html>`;

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("extractFullText", () => {
  it("extracts the main content from an article page", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(ARTICLE_HTML, { status: 200 }));
    const content = await extractFullText("https://blog.example.com/post");
    expect(content).toContain("Paragraph 0");
    expect(content).not.toContain("nav links nav links");
  });

  it("resolves relative image and link URLs against the article page", async () => {
    const page = `<!doctype html><html><body><article>
      ${Array.from({ length: 6 }, (_, i) => `<p>Full text paragraph ${i} with plenty of text so readability keeps it.</p>`).join("\n")}
      <p><img src="/img/cover.webp" alt="cover"><img src="photo.jpg"><img src="https://cdn.example.com/x.png"></p>
      <p><a href="/about">About</a></p>
    </article></body></html>`;
    vi.mocked(fetch).mockResolvedValue(new Response(page, { status: 200 }));
    const content = await extractFullText("https://blog.example.com/posts/one/");
    expect(content).toContain('src="https://blog.example.com/img/cover.webp"');
    expect(content).toContain('src="https://blog.example.com/posts/one/photo.jpg"');
    expect(content).toContain('src="https://cdn.example.com/x.png"');
    expect(content).toContain('href="https://blog.example.com/about"');
  });

  it("returns null on HTTP failure", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("nope", { status: 404 }));
    expect(await extractFullText("https://blog.example.com/post")).toBeNull();
  });

  it("returns null on a page with no extractable article", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("<html><body></body></html>", { status: 200 }));
    expect(await extractFullText("https://blog.example.com/post")).toBeNull();
  });

  it("returns null on a network error", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("boom"));
    expect(await extractFullText("https://blog.example.com/post")).toBeNull();
  });

  it("never fetches a private address (SSRF guard applies)", async () => {
    expect(await extractFullText("http://127.0.0.1/x")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});
