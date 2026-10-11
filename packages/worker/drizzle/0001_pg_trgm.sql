-- pg_trgm powers the trigram GIN index on articles backing ILIKE substring
-- search (the Postgres replacement for the old SQLite FTS5 trigram table).
-- Lives in one hand-written migration with the index: drizzle-kit cannot
-- generate extension statements, and the index must be created AFTER the
-- extension exists — so it must not live in the 0000 baseline either.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_articles_search
  ON "articles" USING gin ("title" gin_trgm_ops, "summary" gin_trgm_ops, "content" gin_trgm_ops);
