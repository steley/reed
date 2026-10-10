import { Button, Empty } from "@cloudflare/kumo";
import { ArticleIcon, ArrowSquareOutIcon, CheckIcon } from "@phosphor-icons/react";
import { marked } from "marked";
import type { Article, Feed } from "@cloud-reader/types";

/**
 * Render article body content as HTML.
 * RSS feeds may provide HTML (content:encoded) or Markdown.
 * Heuristic: if the string contains HTML tags, treat as HTML; otherwise parse as Markdown.
 */
function renderContent(raw: string): string {
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(raw);
  if (looksLikeHtml) return raw;
  return marked.parse(raw, { async: false }) as string;
}

interface ArticleReaderProps {
  article: Article | null;
  feed: Feed | null;
  onMarkRead: (id: string, read: boolean) => void;
}

export function ArticleReader({ article, feed, onMarkRead }: ArticleReaderProps) {
  if (!article) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <Empty
            icon={<ArticleIcon size={32} />}
            title="No article selected"
            description="Select an article from the list to read it."
          />
        </div>
      </div>
    );
  }

  const isRead = article.read === 1;

  return (
    <div className="flex h-full flex-col bg-kumo-base">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 border-b border-kumo-line bg-kumo-base px-6 py-3">
        <Button
          variant={isRead ? "ghost" : "secondary"}
          size="sm"
          icon={<CheckIcon />}
          className="w-32"
          onClick={() => onMarkRead(article.id, !isRead)}
        >
          {isRead ? "Mark unread" : "Mark read"}
        </Button>
        {article.url && (
          <Button
            variant="ghost"
            size="sm"
            shape="square"
            icon={<ArrowSquareOutIcon />}
            aria-label="Open original article"
            onClick={() => window.open(article.url, "_blank", "noopener,noreferrer")}
          />
        )}
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-8 py-10">
          {/* Article header */}
          <header className="mb-6">
            <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight">
              {article.url ? (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-kumo-strong hover:text-kumo-brand hover:underline"
                >
                  {article.title ?? "Untitled"}
                </a>
              ) : (
                <span className="text-kumo-strong">{article.title ?? "Untitled"}</span>
              )}
            </h1>
            <div className="flex items-center gap-2 text-sm text-kumo-dimmed">
              {feed && <span className="font-medium">{feed.title ?? feed.url}</span>}
              {feed && article.publishedAt && <span aria-hidden>·</span>}
              {article.publishedAt && (
                <span>
                  {new Date(article.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </header>
          <hr className="mb-8 border-kumo-line" />

          {/* Article body */}
          {article.content ? (
            <div
              className="article-body"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: article content from trusted RSS feeds
              dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
            />
          ) : article.summary ? (
            <div
              className="article-body"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: article summary from trusted RSS feeds
              dangerouslySetInnerHTML={{ __html: renderContent(article.summary) }}
            />
          ) : (
            <div className="flex items-center justify-center py-16">
              <Empty
                icon={<ArticleIcon size={32} />}
                title="No content available"
                description="This feed doesn't include full article content."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
