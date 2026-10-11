import type { ArticleListItem, Feed } from "@reed/types";
import { useEffect } from "react";
import {
  cleanSummary,
  feedDisplayName,
  highlightParts,
  relativeTime,
  sortArticles,
} from "../lib/display.ts";
import { Filter, MarkAllRead, Menu, Refresh, Sort } from "./icons.tsx";

/** Render `text` with the search tokens wrapped in <mark>. */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  return (
    <>
      {highlightParts(text, query).map((part, i) =>
        part.hit ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static segments re-derived every render, never reordered
          <mark key={i} className="rounded-[2px] bg-accent/20 text-inherit">
            {part.text}
          </mark>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: static segments re-derived every render, never reordered
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

interface Props {
  articles: ArticleListItem[];
  isLoading: boolean;
  selectedArticleId: string | null;
  selectedFeed: Feed | null;
  feedsById: Record<string, Feed>;
  isRefreshing: boolean;
  sortAsc: boolean;
  unreadOnly: boolean;
  searchQuery: string;
  onSearchChange(query: string): void;
  // mobile: show as full screen list (article not selected)
  onOpenMenu(): void;
  onSelectArticle(id: string): void;
  onToggleSort(): void;
  onToggleUnread(): void;
  onMarkAllRead(): void;
  onRefresh(): void;
}

export function ArticleList({
  articles,
  isLoading,
  selectedArticleId,
  selectedFeed,
  feedsById,
  isRefreshing,
  sortAsc,
  unreadOnly,
  searchQuery,
  onSearchChange,
  onOpenMenu,
  onSelectArticle,
  onToggleSort,
  onToggleUnread,
  onMarkAllRead,
  onRefresh,
}: Props) {
  const sorted = sortArticles(articles, sortAsc);
  const hasUnread = articles.some((a) => a.read === 0);

  // Keep the selected card visible when keyboard navigation moves the selection
  useEffect(() => {
    if (!selectedArticleId) return;
    document
      .querySelector(`[data-article-id="${selectedArticleId}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedArticleId]);

  return (
    <div className="flex h-full min-w-0 flex-col bg-canvas">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-line px-4 py-3.5 md:px-5">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="-ml-1 rounded-lg p-1.5 text-ink-2 hover:bg-card hover:text-ink md:hidden"
        >
          <Menu width={17} height={17} />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight">
          {selectedFeed ? feedDisplayName(selectedFeed) : "All articles"}
          <span className="ml-2 text-[13px] font-normal text-ink-3 tabular-nums">
            {articles.length}
          </span>
        </h1>
        {hasUnread && (
          <button
            type="button"
            onClick={onMarkAllRead}
            aria-label="Mark all as read"
            title="Mark all as read"
            className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-card hover:text-ink"
          >
            <MarkAllRead width={15} height={15} />
          </button>
        )}
        <button
          type="button"
          onClick={onToggleUnread}
          aria-pressed={unreadOnly}
          aria-label="Toggle unread filter"
          title={unreadOnly ? "Showing unread only" : "Showing all articles"}
          className={`rounded-lg p-1.5 transition-colors hover:bg-card hover:text-ink ${
            unreadOnly ? "text-accent" : "text-ink-3"
          }`}
        >
          <Filter width={15} height={15} />
        </button>
        <button
          type="button"
          onClick={onToggleSort}
          aria-label="Toggle sort order"
          title={sortAsc ? "Oldest first" : "Newest first"}
          className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-card hover:text-ink"
        >
          <Sort width={15} height={15} className={sortAsc ? "" : "rotate-180"} />
        </button>
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh"
          disabled={isRefreshing}
          className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-card hover:text-ink disabled:opacity-40"
        >
          <Refresh width={15} height={15} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </header>

      {/* Search */}
      <div className="border-b border-line px-4 py-2 md:px-5">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search articles"
          aria-label="Search articles"
          className="w-full rounded-lg bg-card px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:ring-1 focus:ring-accent/50"
        />
      </div>

      {/* Cards */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6">
            <p className="text-sm text-ink-3">{isLoading ? "Loading…" : "Nothing here yet."}</p>
          </div>
        ) : (
          <ul>
            {sorted.map((article) => {
              const selected = article.id === selectedArticleId;
              const unread = article.read === 0;
              const feed = feedsById[article.feedId];
              const summary = cleanSummary(article.summary);
              return (
                <li key={article.id}>
                  <button
                    type="button"
                    data-article-id={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className={`relative block w-full border-b border-line/70 px-4 py-3.5 text-left transition-colors md:px-5 ${
                      selected ? "bg-card" : "hover:bg-card/50"
                    }`}
                  >
                    {selected && (
                      <span className="absolute inset-y-0 left-0 w-[2.5px] bg-accent" aria-hidden />
                    )}
                    <div className="flex items-start gap-2">
                      <h2
                        className={`min-w-0 flex-1 text-[14px] leading-snug ${
                          unread ? "font-semibold text-ink" : "font-normal text-ink-2"
                        }`}
                      >
                        <Highlight text={article.title ?? "(untitled)"} query={searchQuery} />
                      </h2>
                      {unread && (
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      )}
                    </div>
                    {summary && (
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
                        <Highlight text={summary} query={searchQuery} />
                      </p>
                    )}
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-3">
                      {!selectedFeed && feed && (
                        <>
                          <span className="truncate">{feedDisplayName(feed)}</span>
                          <span aria-hidden>·</span>
                        </>
                      )}
                      <span className="shrink-0 tabular-nums">
                        {relativeTime(article.publishedAt)}
                      </span>
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
