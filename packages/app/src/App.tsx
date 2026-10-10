import type { Article, Feed } from "@reed/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddFeedDialog } from "./components/AddFeedDialog.tsx";
import { ArticleList } from "./components/ArticleList.tsx";
import { ArticleReader } from "./components/ArticleReader.tsx";
import { FeedSidebar } from "./components/FeedSidebar.tsx";
import { articlesApi, feedsApi } from "./lib/api.ts";

const THEME_KEY = "reed-theme";

export function App() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [addFeedOpen, setAddFeedOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

  // Apply color-scheme to <html> — all tokens use light-dark()
  useEffect(() => {
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // Load feeds on mount
  useEffect(() => {
    feedsApi.list().then(setFeeds).catch(console.error);
  }, []);

  // Load articles when selected feed changes
  useEffect(() => {
    const opts = selectedFeedId ? { feedId: selectedFeedId } : undefined;
    articlesApi.list(opts).then(setArticles).catch(console.error);
    setSelectedArticleId(null);
  }, [selectedFeedId]);

  const reloadArticles = useCallback(async (feedId: string | null) => {
    const opts = feedId ? { feedId } : undefined;
    setArticles(await articlesApi.list(opts));
  }, []);

  // Unread counts per feed (from the currently loaded list; total from all feeds)
  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const article of articles) {
      if (article.read === 0) {
        counts[article.feedId] = (counts[article.feedId] ?? 0) + 1;
      }
    }
    return counts;
  }, [articles]);

  // Global unread: fetch once and after refreshes (cheap enough for single user)
  const [totalUnread, setTotalUnread] = useState(0);
  const reloadTotalUnread = useCallback(async () => {
    try {
      const unread = await articlesApi.list({ unread: true });
      setTotalUnread(unread.length);
    } catch {
      /* non-critical */
    }
  }, []);
  useEffect(() => {
    reloadTotalUnread();
  }, [reloadTotalUnread]);

  const selectedFeed = feeds.find((f) => f.id === selectedFeedId) ?? null;
  const selectedArticle = articles.find((a) => a.id === selectedArticleId) ?? null;
  const selectedArticleFeed = selectedArticle
    ? (feeds.find((f) => f.id === selectedArticle.feedId) ?? null)
    : null;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const targets = selectedFeedId ? [selectedFeedId] : feeds.map((f) => f.id);
      await Promise.allSettled(targets.map((id) => feedsApi.refresh(id)));
      await Promise.all([reloadArticles(selectedFeedId), reloadTotalUnread()]);
      setFeeds(await feedsApi.list());
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [feeds, selectedFeedId, reloadArticles, reloadTotalUnread]);

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
      await reloadTotalUnread();
    },
    [reloadArticles, reloadTotalUnread],
  );

  const handleDeleteFeed = useCallback(
    async (id: string) => {
      await feedsApi.delete(id);
      setFeeds((prev) => prev.filter((f) => f.id !== id));
      if (selectedFeedId === id) {
        setSelectedFeedId(null);
        setSelectedArticleId(null);
      }
      await reloadTotalUnread();
    },
    [selectedFeedId, reloadTotalUnread],
  );

  const handleMarkRead = useCallback(async (id: string, read: boolean) => {
    const updated = await articlesApi.update(id, { read });
    setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
    setTotalUnread((prev) => Math.max(0, prev + (read ? -1 : 1)));
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

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas text-ink">
      <FeedSidebar
        feeds={feeds}
        selectedFeedId={selectedFeedId}
        unreadCounts={unreadCounts}
        totalUnread={totalUnread}
        isDark={isDark}
        open={sidebarOpen}
        onSelectFeed={handleSelectFeed}
        onAddFeed={() => setAddFeedOpen(true)}
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
          selectedArticleId={selectedArticleId}
          selectedFeed={selectedFeed}
          feedsById={Object.fromEntries(feeds.map((f) => [f.id, f]))}
          isRefreshing={isRefreshing}
          sortAsc={sortAsc}
          onOpenMenu={() => setSidebarOpen(true)}
          onSelectArticle={handleSelectArticle}
          onToggleSort={() => setSortAsc((s) => !s)}
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
        />
      </div>

      <AddFeedDialog open={addFeedOpen} onOpenChange={setAddFeedOpen} onAdd={handleAddFeed} />
    </div>
  );
}
