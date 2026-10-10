/**
 * Canonical types for reed.
 * All packages (worker, app, cli) import from here.
 * Never redefine these inline.
 */

// ---------------------------------------------------------------------------
// Feed
// ---------------------------------------------------------------------------

export interface Feed {
  id: string;
  url: string;
  title: string | null;
  siteUrl: string | null;
  description: string | null;
  imageUrl: string | null;
  lastFetchedAt: number | null;
  createdAt: number;
}

/**
 * Input shape for creating a new feed.
 * The worker validates this from the request body.
 */
export interface NewFeed {
  url: string;
}

// ---------------------------------------------------------------------------
// Article
// ---------------------------------------------------------------------------

export interface Article {
  id: string;
  feedId: string;
  url: string;
  title: string | null;
  summary: string | null;
  content: string | null;
  publishedAt: number | null;
  read: number; // 0 = unread, 1 = read (SQLite boolean)
  createdAt: number;
}

/**
 * Input shape for updating an article.
 */
export interface UpdateArticle {
  read: boolean;
}

// ---------------------------------------------------------------------------
// API response shapes
// ---------------------------------------------------------------------------

/**
 * Returned by POST /api/feeds/:id/refresh
 */
export interface RefreshResult {
  added: number;
  updated: number;
}

// ---------------------------------------------------------------------------
// Parsed feed — internal shape returned by parse.ts
// Not exposed in the API, but shared if the cli ever parses feeds locally.
// ---------------------------------------------------------------------------

export interface ParsedFeedMeta {
  title: string | null;
  siteUrl: string | null;
  description: string | null;
  imageUrl: string | null;
}

export interface ParsedArticle {
  url: string;
  title: string | null;
  summary: string | null;
  content: string | null;
  publishedAt: number | null;
}

export interface ParsedFeed {
  meta: ParsedFeedMeta;
  articles: ParsedArticle[];
}
