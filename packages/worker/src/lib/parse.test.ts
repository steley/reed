import { describe, expect, it } from "vitest";
import { parseFeed } from "./parse.ts";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const RSS_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Test Blog</title>
    <link>https://example.com</link>
    <description>A test RSS feed</description>
    <image>
      <url>https://example.com/logo.png</url>
    </image>
    <item>
      <title>First Post</title>
      <link>https://example.com/first</link>
      <description>Summary of first post</description>
      <content:encoded><![CDATA[<p>Full content of first post</p>]]></content:encoded>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Second Post</title>
      <link>https://example.com/second</link>
      <description>Summary of second post</description>
      <pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const ATOM_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Test Atom Feed</title>
  <subtitle>An Atom feed for testing</subtitle>
  <link href="https://atom.example.com" rel="alternate"/>
  <icon>https://atom.example.com/icon.png</icon>
  <entry>
    <title>Atom Entry One</title>
    <link href="https://atom.example.com/one" rel="alternate"/>
    <summary>Summary of entry one</summary>
    <content type="html">&lt;p&gt;Full content of entry one&lt;/p&gt;</content>
    <published>2024-01-01T00:00:00Z</published>
    <id>https://atom.example.com/one</id>
  </entry>
  <entry>
    <title>Atom Entry Two</title>
    <link href="https://atom.example.com/two" rel="alternate"/>
    <summary>Summary of entry two</summary>
    <updated>2024-01-02T00:00:00Z</updated>
    <id>https://atom.example.com/two</id>
  </entry>
</feed>`;

const RSS_NO_IMAGE = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>No Image Feed</title>
    <link>https://noimage.example.com</link>
    <description>Feed without an image</description>
    <item>
      <title>Only Post</title>
      <link>https://noimage.example.com/only</link>
      <description>Only post summary</description>
    </item>
  </channel>
</rss>`;

const INVALID_XML = `this is not xml at all`;
const UNKNOWN_XML = `<?xml version="1.0"?><unknown><data>foo</data></unknown>`;

// ---------------------------------------------------------------------------
// RSS 2.0 tests
// ---------------------------------------------------------------------------

describe("parseFeed — RSS 2.0", () => {
  it("parses feed metadata", () => {
    const result = parseFeed(RSS_FEED);
    expect(result).not.toBeNull();
    expect(result!.meta.title).toBe("Test Blog");
    expect(result!.meta.siteUrl).toBe("https://example.com");
    expect(result!.meta.description).toBe("A test RSS feed");
    expect(result!.meta.imageUrl).toBe("https://example.com/logo.png");
  });

  it("parses articles", () => {
    const result = parseFeed(RSS_FEED);
    expect(result!.articles).toHaveLength(2);
  });

  it("parses first article fields", () => {
    const article = parseFeed(RSS_FEED)!.articles[0]!;
    expect(article.url).toBe("https://example.com/first");
    expect(article.title).toBe("First Post");
    expect(article.summary).toBe("Summary of first post");
    expect(article.content).toBe("<p>Full content of first post</p>");
    expect(article.publishedAt).toBe(Date.parse("Mon, 01 Jan 2024 00:00:00 GMT"));
  });

  it("parses article with no content:encoded as null content", () => {
    const article = parseFeed(RSS_FEED)!.articles[1]!;
    expect(article.content).toBeNull();
    expect(article.url).toBe("https://example.com/second");
  });

  it("handles feed with no image", () => {
    const result = parseFeed(RSS_NO_IMAGE);
    expect(result!.meta.imageUrl).toBeNull();
  });

  it("handles article with no pubDate as null publishedAt", () => {
    const article = parseFeed(RSS_NO_IMAGE)!.articles[0]!;
    expect(article.publishedAt).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Atom tests
// ---------------------------------------------------------------------------

describe("parseFeed — Atom", () => {
  it("parses feed metadata", () => {
    const result = parseFeed(ATOM_FEED);
    expect(result).not.toBeNull();
    expect(result!.meta.title).toBe("Test Atom Feed");
    expect(result!.meta.siteUrl).toBe("https://atom.example.com");
    expect(result!.meta.description).toBe("An Atom feed for testing");
    expect(result!.meta.imageUrl).toBe("https://atom.example.com/icon.png");
  });

  it("parses entries", () => {
    const result = parseFeed(ATOM_FEED);
    expect(result!.articles).toHaveLength(2);
  });

  it("parses first entry fields", () => {
    const article = parseFeed(ATOM_FEED)!.articles[0]!;
    expect(article.url).toBe("https://atom.example.com/one");
    expect(article.title).toBe("Atom Entry One");
    expect(article.summary).toBe("Summary of entry one");
    expect(article.publishedAt).toBe(Date.parse("2024-01-01T00:00:00Z"));
  });

  it("falls back to updated when published is absent", () => {
    const article = parseFeed(ATOM_FEED)!.articles[1]!;
    expect(article.publishedAt).toBe(Date.parse("2024-01-02T00:00:00Z"));
  });
});

// ---------------------------------------------------------------------------
// Error / edge case tests
// ---------------------------------------------------------------------------

describe("parseFeed — edge cases", () => {
  it("returns null for invalid XML", () => {
    expect(parseFeed(INVALID_XML)).toBeNull();
  });

  it("returns null for valid XML that is not RSS or Atom", () => {
    expect(parseFeed(UNKNOWN_XML)).toBeNull();
  });

  it("parses feeds with many HTML entities in content:encoded", () => {
    // Simulate a feed where content:encoded contains lots of escaped HTML
    // (e.g. Astro blogs). Default entity limit of 1000 would fail this.
    const manyEntities = "&lt;p&gt;text&lt;/p&gt;".repeat(100);
    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Entity Heavy Feed</title>
    <link>https://example.com</link>
    <description>Feed with lots of entities</description>
    <item>
      <title>Rich Article</title>
      <link>https://example.com/rich</link>
      <content:encoded>${manyEntities}</content:encoded>
    </item>
  </channel>
</rss>`;
    const result = parseFeed(feed);
    expect(result).not.toBeNull();
    expect(result!.articles).toHaveLength(1);
    expect(result!.articles[0]!.content).toContain("<p>text</p>");
  });

  it("decodes numeric HTML entities in titles", () => {
    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Foo &#8211; Bar</title>
    <link>https://example.com</link>
    <item>
      <title>It&#039;s &#039;quoted&#039;</title>
      <link>https://example.com/a</link>
    </item>
  </channel>
</rss>`;
    const result = parseFeed(feed);
    expect(result!.meta.title).toBe("Foo – Bar");
    expect(result!.articles[0]!.title).toBe("It's 'quoted'");
  });
});

describe("parseFeed — Atom link rel fallback", () => {
  it("never falls back to a rel=self link", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>T</title>
  <link rel="self" href="https://example.com/feed.xml"/>
  <link rel="enclosure" href="https://example.com/audio.mp3"/>
  <entry>
    <title>E</title>
    <link rel="self" href="https://example.com/entry-self"/>
    <link rel="enclosure" href="https://example.com/entry.mp3"/>
    <id>https://example.com/entry</id>
  </entry>
</feed>`;
    const parsed = parseFeed(xml)!;
    expect(parsed).not.toBeNull();
    expect(parsed.meta.siteUrl).toBe("https://example.com/audio.mp3");
    expect(parsed.articles[0]!.url).toBe("https://example.com/entry.mp3");
  });
});
