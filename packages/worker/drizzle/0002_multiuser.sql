-- Multi-user: users table, per-user scoping on folders/feeds, article
-- uniqueness per (feed_id, url). Hand-written (drizzle-kit cannot generate the
-- legacy-data backfill); schema.ts is kept in sync with the final state.
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);--> statement-breakpoint
-- Rows that predate multi-user (single-user era). The password hash is not a
-- valid scrypt string, so this account can never log in; the first real
-- registration claims its data (see routes/auth.ts).
INSERT INTO "users" ("id", "email", "password_hash", "created_at")
VALUES ('legacy', 'legacy@reed.invalid', 'legacy', 0)
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
ALTER TABLE "folders" ADD COLUMN "user_id" text NOT NULL DEFAULT 'legacy';--> statement-breakpoint
ALTER TABLE "feeds" ADD COLUMN "user_id" text NOT NULL DEFAULT 'legacy';--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" DROP CONSTRAINT "folders_name_unique";--> statement-breakpoint
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_url_unique";--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT "articles_url_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "folders_user_id_name_unique" ON "folders" USING btree ("user_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "feeds_user_id_url_unique" ON "feeds" USING btree ("user_id","url");--> statement-breakpoint
CREATE UNIQUE INDEX "articles_feed_id_url_unique" ON "articles" USING btree ("feed_id","url");--> statement-breakpoint
CREATE INDEX "idx_feeds_user_id" ON "feeds" USING btree ("user_id");
