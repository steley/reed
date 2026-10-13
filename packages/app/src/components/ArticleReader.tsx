import type { Article, Feed } from "@reed/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { feedDisplayName, fullDate } from "../lib/display.ts";
import { renderArticleHtml } from "../lib/render.ts";
import { ArrowLeft, External, MarkUnread } from "./icons.tsx";

interface Props {
  article: Article | null;
  feed: Feed | null;
  onBack(): void; // mobile: return to list
  onMarkRead(id: string, read: boolean): void;
  // Desktop sidebar collapsed: the reader pane gains the sidebar's width, so
  // the text measure widens to use it instead of growing whitespace margins.
  wide?: boolean;
}

// Reader font-size steps, cycled by the Aa toolbar button. Values are CSS
// font-sizes applied inline to .article-body (nested rules use em, so
// headings/tables scale along). "md" is the historical default (1.0625rem).
const READER_SIZES = ["sm", "md", "lg"] as const;
type ReaderSize = (typeof READER_SIZES)[number];
const READER_SIZE_KEY = "reed-reader-size";
const READER_SIZE_CSS: Record<ReaderSize, string> = {
  sm: "0.9375rem",
  md: "1.0625rem",
  lg: "1.25rem",
};

function loadReaderSize(): ReaderSize {
  const stored = localStorage.getItem(READER_SIZE_KEY);
  return READER_SIZES.includes(stored as ReaderSize) ? (stored as ReaderSize) : "md";
}

// Single-line wrapper so the biome-ignore suppression stays adjacent to the
// dangerouslySetInnerHTML line even after biome format expands the reader
// markup around it.
function SanitizedBody({ html, fontSize }: { html: string; fontSize: string }) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: rendered via lib/render.ts, sanitized via DOMPurify (lib/sanitize.ts)
    <div className="article-body" style={{ fontSize }} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function ArticleReader({ article, feed, onBack, onMarkRead, wide = false }: Props) {
  const [readerSize, setReaderSize] = useState<ReaderSize>(loadReaderSize);

  const cycleReaderSize = () => {
    setReaderSize((current) => {
      const idx = READER_SIZES.indexOf(current);
      const next = READER_SIZES[(idx + 1) % READER_SIZES.length] ?? "md";
      localStorage.setItem(READER_SIZE_KEY, next);
      return next;
    });
  };

  const html = useMemo(() => {
    if (!article) return "";
    return renderArticleHtml(article.content ?? article.summary ?? "");
  }, [article]);

  const scrollRef = useRef<HTMLElement>(null);

  // reset scroll when a different article opens, else the reader keeps the
  // previous article's scroll offset and lands mid/end of the new one.
  // Keyed on id, not the object: the full-body refetch swap must not reset
  // scroll mid-read.
  // biome-ignore lint/correctness/useExhaustiveDependencies: id-keyed by design
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [article?.id]);

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
          onClick={cycleReaderSize}
          title={`Text size: ${readerSize}`}
          aria-label={`Text size: ${readerSize}`}
          className="flex items-center rounded-lg px-2.5 py-1.5 text-[13px] leading-none text-ink-2 transition-colors hover:bg-card hover:text-ink"
        >
          <span
            className={`font-medium ${readerSize === "sm" ? "text-[12px]" : readerSize === "lg" ? "text-[17px]" : "text-[14px]"}`}
          >
            Aa
          </span>
        </button>
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
      <article ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {/* 680px measure normally; 944px (680 + sidebar width) when the
            sidebar is collapsed so the freed width goes to the text */}
        <div
          className={`mx-auto px-6 pb-24 pt-4 transition-[max-width] duration-200 md:px-8 ${
            wide ? "max-w-[944px]" : "max-w-[680px]"
          }`}
        >
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
          <SanitizedBody html={html} fontSize={READER_SIZE_CSS[readerSize]} />
        </div>
      </article>
    </div>
  );
}
