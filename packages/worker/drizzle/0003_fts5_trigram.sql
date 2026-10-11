DROP TRIGGER `articles_fts_ai`;--> statement-breakpoint
DROP TRIGGER `articles_fts_au`;--> statement-breakpoint
DROP TRIGGER `articles_fts_ad`;--> statement-breakpoint
DROP TABLE `articles_fts`;--> statement-breakpoint
-- trigram tokenizer: unicode61 (0002) treats whole CJK sentences as single
-- tokens, making Chinese search useless. trigram enables substring matching.
-- No backticks on the option name — libsql's executeMultiple can't parse them.
CREATE VIRTUAL TABLE `articles_fts` USING fts5(`title`, `summary`, `content`, `article_id` UNINDEXED, tokenize = 'trigram');--> statement-breakpoint
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
