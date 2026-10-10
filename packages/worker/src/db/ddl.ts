/**
 * Canonical CREATE statements for the reed schema. Single source of
 * truth for: test databases (:memory:), local file DBs (scripts/local-db.ts),
 * and as a readable reference alongside the drizzle migrations in ./drizzle.
 */
export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS feeds (
    id TEXT PRIMARY KEY NOT NULL,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    site_url TEXT,
    description TEXT,
    image_url TEXT,
    last_fetched_at INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY NOT NULL,
    feed_id TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    summary TEXT,
    content TEXT,
    published_at INTEGER,
    read INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (feed_id) REFERENCES feeds(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_articles_feed_id ON articles(feed_id);
  CREATE INDEX IF NOT EXISTS idx_articles_read ON articles(read);
  CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
`;
