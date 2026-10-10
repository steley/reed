import type { Article, Feed, NewFeed, RefreshResult, UpdateArticle } from "@reed/types";

/**
 * Base URL for API requests.
 * In production: same origin (worker serves both API and assets).
 * In local dev: Vite proxies /api/* to the wrangler dev server.
 */
const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, (body as { error?: string }).error ?? res.statusText);
  }

  // 204 No Content — return undefined cast to T
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
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
};

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export const articlesApi = {
  list(opts?: { feedId?: string; unread?: boolean }): Promise<Article[]> {
    const params = new URLSearchParams();
    if (opts?.feedId) params.set("feed_id", opts.feedId);
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
