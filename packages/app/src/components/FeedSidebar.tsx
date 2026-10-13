import { useEffect, useMemo, useRef, useState } from "react";
import type { Feed, Folder } from "@reed/types";
import { avatarColor, compareNames, feedDisplayName } from "../lib/display.ts";
import {
  ChevronRight,
  Ellipsis,
  Folder as FolderIcon,
  FolderPlus,
  Moon,
  Plus,
  ReedMark,
  Sun,
  Trash,
} from "./icons.tsx";

interface Props {
  feeds: Feed[];
  folders: Folder[];
  selectedFeedId: string | null;
  unreadCounts: Record<string, number>;
  feedRecency: Record<string, number>;
  totalUnread: number;
  isDark: boolean;
  open: boolean; // mobile drawer state; always visible on desktop
  collapsed: boolean; // desktop collapse state; hidden on md+ when true
  onSelectFeed(id: string | null): void;
  onAddFeed(): void;
  onAddFolder(): void;
  onImportOpml(): void;
  onSignOut(): void;
  onRenameFolder(id: string): void;
  onDeleteFolder(id: string): void;
  onMoveFeed(feedId: string, folderId: string | null): void;
  onToggleDark(): void;
  onDeleteFeed(id: string): void;
  onClose(): void; // close mobile drawer
}

function Avatar({ feed }: { feed: Feed }) {
  // Site icon when grabbable (feed <image>, else siteUrl /favicon.ico);
  // letter avatar on error or when neither exists
  const [failed, setFailed] = useState(false);
  const seed = feed.title ?? feed.url;
  const { bg, fg } = avatarColor(seed);
  const name = feedDisplayName({ title: feed.title, url: feed.url });
  let icon = feed.imageUrl;
  if (!icon && feed.siteUrl) {
    try {
      icon = new URL("/favicon.ico", feed.siteUrl).href;
    } catch {
      icon = null;
    }
  }
  if (icon && !failed) {
    return (
      <img
        src={icon}
        alt=""
        aria-hidden
        className="size-5 shrink-0 rounded bg-canvas object-contain"
        onError={() => setFailed(true)}
      />
    );
  }
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

/** Sidebar row for one feed. Draggable into a folder; drop zones live on folder rows. */
function FeedRow({
  feed,
  name,
  unread,
  selected,
  indented,
  onSelect,
  onDelete,
  onContext,
}: {
  feed: Feed;
  name: string;
  unread: number;
  selected: boolean;
  indented: boolean;
  onSelect(): void;
  onDelete(): void;
  onContext(x: number, y: number): void;
}) {
  // Long-press opens the context menu on touch (desktop uses right-click)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearPress = () => clearTimeout(pressTimer.current);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: drag + context menu handle only; the interactive controls are the child buttons
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", feed.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onContext(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const { clientX: x, clientY: y } = touch;
        pressTimer.current = setTimeout(() => onContext(x, y), 500);
      }}
      onTouchMove={clearPress}
      onTouchEnd={clearPress}
      onTouchCancel={clearPress}
      className={`group flex select-none items-center rounded-lg pr-1.5 transition-colors ${
        indented ? "ml-6" : ""
      } ${selected ? "bg-card" : "hover:bg-card/60"}`}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 text-left text-sm ${
          selected ? "text-ink" : "text-ink-2 hover:text-ink"
        }`}
      >
        <Avatar feed={feed} />
        <span className="truncate">{name}</span>
        {feed.lastError ? (
          // Refresh-failure marker; hover for the message (same text as the cron log)
          <span title={feed.lastError} className="size-1.5 shrink-0 rounded-full bg-danger" />
        ) : null}
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
            onDelete();
          }
        }}
        className="ml-1 hidden rounded p-1 text-ink-3 hover:text-accent group-hover:block"
      >
        <Trash width={13} height={13} />
      </button>
    </div>
  );
}

const UNCATEGORIZED = "__uncategorized__";

export function FeedSidebar({
  feeds,
  folders,
  selectedFeedId,
  unreadCounts,
  feedRecency,
  totalUnread,
  isDark,
  open,
  collapsed,
  onSelectFeed,
  onAddFeed,
  onAddFolder,
  onImportOpml,
  onSignOut,
  onRenameFolder,
  onDeleteFolder,
  onMoveFeed,
  onToggleDark,
  onDeleteFeed,
  onClose,
}: Props) {
  // Right-click / long-press context menu target + viewport x/y.
  // Folders get rename/delete; feeds get move-to-folder/delete.
  type MenuState =
    | { kind: "folder"; folderId: string; x: number; y: number }
    | { kind: "feed"; feedId: string; x: number; y: number };
  const [menu, setMenu] = useState<MenuState | null>(null);
  // Overflow menu (OPML import/export) anchored at its opening click
  const [opmlMenu, setOpmlMenu] = useState<{ x: number; y: number } | null>(null);
  // Folder id (or UNCATEGORIZED) currently highlighted as a drop target
  const [dragOver, setDragOver] = useState<string | null>(null);
  // Manual expand/collapse choices; unset folders fall back to the auto rule
  const [expandOverride, setExpandOverride] = useState<Record<string, boolean>>({});

  // Auto-ascending order: folders and feeds both sort by display name
  const sortedFolders = useMemo(
    () => [...folders].sort((a, b) => compareNames(a.name, b.name)),
    [folders],
  );
  // Feeds with unread updates float up (newest first), the rest stay name-ordered
  const sortedFeeds = useMemo(
    () =>
      [...feeds].sort((a, b) => {
        const ra = feedRecency[a.id] ?? 0;
        const rb = feedRecency[b.id] ?? 0;
        if (ra !== rb) return rb - ra;
        return compareNames(feedDisplayName(a), feedDisplayName(b));
      }),
    [feeds, feedRecency],
  );

  useEffect(() => {
    if (!menu && !opmlMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setOpmlMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, opmlMenu]);

  const folderUnread = (folderId: string) =>
    sortedFeeds
      .filter((f) => f.folderId === folderId)
      .reduce((sum, f) => sum + (unreadCounts[f.id] ?? 0), 0);

  // Collapsed by default; auto-expanded while the folder has unread articles
  // or contains the selected feed (so the active row never hides itself)
  const isExpanded = (folderId: string) => {
    const override = expandOverride[folderId];
    if (override !== undefined) return override;
    if (folderUnread(folderId) > 0) return true;
    return sortedFeeds.some((f) => f.folderId === folderId && f.id === selectedFeedId);
  };

  const toggleFolder = (folderId: string) => {
    const wasExpanded = isExpanded(folderId);
    setExpandOverride((prev) => ({ ...prev, [folderId]: !wasExpanded }));
    // Collapsing would hide the selected feed inside — deselect it first
    if (
      wasExpanded &&
      selectedFeedId &&
      sortedFeeds.some((f) => f.folderId === folderId && f.id === selectedFeedId)
    ) {
      onSelectFeed(null);
    }
  };

  const dropHandlers = (target: string, folderId: string | null) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOver(target);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDragOver((v) => (v === target ? null : v));
      }
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(null);
      const feedId = e.dataTransfer.getData("text/plain");
      if (feedId) onMoveFeed(feedId, folderId);
    },
  });

  const renderFeed = (feed: Feed, indented: boolean) => {
    const name = feedDisplayName(feed);
    return (
      <li key={feed.id}>
        <FeedRow
          feed={feed}
          name={name}
          unread={unreadCounts[feed.id] ?? 0}
          selected={feed.id === selectedFeedId}
          indented={indented}
          onSelect={() => onSelectFeed(feed.id)}
          onDelete={() => onDeleteFeed(feed.id)}
          onContext={(x, y) => setMenu({ kind: "feed", feedId: feed.id, x, y })}
        />
      </li>
    );
  };

  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-line bg-panel transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:hidden" : ""}`}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-2 px-5 pb-4 pt-5">
          <ReedMark width={22} height={22} />
          <span className="text-[15px] font-semibold tracking-tight">Reed</span>
          <button
            type="button"
            aria-label="Import / export subscriptions"
            onClick={(e) => setOpmlMenu({ x: e.clientX, y: e.clientY })}
            className="ml-auto rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-card hover:text-ink"
          >
            <Ellipsis width={15} height={15} />
          </button>
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

          {/* Folders */}
          {sortedFolders.length > 0 && (
            <>
              <div className="px-3 pb-1 pt-5 text-[11px] font-medium tracking-widest text-ink-3 uppercase">
                Folders
              </div>
              <ul className="space-y-0.5">
                {sortedFolders.map((folder) => {
                  const expanded = isExpanded(folder.id);
                  const unread = folderUnread(folder.id);
                  const highlighted = dragOver === folder.id;
                  return (
                    <li key={folder.id}>
                      {/* biome-ignore lint/a11y/noStaticElementInteractions: context menu + drop target; click/keyboard live on the child button */}
                      <div
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setMenu({
                            kind: "folder",
                            folderId: folder.id,
                            x: e.clientX,
                            y: e.clientY,
                          });
                        }}
                        {...dropHandlers(folder.id, folder.id)}
                        className={`group flex select-none items-center rounded-lg pr-1.5 transition-colors ${
                          highlighted ? "bg-card ring-1 ring-accent" : "hover:bg-card/60"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFolder(folder.id)}
                          aria-expanded={expanded}
                          className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 text-left text-sm text-ink-2 hover:text-ink"
                        >
                          <ChevronRight
                            width={12}
                            height={12}
                            className={`shrink-0 text-ink-3 transition-transform ${
                              expanded ? "rotate-90" : ""
                            }`}
                          />
                          <FolderIcon width={14} height={14} className="shrink-0 text-ink-3" />
                          <span className="truncate">{folder.name}</span>
                        </button>
                        {unread > 0 ? (
                          <span className="min-w-4 text-right text-xs font-medium text-accent tabular-nums">
                            {unread}
                          </span>
                        ) : null}
                      </div>
                      {expanded &&
                        sortedFeeds
                          .filter((f) => f.folderId === folder.id)
                          .map((feed) => renderFeed(feed, true))}
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {/* Uncategorized feeds — drop target for moving a feed out of a folder */}
          <div
            {...dropHandlers(UNCATEGORIZED, null)}
            className={`rounded-lg ${dragOver === UNCATEGORIZED ? "bg-card/50" : ""}`}
          >
            <div className="px-3 pb-1 pt-5 text-[11px] font-medium tracking-widest text-ink-3 uppercase">
              Feeds
            </div>
            <ul className="space-y-0.5">
              {sortedFeeds
                .filter((f) => f.folderId === null)
                .map((feed) => renderFeed(feed, false))}
            </ul>
          </div>
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
            onClick={onAddFolder}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-2 transition-colors hover:bg-card/60 hover:text-ink"
          >
            <FolderPlus width={15} height={15} />
            New folder
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

      {/* Context menus (outside <aside>: fixed positioning would be
          contained by the aside's transform on mobile) */}
      {menu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setMenu(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenu(null);
            }}
            aria-hidden
          />
          {menu.kind === "folder" ? (
            <div
              role="menu"
              className="fixed z-50 min-w-32 rounded-lg border border-line bg-canvas py-1 shadow-xl"
              style={{
                left: Math.max(8, Math.min(menu.x, window.innerWidth - 150)),
                top: Math.max(8, Math.min(menu.y, window.innerHeight - 90)),
              }}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  const { folderId } = menu;
                  setMenu(null);
                  onRenameFolder(folderId);
                }}
                className="block w-full px-3 py-1.5 text-left text-[13px] text-ink-2 hover:bg-card hover:text-ink"
              >
                Rename
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  const { folderId } = menu;
                  setMenu(null);
                  const folder = folders.find((f) => f.id === folderId);
                  if (
                    folder &&
                    window.confirm(
                      `Delete folder "${folder.name}"? Feeds inside will not be deleted.`,
                    )
                  ) {
                    onDeleteFolder(folderId);
                  }
                }}
                className="block w-full px-3 py-1.5 text-left text-[13px] text-ink-2 hover:bg-card hover:text-accent"
              >
                Delete
              </button>
            </div>
          ) : (
            (() => {
              const feed = feeds.find((f) => f.id === menu.feedId);
              if (!feed) return null;
              return (
                <div
                  role="menu"
                  className="fixed z-50 max-h-72 min-w-44 overflow-y-auto rounded-lg border border-line bg-canvas py-1 shadow-xl"
                  style={{
                    left: Math.max(8, Math.min(menu.x, window.innerWidth - 180)),
                    top: Math.max(8, Math.min(menu.y, window.innerHeight - 260)),
                  }}
                >
                  <p className="px-3 pb-1 pt-1.5 text-[11px] font-medium tracking-widest text-ink-3 uppercase">
                    Move to
                  </p>
                  {sortedFolders.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenu(null);
                        onMoveFeed(feed.id, folder.id);
                      }}
                      className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] text-ink-2 hover:bg-card hover:text-ink"
                    >
                      <span className="truncate">{folder.name}</span>
                      {feed.folderId === folder.id && (
                        <span aria-hidden className="text-ink-3">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenu(null);
                      onMoveFeed(feed.id, null);
                    }}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] text-ink-2 hover:bg-card hover:text-ink"
                  >
                    <span>Uncategorized</span>
                    {feed.folderId === null && (
                      <span aria-hidden className="text-ink-3">
                        ✓
                      </span>
                    )}
                  </button>
                  <div className="my-1 border-t border-line" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenu(null);
                      if (
                        window.confirm(`Delete "${feedDisplayName(feed)}" and all its articles?`)
                      ) {
                        onDeleteFeed(feed.id);
                      }
                    }}
                    className="block w-full px-3 py-1.5 text-left text-[13px] text-ink-2 hover:bg-card hover:text-accent"
                  >
                    Delete feed
                  </button>
                </div>
              );
            })()
          )}
        </>
      )}

      {/* Import/export menu (outside <aside> for the same fixed-position reason) */}
      {opmlMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpmlMenu(null)} aria-hidden />
          <div
            role="menu"
            className="fixed z-50 min-w-40 rounded-lg border border-line bg-canvas py-1 shadow-xl"
            style={{
              left: Math.max(8, Math.min(opmlMenu.x, window.innerWidth - 170)),
              top: Math.max(8, Math.min(opmlMenu.y, window.innerHeight - 100)),
            }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpmlMenu(null);
                onImportOpml();
              }}
              className="block w-full px-3 py-1.5 text-left text-[13px] text-ink-2 hover:bg-card hover:text-ink"
            >
              Import OPML…
            </button>
            <a
              role="menuitem"
              href="/api/opml"
              onClick={() => setOpmlMenu(null)}
              className="block w-full px-3 py-1.5 text-left text-[13px] text-ink-2 hover:bg-card hover:text-ink"
            >
              Export OPML
            </a>
            <div className="my-1 border-t border-line" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpmlMenu(null);
                onSignOut();
              }}
              className="block w-full px-3 py-1.5 text-left text-[13px] text-ink-2 hover:bg-card hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </>
  );
}
