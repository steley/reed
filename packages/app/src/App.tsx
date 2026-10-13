import type { Article, ArticleListItem, Feed, Folder } from "@reed/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AddFeedDialog } from "./components/AddFeedDialog.tsx";
import { ArticleList } from "./components/ArticleList.tsx";
import { ArticleReader } from "./components/ArticleReader.tsx";
import { FeedSidebar } from "./components/FeedSidebar.tsx";
import { ImportOpmlDialog } from "./components/ImportOpmlDialog.tsx";
import { Landing } from "./components/Landing.tsx";
import { Login } from "./components/Login.tsx";
import { NameDialog } from "./components/NameDialog.tsx";
import {
  articlesApi,
  authApi,
  feedsApi,
  foldersApi,
  opmlApi,
  setOnUnauthorized,
} from "./lib/api.ts";
import { sortArticles } from "./lib/display.ts";

const THEME_KEY = "reed-theme";

// SWR list-cache key covers both filter states so toggling unread can't hit
// the other view's stale list
const cacheKey = (feedId: string | null, unreadOnly: boolean) =>
  `${feedId ?? "all"}:${unreadOnly ? "unread" : "all"}`;

export function App() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [addFeedOpen, setAddFeedOpen] = useState(false);
  const [importOpmlOpen, setImportOpmlOpen] = useState(false);
  // folderId null = create mode; set = rename mode, initial = current name
  const [folderDialog, setFolderDialog] = useState<{
    folderId: string | null;
    initial: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  // Desktop sidebar collapse, persisted. Mobile (drawer) ignores this.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("reed-sidebar") === "collapsed",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  // Server-side unread filter for the article list; default on
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");
  // null = session check in flight; false = show the login gate
  const [authed, setAuthed] = useState<boolean | null>(null);
  // Unauthenticated views are hash-routed: #/login shows the login form,
  // anything else shows the landing page. Back/forward works for free.
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Any 401 from any API call drops the app back to the login screen
  useEffect(() => {
    setOnUnauthorized(() => setAuthed(false));
    authApi
      .me()
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAuthed(false);
    }
  }, []);

  // Apply color-scheme to <html> — all tokens use light-dark()
  useEffect(() => {
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // Load feeds and folders on mount
  useEffect(() => {
    if (!authed) return;
    feedsApi.list().then(setFeeds).catch(console.error);
    foldersApi.list().then(setFolders).catch(console.error);
  }, [authed]);

  // Stale-while-revalidate cache of per-feed list responses (summaries only —
  // small). Key: feedId, "all" for the unfiltered view. Search responses are
  // never cached. A cache hit paints instantly while the fetch still runs and
  // swaps in the fresh list when it lands, so read-state can't go stale for
  // more than one round trip.
  const articlesCache = useRef(new Map<string, ArticleListItem[]>());

  const reloadArticles = useCallback(
    async (feedId: string | null, q?: string, signal?: AbortSignal) => {
      const query = q?.trim();
      const opts = {
        ...(feedId ? { feedId } : {}),
        ...(query ? { q: query } : {}),
        ...(unreadOnly ? { unread: true } : {}),
      };
      const list = await articlesApi.list(opts, signal);
      setArticles(list);
      if (!query) articlesCache.current.set(cacheKey(feedId, unreadOnly), list);
    },
    [unreadOnly],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const prevFeedId = useRef<string | null>(selectedFeedId);

  // Load articles when the selected feed or search query changes. Each effect
  // run aborts the previous in-flight request so a slow stale response can
  // never overwrite the newer one. A feed switch clears the list immediately
  // (with a loading indicator) so the old feed's cards never linger; a search
  // keystroke keeps the current list visible until the fresh response lands.
  useEffect(() => {
    const controller = new AbortController();
    const feedChanged = prevFeedId.current !== selectedFeedId;
    prevFeedId.current = selectedFeedId;
    setSelectedArticleId(null);
    // Cache hit: paint the last known list now (no spinner); the fetch below
    // still runs and replaces the view when the fresh response lands. No hit
    // on a feed switch → clear the list so the spinner shows instead.
    const cached = searchQuery.trim()
      ? undefined
      : articlesCache.current.get(cacheKey(selectedFeedId, unreadOnly));
    if (feedChanged || cached) setArticles(cached ?? []);
    setIsLoadingArticles(!cached);
    reloadArticles(selectedFeedId, searchQuery, controller.signal)
      .catch((err: unknown) => {
        if ((err as Error).name !== "AbortError") console.error(err);
      })
      .finally(() => {
        // Skip on abort — the newer effect run owns the flag now
        if (!controller.signal.aborted) setIsLoadingArticles(false);
      });
    return () => controller.abort();
  }, [selectedFeedId, searchQuery, unreadOnly, reloadArticles]);

  // All unread articles across every feed — single source of truth for the
  // sidebar badges. Derived from the view-scoped `articles` list instead and
  // the badges vanish the moment a feed filter narrows that list.
  const [unreadList, setUnreadList] = useState<ArticleListItem[]>([]);
  const reloadUnread = useCallback(async () => {
    try {
      setUnreadList(await articlesApi.list({ unread: true }));
    } catch {
      /* non-critical */
    }
  }, []);
  useEffect(() => {
    if (authed) reloadUnread();
  }, [authed, reloadUnread]);

  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const article of unreadList) {
      counts[article.feedId] = (counts[article.feedId] ?? 0) + 1;
    }
    return counts;
  }, [unreadList]);
  const totalUnread = unreadList.length;

  // Newest unread article time per feed — drives "updated feeds float up" in the sidebar
  const feedRecency = useMemo(() => {
    const recency: Record<string, number> = {};
    for (const article of unreadList) {
      const at = article.publishedAt ?? article.createdAt;
      if (at > (recency[article.feedId] ?? 0)) recency[article.feedId] = at;
    }
    return recency;
  }, [unreadList]);

  const selectedFeed = feeds.find((f) => f.id === selectedFeedId) ?? null;

  // List rows omit `content` — fetch the full article when one is opened.
  // Title/summary render immediately from the list row; the body swaps to the
  // full content when the fetch lands. Bodies are immutable per article, so
  // they cache without invalidation (read-state staleness is invisible — the
  // reader doesn't display it).
  const [fullArticle, setFullArticle] = useState<Article | null>(null);
  const fullCache = useRef(new Map<string, Article>());
  useEffect(() => {
    if (!selectedArticleId) {
      setFullArticle(null);
      return;
    }
    // Reset first — never show the previously opened article's body here
    const cached = fullCache.current.get(selectedArticleId) ?? null;
    setFullArticle(cached);
    if (cached) return;
    let cancelled = false;
    articlesApi
      .get(selectedArticleId)
      .then((a) => {
        // ponytail: cap at 50 full bodies (~MBs); LRU-evict if sessions grow
        if (fullCache.current.size >= 50) {
          const oldest = fullCache.current.keys().next().value;
          if (oldest !== undefined) fullCache.current.delete(oldest);
        }
        fullCache.current.set(selectedArticleId, a);
        if (!cancelled) setFullArticle(a);
      })
      .catch((err: unknown) => {
        if (!cancelled) console.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedArticleId]);

  const selectedSummary = articles.find((a) => a.id === selectedArticleId) ?? null;
  const selectedArticle: Article | null =
    fullArticle ?? (selectedSummary ? { ...selectedSummary, content: null } : null);
  const selectedArticleFeed = selectedArticle
    ? (feeds.find((f) => f.id === selectedArticle.feedId) ?? null)
    : null;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const targets = selectedFeedId ? [selectedFeedId] : feeds.map((f) => f.id);
      await Promise.allSettled(targets.map((id) => feedsApi.refresh(id)));
      await Promise.all([reloadArticles(selectedFeedId, searchQuery), reloadUnread()]);
      setFeeds(await feedsApi.list());
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [feeds, selectedFeedId, searchQuery, reloadArticles, reloadUnread]);

  // Mark all (or all in the selected feed) as read; refreshes both the view
  // list and the sidebar unread badges
  const handleMarkAllRead = useCallback(async () => {
    try {
      await articlesApi.readAll(selectedFeedId ?? undefined);
      await Promise.all([reloadArticles(selectedFeedId, searchQuery), reloadUnread()]);
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  }, [selectedFeedId, searchQuery, reloadArticles, reloadUnread]);

  const handleAddFeed = useCallback(
    async (url: string) => {
      const feed = await feedsApi.create({ url });
      setFeeds((prev) => [...prev, feed]);
      try {
        await feedsApi.refresh(feed.id);
      } catch (err) {
        console.error("Initial refresh failed:", err);
      }
      setFeeds(await feedsApi.list());
      setSelectedFeedId(feed.id);
      await reloadArticles(feed.id);
      await reloadUnread();
    },
    [reloadArticles, reloadUnread],
  );

  const handleDeleteFeed = useCallback(
    async (id: string) => {
      try {
        await feedsApi.delete(id);
        setFeeds((prev) => prev.filter((f) => f.id !== id));
        if (selectedFeedId === id) {
          setSelectedFeedId(null);
          setSelectedArticleId(null);
        }
        // The deleted feed's articles must leave the current view too
        await reloadArticles(selectedFeedId, searchQuery);
        await reloadUnread();
      } catch (err) {
        console.error("Delete feed failed:", err);
      }
    },
    [selectedFeedId, searchQuery, reloadArticles, reloadUnread],
  );

  const handleMarkRead = useCallback(async (id: string, read: boolean) => {
    try {
      const updated = await articlesApi.update(id, { read });
      const mark = (list: ArticleListItem[]) => list.map((a) => (a.id === id ? updated : a));
      setArticles(mark);
      // Any cached view containing this article gets the update — the key
      // set depends on the unread filter, so don't guess it
      for (const key of articlesCache.current.keys()) {
        const entry = articlesCache.current.get(key);
        if (entry?.some((a) => a.id === id)) articlesCache.current.set(key, mark(entry));
      }
      setUnreadList((prev) =>
        read
          ? prev.filter((a) => a.id !== id)
          : prev.some((a) => a.id === id)
            ? prev
            : [...prev, updated],
      );
    } catch (err) {
      // Auto-mark-read on selection must never throw an unhandled rejection;
      // state simply stays as-is until the next reload
      console.error("Mark read failed:", err);
    }
  }, []);

  const handleSelectArticle = useCallback(
    async (id: string) => {
      setSelectedArticleId(id);
      setSidebarOpen(false);
      const article = articles.find((a) => a.id === id);
      if (article && article.read === 0) {
        await handleMarkRead(id, true);
      }
    },
    [articles, handleMarkRead],
  );

  const handleSelectFeed = useCallback((id: string | null) => {
    setSelectedFeedId(id);
    setSidebarOpen(false);
  }, []);

  // Sidebar toggle from the list header: collapses/restores the sidebar on
  // desktop, opens the mobile drawer below md. Collapse state persists.
  const handleToggleSidebar = useCallback(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setSidebarCollapsed((c) => {
        const next = !c;
        localStorage.setItem("reed-sidebar", next ? "collapsed" : "open");
        return next;
      });
    } else {
      setSidebarOpen(true);
    }
  }, []);

  // Keyboard shortcuts, all skipped while typing or when a dialog is open:
  // - j / ArrowDown = next article, k / ArrowUp = previous, walking the exact
  //   visible list order (sortArticles). No j/k on the sidebar — articles
  //   only, per j/k reader convention.
  // - v = open the selected article's original page in a new tab.
  // - r = refresh the current view (same as the toolbar button).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key !== "j" &&
        e.key !== "k" &&
        e.key !== "ArrowDown" &&
        e.key !== "ArrowUp" &&
        e.key !== "v" &&
        e.key !== "r"
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (addFeedOpen || importOpmlOpen || folderDialog) return;
      if (e.key === "v") {
        if (selectedArticle?.url) {
          window.open(selectedArticle.url, "_blank", "noopener");
        }
        return;
      }
      if (e.key === "r") {
        void handleRefresh();
        return;
      }
      const sorted = sortArticles(articles, sortAsc);
      const idx = sorted.findIndex((a) => a.id === selectedArticleId);
      // Nothing selected yet: j starts at the top, k at the bottom
      const next =
        idx === -1
          ? e.key === "j" || e.key === "ArrowDown"
            ? sorted[0]
            : sorted.at(-1)
          : e.key === "j" || e.key === "ArrowDown"
            ? sorted[idx + 1]
            : sorted[idx - 1];
      if (next) handleSelectArticle(next.id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    articles,
    selectedArticleId,
    selectedArticle,
    sortAsc,
    addFeedOpen,
    importOpmlOpen,
    folderDialog,
    handleSelectArticle,
    handleRefresh,
  ]);

  const handleAddFolder = useCallback(async (name: string) => {
    const folder = await foldersApi.create({ name });
    setFolders((prev) => [...prev, folder]);
  }, []);

  const handleRenameFolder = useCallback(async (id: string, name: string) => {
    const updated = await foldersApi.rename(id, { name });
    setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
  }, []);

  const handleDeleteFolder = useCallback(async (id: string) => {
    try {
      await foldersApi.delete(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
      // Feeds survive; move them back to uncategorized in local state
      setFeeds((prev) => prev.map((f) => (f.folderId === id ? { ...f, folderId: null } : f)));
    } catch (err) {
      console.error("Delete folder failed:", err);
    }
  }, []);

  const handleMoveFeed = useCallback(
    async (feedId: string, folderId: string | null) => {
      const feed = feeds.find((f) => f.id === feedId);
      if (!feed || feed.folderId === folderId) return;
      try {
        const updated = await feedsApi.update(feedId, { folderId });
        setFeeds((prev) => prev.map((f) => (f.id === feedId ? updated : f)));
      } catch (err) {
        console.error("Move feed failed:", err);
      }
    },
    [feeds],
  );

  const handleImportOpml = useCallback(async (text: string) => {
    const result = await opmlApi.import(text);
    // Pick up the new feeds/folders (and folder assignment for skipped feeds,
    // which is deliberately untouched server-side — a full reload is simplest)
    const [feedList, folderList] = await Promise.all([feedsApi.list(), foldersApi.list()]);
    setFeeds(feedList);
    setFolders(folderList);
    return result;
  }, []);

  if (authed === null) return null;
  if (!authed) {
    return route === "#/login" ? <Login onAuthed={() => setAuthed(true)} /> : <Landing />;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas text-ink">
      <FeedSidebar
        feeds={feeds}
        folders={folders}
        selectedFeedId={selectedFeedId}
        unreadCounts={unreadCounts}
        feedRecency={feedRecency}
        totalUnread={totalUnread}
        isDark={isDark}
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onSelectFeed={handleSelectFeed}
        onAddFeed={() => setAddFeedOpen(true)}
        onAddFolder={() => setFolderDialog({ folderId: null, initial: "" })}
        onImportOpml={() => setImportOpmlOpen(true)}
        onSignOut={handleSignOut}
        onRenameFolder={(id) =>
          setFolderDialog({
            folderId: id,
            initial: folders.find((f) => f.id === id)?.name ?? "",
          })
        }
        onDeleteFolder={handleDeleteFolder}
        onMoveFeed={handleMoveFeed}
        onToggleDark={() => setIsDark((d) => !d)}
        onDeleteFeed={handleDeleteFeed}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Article list — full width on mobile until an article is opened */}
      <div
        className={`min-w-0 flex-1 border-r border-line md:w-[380px] md:flex-none ${
          selectedArticle ? "hidden md:block" : "block"
        }`}
      >
        <ArticleList
          articles={articles}
          isLoading={isLoadingArticles}
          selectedArticleId={selectedArticleId}
          selectedFeed={selectedFeed}
          feedsById={Object.fromEntries(feeds.map((f) => [f.id, f]))}
          isRefreshing={isRefreshing}
          sortAsc={sortAsc}
          unreadOnly={unreadOnly}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={handleToggleSidebar}
          onSelectArticle={handleSelectArticle}
          onToggleSort={() => setSortAsc((s) => !s)}
          onToggleUnread={() => setUnreadOnly((u) => !u)}
          onMarkAllRead={handleMarkAllRead}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Reader — takes the rest; on mobile shown only when an article is open */}
      <div className={`min-w-0 flex-1 ${selectedArticle ? "block" : "hidden md:block"}`}>
        <ArticleReader
          article={selectedArticle}
          feed={selectedArticleFeed}
          onBack={() => setSelectedArticleId(null)}
          onMarkRead={handleMarkRead}
          wide={sidebarCollapsed}
        />
      </div>

      <AddFeedDialog open={addFeedOpen} onOpenChange={setAddFeedOpen} onAdd={handleAddFeed} />
      <ImportOpmlDialog
        open={importOpmlOpen}
        onOpenChange={setImportOpmlOpen}
        onImport={handleImportOpml}
      />
      <NameDialog
        open={folderDialog !== null}
        title={folderDialog?.folderId ? "Rename folder" : "New folder"}
        initial={folderDialog?.initial ?? ""}
        submitLabel={folderDialog?.folderId ? "Rename" : "Create"}
        onOpenChange={(o) => {
          if (!o) setFolderDialog(null);
        }}
        onSubmit={async (name) => {
          if (!folderDialog) return;
          if (folderDialog.folderId) {
            await handleRenameFolder(folderDialog.folderId, name);
          } else {
            await handleAddFolder(name);
          }
        }}
      />
    </div>
  );
}
