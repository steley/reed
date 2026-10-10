import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const folders = sqliteTable("folders", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at").notNull(),
});

export const feeds = sqliteTable("feeds", {
  id: text("id").primaryKey(),
  url: text("url").notNull().unique(),
  title: text("title"),
  siteUrl: text("site_url"),
  description: text("description"),
  imageUrl: text("image_url"),
  folderId: text("folder_id").references(() => folders.id, { onDelete: "set null" }),
  lastFetchedAt: integer("last_fetched_at"),
  createdAt: integer("created_at").notNull(),
});

export const articles = sqliteTable(
  "articles",
  {
    id: text("id").primaryKey(),
    feedId: text("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    url: text("url").notNull().unique(),
    title: text("title"),
    summary: text("summary"),
    content: text("content"),
    publishedAt: integer("published_at"),
    read: integer("read").notNull().default(0),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("idx_articles_feed_id").on(table.feedId),
    index("idx_articles_read").on(table.read),
    index("idx_articles_published_at").on(table.publishedAt),
  ],
);
