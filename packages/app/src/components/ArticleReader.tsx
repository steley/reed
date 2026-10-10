import type { Article, Feed } from "@cloud-reader/types";
import { marked } from "marked";
import { useMemo } from "react";
import { feedDisplayName, fullDate } from "../lib/display.ts";
import { ArrowLeft, External, MarkUnread } from "./icons.tsx";

marked.setOptions({ async: false, gfm: true, breaks: false });

interface Props {
  article: Article | null;
  feed: Feed | null;
  onBack(): void; // mobile: return to list
  onMarkRead(id: string, read: boolean): void;
}

export function ArticleReader({ article, feed, onBack, onMarkRead }: Props) {
  const html = useMemo(() => {
    if (!article) return "";
    const raw = article.content ?? article.summary ?? "";
    return marked.parse(raw, { async: false }) as string;
  }, [article]);

  if (!article) {
    return (
      <div className="hidden h-full flex-col items-center justify-center gap-3 bg-canvas md:flex">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-line">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 9h8M8 13h8M8 17h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm text-ink-3">Select an article to read</p>
      </div>
    );
  }

  const url = article.url;

  return (
    <div className="flex h-full min-w-0 flex-col bg-canvas">
      {/* Toolbar */}
      <header className="flex items-center gap-1 px-3 py-2.5 md:px-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to list"
          className="-ml-1 rounded-lg p-1.5 text-ink-2 hover:bg-card hover:text-ink md:hidden"
        >
          <ArrowLeft width={17} height={17} />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => onMarkRead(article.id, false)}
          title="Mark as unread"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:bg-card hover:text-ink"
        >
          <MarkUnread width={14} height={14} />
          <span className="hidden sm:inline">Mark unread</span>
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          title="Open original"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:bg-card hover:text-ink"
        >
          <External width={14} height={14} />
          <span className="hidden sm:inline">Original</span>
        </a>
      </header>

      {/* Article */}
      <article className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[680px] px-6 pb-24 pt-4 md:px-8">
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink md:text-[30px]">
            {article.title ?? "(untitled)"}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-2">
            {feed && (
              <>
                <span className="font-medium">{feedDisplayName(feed)}</span>
                <span aria-hidden>·</span>
              </>
            )}
            <span>{fullDate(article.publishedAt)}</span>
          </p>
          <hr className="my-7 border-line" />
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML comes from our own marked-parsing of fetched feeds */}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>
    </div>
  );
}
