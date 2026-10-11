import { bigint, index, integer, pgTable, text } from "drizzle-orm/pg-core";

export const folders = pgTable("folders", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const feeds = pgTable("feeds", {
  id: text("id").primaryKey(),
  url: text("url").notNull().unique(),
  title: text("title"),
  siteUrl: text("site_url"),
  description: text("description"),
  imageUrl: text("image_url"),
  folderId: text("folder_id").references(() => folders.id, { onDelete: "set null" }),
  lastFetchedAt: bigint("last_fetched_at", { mode: "number" }),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const articles = pgTable(
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
    publishedAt: bigint("published_at", { mode: "number" }),
    read: integer("read").notNull().default(0),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [
    index("idx_articles_feed_id").on(table.feedId),
    index("idx_articles_read").on(table.read),
    index("idx_articles_published_at").on(table.publishedAt),
  ],
);
