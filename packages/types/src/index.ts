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
  folderId: string | null;
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

/**
 * Input shape for updating a feed (move into/out of a folder).
 */
export interface UpdateFeed {
  folderId: string | null;
}

// ---------------------------------------------------------------------------
// Folder
// ---------------------------------------------------------------------------

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

/**
 * Input shape for creating a new folder.
 */
export interface NewFolder {
  name: string;
}

/**
 * Input shape for renaming a folder.
 */
export interface UpdateFolder {
  name: string;
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
 * Article as returned by list endpoints (GET /api/articles) — the heavy
 * `content` column is omitted; full bodies come from GET /api/articles/:id.
 */
export type ArticleListItem = Omit<Article, "content">;

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
