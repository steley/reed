import type {
  Article,
  Feed,
  Folder,
  NewFeed,
  NewFolder,
  RefreshResult,
  UpdateArticle,
  UpdateFeed,
  UpdateFolder,
} from "@reed/types";

/**
 * Base URL for API requests.
 * In production: same origin (Vercel serves the API and the SPA from one project).
 * In local dev: Vite proxies /api/* to scripts/dev.ts on :8787.
 */
const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }

  // 204 No Content — return undefined cast to T
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Feeds
// ---------------------------------------------------------------------------

export const feedsApi = {
  list(): Promise<Feed[]> {
    return request<Feed[]>("/feeds");
  },

  create(data: NewFeed): Promise<Feed> {
    return request<Feed>("/feeds", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return request<void>(`/feeds/${id}`, { method: "DELETE" });
  },

  refresh(id: string): Promise<RefreshResult> {
    return request<RefreshResult>(`/feeds/${id}/refresh`, { method: "POST" });
  },

  update(id: string, data: UpdateFeed): Promise<Feed> {
    return request<Feed>(`/feeds/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ---------------------------------------------------------------------------
// Folders
// ---------------------------------------------------------------------------

export const foldersApi = {
  list(): Promise<Folder[]> {
    return request<Folder[]>("/folders");
  },

  create(data: NewFolder): Promise<Folder> {
    return request<Folder>("/folders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  rename(id: string, data: UpdateFolder): Promise<Folder> {
    return request<Folder>(`/folders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return request<void>(`/folders/${id}`, { method: "DELETE" });
  },
};

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export const articlesApi = {
  list(opts?: { feedId?: string; folderId?: string; unread?: boolean }): Promise<Article[]> {
    const params = new URLSearchParams();
    if (opts?.feedId) params.set("feed_id", opts.feedId);
    if (opts?.folderId) params.set("folder_id", opts.folderId);
    if (opts?.unread) params.set("unread", "true");
    const qs = params.size > 0 ? `?${params.toString()}` : "";
    return request<Article[]>(`/articles${qs}`);
  },

  update(id: string, data: UpdateArticle): Promise<Article> {
    return request<Article>(`/articles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
