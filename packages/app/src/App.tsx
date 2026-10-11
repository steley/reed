import type { Article, Feed, Folder } from "@reed/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddFeedDialog } from "./components/AddFeedDialog.tsx";
import { ArticleList } from "./components/ArticleList.tsx";
import { ArticleReader } from "./components/ArticleReader.tsx";
import { FeedSidebar } from "./components/FeedSidebar.tsx";
import { ImportOpmlDialog } from "./components/ImportOpmlDialog.tsx";
import { NameDialog } from "./components/NameDialog.tsx";
import { articlesApi, feedsApi, foldersApi, opmlApi } from "./lib/api.ts";

const THEME_KEY = "reed-theme";

export function App() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

  // Apply color-scheme to <html> — all tokens use light-dark()
  useEffect(() => {
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // Load feeds and folders on mount
  useEffect(() => {
    feedsApi.list().then(setFeeds).catch(console.error);
    foldersApi.list().then(setFolders).catch(console.error);
  }, []);

  const reloadArticles = useCallback(async (feedId: string | null) => {
    const opts = feedId ? { feedId } : undefined;
    setArticles(await articlesApi.list(opts));
  }, []);

  // Load articles when the selected feed changes
  useEffect(() => {
    reloadArticles(selectedFeedId).catch(console.error);
    setSelectedArticleId(null);
  }, [selectedFeedId, reloadArticles]);

  // All unread articles across every feed — single source of truth for the
  // sidebar badges. Derived from the view-scoped `articles` list instead and
  // the badges vanish the moment a feed filter narrows that list.
  const [unreadList, setUnreadList] = useState<Article[]>([]);
  const reloadUnread = useCallback(async () => {
    try {
      setUnreadList(await articlesApi.list({ unread: true }));
    } catch {
      /* non-critical */
    }
  }, []);
  useEffect(() => {
    reloadUnread();
  }, [reloadUnread]);

  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const article of unreadList) {
      counts[article.feedId] = (counts[article.feedId] ?? 0) + 1;
    }
    return counts;
  }, [unreadList]);
  const totalUnread = unreadList.length;

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
      await Promise.all([reloadArticles(selectedFeedId), reloadUnread()]);
      setFeeds(await feedsApi.list());
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [feeds, selectedFeedId, reloadArticles, reloadUnread]);

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
      await feedsApi.delete(id);
      setFeeds((prev) => prev.filter((f) => f.id !== id));
      if (selectedFeedId === id) {
        setSelectedFeedId(null);
        setSelectedArticleId(null);
      }
      await reloadUnread();
    },
    [selectedFeedId, reloadUnread],
  );

  const handleMarkRead = useCallback(async (id: string, read: boolean) => {
    const updated = await articlesApi.update(id, { read });
    setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
    setUnreadList((prev) =>
      read
        ? prev.filter((a) => a.id !== id)
        : prev.some((a) => a.id === id)
          ? prev
          : [...prev, updated],
    );
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

  const handleAddFolder = useCallback(async (name: string) => {
    const folder = await foldersApi.create({ name });
    setFolders((prev) => [...prev, folder]);
  }, []);

  const handleRenameFolder = useCallback(async (id: string, name: string) => {
    const updated = await foldersApi.rename(id, { name });
    setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
  }, []);

  const handleDeleteFolder = useCallback(async (id: string) => {
    await foldersApi.delete(id);
    setFolders((prev) => prev.filter((f) => f.id !== id));
    // Feeds survive; move them back to uncategorized in local state
    setFeeds((prev) => prev.map((f) => (f.folderId === id ? { ...f, folderId: null } : f)));
  }, []);

  const handleMoveFeed = useCallback(
    async (feedId: string, folderId: string | null) => {
      const feed = feeds.find((f) => f.id === feedId);
      if (!feed || feed.folderId === folderId) return;
      const updated = await feedsApi.update(feedId, { folderId });
      setFeeds((prev) => prev.map((f) => (f.id === feedId ? updated : f)));
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

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas text-ink">
      <FeedSidebar
        feeds={feeds}
        folders={folders}
        selectedFeedId={selectedFeedId}
        unreadCounts={unreadCounts}
        totalUnread={totalUnread}
        isDark={isDark}
        open={sidebarOpen}
        onSelectFeed={handleSelectFeed}
        onAddFeed={() => setAddFeedOpen(true)}
        onAddFolder={() => setFolderDialog({ folderId: null, initial: "" })}
        onImportOpml={() => setImportOpmlOpen(true)}
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
