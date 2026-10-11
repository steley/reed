CREATE VIRTUAL TABLE `articles_fts` USING fts5(`title`, `summary`, `content`, `article_id` UNINDEXED);--> statement-breakpoint
INSERT INTO `articles_fts`(`title`, `summary`, `content`, `article_id`)
SELECT `title`, `summary`, `content`, `id` FROM `articles`;--> statement-breakpoint
CREATE TRIGGER `articles_fts_ai` AFTER INSERT ON `articles` BEGIN
	INSERT INTO `articles_fts`(`title`, `summary`, `content`, `article_id`) VALUES (new.`title`, new.`summary`, new.`content`, new.`id`);
END;--> statement-breakpoint
CREATE TRIGGER `articles_fts_au` AFTER UPDATE ON `articles` BEGIN
	DELETE FROM `articles_fts` WHERE `article_id` = old.`id`;
	INSERT INTO `articles_fts`(`title`, `summary`, `content`, `article_id`) VALUES (new.`title`, new.`summary`, new.`content`, new.`id`);
END;--> statement-breakpoint
CREATE TRIGGER `articles_fts_ad` AFTER DELETE ON `articles` BEGIN
	DELETE FROM `articles_fts` WHERE `article_id` = old.`id`;
END;
