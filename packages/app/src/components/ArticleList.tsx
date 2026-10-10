import { useState } from "react";
import { Button, Empty } from "@cloudflare/kumo";
import {
  ArticleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsClockwiseIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { Article, Feed } from "@cloud-reader/types";

type SortOrder = "desc" | "asc";

/** Strip HTML tags and decode all entities for plain-text preview. */
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

interface ArticleListProps {
  articles: Article[];
  selectedArticleId: string | null;
  selectedFeed: Feed | null;
  feedsById: Record<string, Feed>;
  isRefreshing: boolean;
  onSelectArticle: (id: string) => void;
  onRefresh: (() => void) | null;
  onDeleteFeed: (() => void) | null;
}

export function ArticleList({
  articles,
  selectedArticleId,
  selectedFeed,
  feedsById,
  isRefreshing,
  onSelectArticle,
  onRefresh,
  onDeleteFeed,
}: ArticleListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const title = selectedFeed?.title ?? selectedFeed?.url ?? "All articles";

  const sorted = [...articles].sort((a, b) => {
    const tA = a.publishedAt ?? a.createdAt;
    const tB = b.publishedAt ?? b.createdAt;
    return sortOrder === "desc" ? tB - tA : tA - tB;
  });

  if (articles.length === 0) {
    return (
      <div className="flex h-full flex-col bg-kumo-base">
        <header className="border-b border-kumo-line px-4 py-3">
          <h2 className="font-semibold text-kumo-strong">{title}</h2>
        </header>
        <div className="flex flex-1 items-center justify-center p-4">
          <Empty
            icon={<ArticleIcon size={32} />}
            title="No articles"
            description="Add a feed to get started, or refresh an existing one."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-kumo-base">
      <header className="border-b border-kumo-line px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-kumo-strong">
            {title}
            <span className="ml-2 text-xs font-normal text-kumo-subtle">· {articles.length}</span>
          </h2>
          <div className="flex items-center gap-1">
            {onRefresh && (
              <Button
                variant="ghost"
                size="xs"
                shape="square"
                icon={<ArrowsClockwiseIcon className={isRefreshing ? "animate-spin" : ""} />}
                aria-label="Refresh feed"
                title="Refresh feed"
                disabled={isRefreshing}
                onClick={onRefresh}
              />
            )}
            <Button
              variant="ghost"
              size="xs"
              shape="square"
              icon={sortOrder === "desc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
              aria-label={sortOrder === "desc" ? "Oldest first" : "Newest first"}
              title={
                sortOrder === "desc"
                  ? "Showing newest first — click for oldest first"
                  : "Showing oldest first — click for newest first"
              }
              onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
            />
            {onDeleteFeed &&
              (confirmDelete ? (
                <>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => {
                      onDeleteFeed();
                      setConfirmDelete(false);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button variant="ghost" size="xs" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="xs"
                  shape="square"
                  icon={<TrashIcon />}
                  aria-label="Delete feed"
                  title="Delete feed and all its articles"
                  onClick={() => setConfirmDelete(true)}
                />
              ))}
          </div>
        </div>
      </header>

      <ul className="flex-1 overflow-y-auto">
        {sorted.map((article) => (
          <li key={article.id}>
            <button
              type="button"
              onClick={() => onSelectArticle(article.id)}
              className={[
                "w-full border-b border-kumo-line text-left transition-colors",
                "hover:bg-kumo-tint",
                selectedArticleId === article.id ? "bg-kumo-tint" : "",
                article.read === 1 ? "opacity-75" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "py-4 pr-4",
                  article.read === 0
                    ? "border-l-2 border-kumo-brand pl-[14px]"
                    : "border-l-2 border-transparent pl-[14px]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={[
                      "line-clamp-2 text-sm leading-snug",
                      article.read === 0 ? "font-semibold text-kumo-strong" : "text-kumo-default",
                    ].join(" ")}
                  >
                    {article.title ?? article.url}
                  </span>
                  {article.read === 0 && (
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-kumo-brand" />
                  )}
                </div>
                {article.summary && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-kumo-dimmed">
                    {stripHtml(article.summary)}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-kumo-subtle">
                  {!selectedFeed && (
                    <>
                      <span className="truncate font-medium">
                        {feedsById[article.feedId]?.title ?? feedsById[article.feedId]?.url ?? ""}
                      </span>
                      {article.publishedAt && <span aria-hidden>·</span>}
                    </>
                  )}
                  {article.publishedAt && (
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
