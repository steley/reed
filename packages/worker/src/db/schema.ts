import { bigint, index, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    // Scoping uniques are per-user: two users may share a folder name or a feed URL.
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const folders = pgTable(
  "folders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    name: text("name").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [uniqueIndex("folders_user_id_name_unique").on(table.userId, table.name)],
);

export const feeds = pgTable(
  "feeds",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    url: text("url").notNull(),
    title: text("title"),
    siteUrl: text("site_url"),
    description: text("description"),
    imageUrl: text("image_url"),
    folderId: text("folder_id").references(() => folders.id, { onDelete: "set null" }),
    lastFetchedAt: bigint("last_fetched_at", { mode: "number" }),
    lastError: text("last_error"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [
    uniqueIndex("feeds_user_id_url_unique").on(table.userId, table.url),
    index("idx_feeds_user_id").on(table.userId),
  ],
);

export const articles = pgTable(
  "articles",
  {
    id: text("id").primaryKey(),
    feedId: text("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    title: text("title"),
    summary: text("summary"),
    content: text("content"),
    publishedAt: bigint("published_at", { mode: "number" }),
    read: integer("read").notNull().default(0),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [
    uniqueIndex("articles_feed_id_url_unique").on(table.feedId, table.url),
    index("idx_articles_feed_id").on(table.feedId),
    index("idx_articles_read").on(table.read),
    index("idx_articles_published_at").on(table.publishedAt),
  ],
);
