import type { Feed } from "@reed/types";
import { avatarColor, feedDisplayName } from "../lib/display.ts";
import { Moon, Plus, ReedMark, Sun, Trash } from "./icons.tsx";

interface Props {
  feeds: Feed[];
  selectedFeedId: string | null;
  unreadCounts: Record<string, number>;
  totalUnread: number;
  isDark: boolean;
  open: boolean; // mobile drawer state; always visible on desktop
  onSelectFeed(id: string | null): void;
  onAddFeed(): void;
  onToggleDark(): void;
  onDeleteFeed(id: string): void;
  onClose(): void; // close mobile drawer
}

function Avatar({ seed }: { seed: string }) {
  const { bg, fg } = avatarColor(seed);
  const name = feedDisplayName({ title: seed, url: "" });
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
      style={{ backgroundColor: bg, color: fg }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export function FeedSidebar({
  feeds,
  selectedFeedId,
  unreadCounts,
  totalUnread,
  isDark,
  open,
  onSelectFeed,
  onAddFeed,
  onToggleDark,
  onDeleteFeed,
  onClose,
}: Props) {
  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-line bg-panel transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-2 px-5 pb-4 pt-5">
          <ReedMark width={22} height={22} />
          <span className="text-[15px] font-semibold tracking-tight">Reed</span>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3">
          {/* All articles */}
          <button
            type="button"
            onClick={() => onSelectFeed(null)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              selectedFeedId === null
                ? "bg-card font-medium text-ink"
                : "text-ink-2 hover:bg-card/60 hover:text-ink"
            }`}
          >
            <span>All articles</span>
            {totalUnread > 0 && (
              <span className="text-xs font-medium text-accent tabular-nums">{totalUnread}</span>
            )}
          </button>

          <div className="px-3 pb-1 pt-5 text-[11px] font-medium tracking-widest text-ink-3 uppercase">
            Feeds
          </div>

          <ul className="space-y-0.5">
            {feeds.map((feed) => {
              const selected = feed.id === selectedFeedId;
              const unread = unreadCounts[feed.id] ?? 0;
              const name = feedDisplayName(feed);
              return (
                <li key={feed.id}>
                  <div
                    className={`group flex items-center rounded-lg pr-1.5 transition-colors ${
                      selected ? "bg-card" : "hover:bg-card/60"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectFeed(feed.id)}
                      className={`flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 text-left text-sm ${
                        selected ? "text-ink" : "text-ink-2 hover:text-ink"
                      }`}
                    >
                      <Avatar seed={feed.title ?? feed.url} />
                      <span className="truncate">{name}</span>
                    </button>
                    {unread > 0 ? (
                      <span className="min-w-4 text-right text-xs font-medium text-accent tabular-nums">
                        {unread}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      aria-label={`Delete ${name}`}
                      onClick={() => {
                        if (window.confirm(`Delete "${name}" and all its articles?`)) {
                          onDeleteFeed(feed.id);
                        }
                      }}
                      className="ml-1 hidden rounded p-1 text-ink-3 hover:text-accent group-hover:block"
                    >
                      <Trash width={13} height={13} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="border-t border-line px-3 py-3">
          <button
            type="button"
            onClick={onAddFeed}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-2 transition-colors hover:bg-card/60 hover:text-ink"
          >
            <Plus width={15} height={15} />
            Add feed
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-2 transition-colors hover:bg-card/60 hover:text-ink"
          >
            {isDark ? <Sun width={15} height={15} /> : <Moon width={15} height={15} />}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>
    </>
  );
}
