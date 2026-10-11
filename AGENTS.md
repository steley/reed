# Reed — Agent Guide

Personal RSS reader built on Vercel (Hono API), Neon (PostgreSQL), and
GitHub Actions for scheduled feed refresh. This document is the authoritative
reference for any agent or contributor working in this repository.
Read it fully before making changes.

---

## Agent Rules

These rules are mandatory. Follow them on every task without exception.

1. **Update `WORKLOG.md` before every commit.** Every commit must have a
   corresponding worklog entry documenting what was built, decisions made,
   options considered and discarded, and any dead ends or gotchas. Do not
   commit code without updating the worklog first.

2. **Update `AGENTS.md` before every commit** if the task introduced new
   conventions, stack changes, architectural decisions, or anything a future
   agent would need to know to work in this codebase. When in doubt, add it.

3. **Never commit without running the pre-commit checks.** The hook runs
   lint → type-check → tests. All three must pass. If tests fail, fix them
   before committing — do not skip with `--no-verify`.

4. **Read `WORKLOG.md` before starting any task.** It contains decisions
   already made and dead ends already explored. Do not re-litigate settled
   decisions without a good reason.

5. **Never commit private infrastructure identifiers.** This repo is public.
   Do not write real production hostnames, domains, IPs, or account IDs into
   any git-tracked file (including WORKLOG.md history entries and commit
   messages). Refer to them as "the production domain" or use a placeholder.
   Real values live in env vars / deploy config only.

---

## What This Is

A self-hosted RSS reader with:
- A REST API backend (Hono on Node) served from Vercel serverless functions
- A Neon PostgreSQL database for feeds and articles, accessed via `@neondatabase/serverless` over HTTP (neon-http mode)
- Hourly feed refresh via GitHub Actions (`schedule` cron)
- A React frontend (Vite + Tailwind v4, hand-rolled components) served as static output by Vercel
- A CLI tool for terminal access to the API (phase 3)

This is a **personal application, now multi-user** (2026-10-11): every feed,
folder, and article is scoped to a `users` row and the API requires a session
(JWT cookie or `Authorization: Bearer`) — except `GET /api/health` and the
auth endpoints. Registration can be gated with an invite code via `SIGNUP_CODE`.

---

## Monorepo Structure

```
reed/
├── package.json              # Root: pnpm workspace config + root scripts
├── pnpm-workspace.yaml       # Declares packages/*
├── tsconfig.json             # Root: base TS config, extended by all packages
├── vercel.json               # Vercel build config + SPA fallback rewrites
├── api/                      # GENERATED serverless bundle (pnpm build:api) — do not edit
├── .github/workflows/        # refresh.yml — hourly feed refresh into Neon
├── AGENTS.md                 # This file
├── WORKLOG.md                # Increment-by-increment build log (agent memory)
└── packages/
    ├── types/                # @reed/types  — shared TS types
    ├── worker/               # @reed/worker — Hono API + Neon Postgres + refresh scripts
    ├── app/                  # @reed/app    — React frontend (phase 2)
    └── cli/                  # @reed/cli    — CLI tool (phase 3)
```

### Package purposes

| Package | Description |
|---------|-------------|
| `@reed/types` | Shared `Feed`, `Article`, `NewFeed`, `NewArticle` TypeScript interfaces. No runtime code — types only. Imported by worker, app, and cli. |
| `@reed/worker` | Owns the REST API (Hono), Neon/Postgres queries via Drizzle, RSS fetching/parsing, and the refresh scripts (`scripts/refresh.ts` for Actions, `scripts/dev.ts` for local dev). |
| `@reed/app` | React SPA built with Vite. Hand-rolled components + Tailwind v4. Built to `dist/` and served as static output by Vercel. |
| `@reed/cli` | Node.js CLI binary. Makes HTTP calls to the deployed REST API. Phase 3 — not yet scaffolded. |

---

## Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Vercel serverless functions (Node) | Deployed from the same repo; user's real-world testing shows Vercel + custom domain is faster from mainland China than Cloudflare |
| Database | Neon (PostgreSQL) | Serverless Postgres over HTTP (`@neondatabase/serverless`, neon-http: one stateless HTTPS request per query — no sockets, no pooling), identical from Vercel + GitHub Actions + local dev |
| ORM | Drizzle ORM + drizzle-kit | Type-safe queries, `postgresql` dialect for migrations |
| HTTP router | Hono | Lightweight, typed routing; `app.request()` enables clean unit tests; `hono/vercel` adapter for the serverless entry |
| RSS parsing | `fast-xml-parser` | Pure JS, no native deps, handles RSS 2.0 + Atom |
| Markdown rendering | `marked` | Converts markdown content to HTML for feeds that provide markdown bodies |
| Frontend | React 19 + Vite | Standard SPA setup |
| UI components | Hand-rolled + Tailwind v4 | Reeder-style minimal UI; no component library (removed 2026-10-10) |
| Scheduled refresh | GitHub Actions cron | Free for public/private repos, full Node runtime, no Vercel Pro needed for hourly frequency |
| Testing | Vitest | Fast, native ESM; DB tests run against a throwaway Neon branch over neon-http |
| Monorepo | pnpm workspaces | Strict dependency isolation, fast installs |
| Linter | Biome | Fast Rust-based linter + formatter, consistent with vega repo, single config at root |
| Language | TypeScript (strict) | `strict: true` + `noUncheckedIndexedAccess` throughout |

---

## Key Design Decisions

### Neon over Turso (2026-10 migration)
History: started on Cloudflare Workers + D1, moved to Turso (2026-10) because
Vercel + custom domain loaded faster from mainland China than Cloudflare, then
moved to Neon (2026-10-11) to grow on Postgres toward multi-user. The neon-http
driver runs each query as a stateless HTTPS request to Neon's proxy — no
connection pooling to manage on serverless — and works identically from Vercel
functions, GitHub Actions runners, and local dev. Connection is configured via
`DATABASE_URL` alone — never a platform binding — so the same code runs in every
environment. This migration was cheap because the codebase has no transactions
and no dialect-specific upserts (`refreshFeed()` does select-then-write); keep
it that way unless you also change drivers.

### GitHub Actions over Vercel Cron
Vercel Hobby only allows daily cron; Pro is needed for hourly. GitHub Actions
`schedule` gives hourly refresh for free and runs the exact same `refreshFeed()`
code via `packages/worker/scripts/refresh.ts` (plain tsx script, no serverless
wrapper). Note: GitHub cron can be delayed by up to ~15 minutes — acceptable
for RSS.

### REST API (not RPC)
The API is plain HTTP REST. This makes it directly `curl`-able and CLI-friendly
without any translation layer. All endpoints return JSON.

### Vercel serves the frontend + API from one project
The React app is built to `packages/app/dist/` by Vite and set as
`outputDirectory` in `vercel.json`; the API is the serverless function
`api/index.js` (see "Pre-bundled API function" below). Routes are defined with
full paths (`/api/feeds`) so no basePath juggling is needed. A rewrite sends
all non-`/api` paths to `/index.html` (SPA fallback).

### Pre-bundled API function (`api/index.js`)
`api/index.js` is a GENERATED file — a self-contained CJS bundle of
`packages/worker/src/vercel-entry.ts` (the Hono app adapted via `hono/vercel`'s
`handle()`), built by `pnpm build:api` with esbuild. It is committed so
Vercel deploys the exact bundle that passed the local pre-commit checks
(originally adopted after Vercel's own bundling pipeline crashed at module load
on the old libsql CJS dependency tree — the Neon driver bundles cleanly, but
the committed-bundle + freshness-check workflow is kept).
- Never hand-edit it. Change `packages/worker`, run `pnpm build:api`, and
  commit the regenerated bundle.
- The build is deterministic (no source change → byte-identical output), and
  biome excludes `api/**`, so lint-staged never reformats the bundle.
- The pre-commit hook regenerates and diffs the bundle, failing the commit if
  the committed copy is stale.

### Shared types package
`@reed/types` contains the canonical `Feed`, `Folder`, and `Article` interfaces.
All packages import from here. Never define these types inline in worker or app code.

### Drizzle migrations
Schema changes go through `drizzle-kit generate` (produces SQL in `packages/worker/drizzle/`)
then `drizzle-kit migrate` against Neon (`DATABASE_URL`). Never manually
edit generated migration files. Tests (`test-helpers.ts`) apply that same
generated SQL via `src/db/ddl.ts` (a loader that concatenates all
`drizzle/*.sql`); neon-http runs one statement per request, so the loader's
output is split on `--> statement-breakpoint` — the migrations are the only
place the DDL lives; never hand-write schema SQL elsewhere.

Exception — features drizzle-kit cannot generate (e.g. `0001_pg_trgm.sql`:
`CREATE EXTENSION pg_trgm`): hand-write the `.sql` in `drizzle/` and
append a matching entry to `drizzle/meta/_journal.json` (same shape as the
generated ones, incremented `idx`), so `db:migrate` picks it up. `ddl.ts`
already includes any `*.sql` it finds, so tests get it for free.

### Search (pg_trgm ILIKE)
The old SQLite setup mirrored `articles` into an FTS5 trigram virtual table
with sync triggers; all of that machinery is gone on Postgres. `GET
/api/articles?q=` now runs `ILIKE '%token%'` **directly on
`articles.title/summary/content`**, backed by a multi-column GIN index
(`idx_articles_search`, `gin_trgm_ops` — requires the `pg_trgm` extension,
created by the hand-written `drizzle/0001_pg_trgm.sql`). Tokens AND together;
`%`/`_`/`\` in the query are escaped — backslash is LIKE/ILIKE's default
escape character in Postgres, so no `ESCAPE` clause is needed. ILIKE has no
token-length floor (the old trigram MATCH couldn't match under 3 chars; most
Chinese words are 2), and the search composes with `feed_id`/`folder_id`/
`unread` in a single query — no id round-trip through a helper table.

Search highlighting is client-side (`highlightParts()` in app `lib/display.ts`,
`<mark>` rendered by `ArticleList`): the server decides what matched, the
client only paints the query tokens in title + summary.

### No dependency patches
The pnpm `patches/` directory was removed with the Turso→Neon migration — all
three patches existed to make `@libsql/client`'s CJS dependency tree survive
the Vercel serverless bundle. `@neondatabase/serverless` needs none. Don't
reintroduce patches without a diagnosed, upstream-unfixable reason.

---

## Data Model

### `users`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `crypto.randomUUID()` |
| `email` | `text` UNIQUE NOT NULL | Login id, lowercased on write |
| `password_hash` | `text` NOT NULL | `scrypt:<salt hex>:<hash hex>` (Node `crypto.scrypt`, 64-byte key) |
| `created_at` | `integer` | Unix ms |

A placeholder `legacy` user row (created by `drizzle/0002_multiuser.sql`, with a
password hash that can never verify) owns all pre-multiuser rows; the **first**
real registration claims them (see "Article ownership" below). Don't delete
that row while legacy-owned data exists.

### `folders`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `crypto.randomUUID()` |
| `user_id` | `text` FK → `users.id` NOT NULL | Owner |
| `name` | `text` NOT NULL | Display name; unique **per user** (`folders_user_id_name_unique`), duplicates rejected with `409` |
| `created_at` | `integer` | Unix ms, set on insert |

### `feeds`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `crypto.randomUUID()` |
| `user_id` | `text` FK → `users.id` NOT NULL | Owner |
| `url` | `text` NOT NULL | The RSS/Atom feed URL; unique **per user** (`feeds_user_id_url_unique`) — two users may subscribe to the same feed |
| `title` | `text` | From feed `<title>` |
| `site_url` | `text` | From feed `<link>` |
| `description` | `text` | From feed `<description>` / `<subtitle>` |
| `image_url` | `text` | From feed `<image>` or `<itunes:image>` |
| `folder_id` | `text` FK → `folders.id` ON DELETE SET NULL | `NULL` = uncategorized. Postgres enforces the FK, so folder delete relies on it |
| `last_fetched_at` | `integer` | Unix ms, updated on each successful refresh |
| `created_at` | `integer` | Unix ms, set on insert |

### `articles`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `crypto.randomUUID()` |
| `feed_id` | `text` FK → `feeds.id` ON DELETE CASCADE | |
| `url` | `text` NOT NULL | Upsert key, unique **per feed** (`articles_feed_id_url_unique`) |
| `title` | `text` | |
| `summary` | `text` | `<description>` excerpt |
| `content` | `text` | `<content:encoded>` full body |
| `published_at` | `integer` | Unix ms |
| `read` | `integer` NOT NULL DEFAULT 0 | 0 = unread, 1 = read |
| `created_at` | `integer` | Unix ms, set on insert, NOT updated on upsert |

### Indexes
- `idx_articles_feed_id` on `articles(feed_id)`
- `idx_articles_read` on `articles(read)`
- `idx_articles_published_at` on `articles(published_at DESC)`
- `idx_articles_search` on `articles` USING gin (`title`, `summary`, `content` with `gin_trgm_ops`) — backs ILIKE search
- `idx_feeds_user_id` on `feeds(user_id)` — every list query scopes through it
- `users_email_unique`, `folders_user_id_name_unique`, `feeds_user_id_url_unique`, `articles_feed_id_url_unique`

Column types: timestamp columns are `bigint` (unix ms exceeds int4's range);
`read` stays `integer` 0/1 so `@reed/types` and the frontend don't change.
All timestamps remain Unix milliseconds — the convention survives the engine
swap, only the column type is wider.

---

## REST API

Base path: `/api`. **Everything below requires a session** (HttpOnly `reed_session`
cookie set by login/register, or `Authorization: Bearer <jwt>` for non-browser
clients) except `GET /api/health` and the auth endpoints themselves. A 401
response flips the SPA back to the login screen. Sessions are HS256 JWTs
signed with `AUTH_SECRET`, 30-day expiry — stateless, no session table.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | `{ email, password }` (`code` required when `SIGNUP_CODE` is set) → `201` + session cookie; duplicate email → `409`; password < 8 chars → `400`. **The first registration claims all `legacy`-owned folders/feeds** |
| `POST` | `/api/auth/login` | `{ email, password }` → `200` + session cookie; bad credentials → `401` |
| `POST` | `/api/auth/logout` | Clears the session cookie |
| `GET` | `/api/auth/me` | Session check → `200 { id, email }`; 401 when signed out |
| `GET` | `/api/feeds` | List the user's feeds |
| `POST` | `/api/feeds` | Add feed `{ url: string }` → `201`; non-`http(s)` URL → `400` |
| `PATCH` | `/api/feeds/:id` | Move feed into/out of a folder `{ folderId: string \| null }` → `200` |
| `DELETE` | `/api/feeds/:id` | Delete feed + cascade articles → `204` |
| `POST` | `/api/feeds/:id/refresh` | Manually refresh feed → `200 { added, updated }` |
| `GET` | `/api/folders` | List folders |
| `POST` | `/api/folders` | Create folder `{ name: string }` → `201`; duplicate name → `409` |
| `PATCH` | `/api/folders/:id` | Rename folder `{ name: string }` → `200` |
| `DELETE` | `/api/folders/:id` | Delete folder; member feeds become uncategorized (not deleted) → `204` |
| `GET` | `/api/articles` | List articles, **without the `content` column** (payload leanness — see Frontend Conventions). Query params: `feed_id`, `folder_id`, `unread=true`, `q` (case-insensitive substring search over title/summary/content) |
| `GET` | `/api/articles/:id` | Full article including `content`; 404 if unknown. The reader fetches this when an article is opened |
| `PATCH` | `/api/articles/:id` | Update article `{ read: boolean }` → `200` |
| `POST` | `/api/articles/read-all` | Mark all unread articles read; `{ feedId?: string }` scopes to one feed → `200 { marked }` |
| `GET` | `/api/opml` | Export all feeds as OPML 2.0 XML download (`reed.opml`) |
| `POST` | `/api/opml` | Import OPML body → `200 { feedsAdded, foldersCreated, feedsSkipped }`; feeds dedupe by URL (existing skipped, never moved), folders dedupe by name (reused or created). No fetch triggered — hourly cron picks up new feeds |

All error responses: `{ error: string }` with appropriate HTTP status.

---

## Feed Refresh (GitHub Actions)

`.github/workflows/refresh.yml` runs hourly (`37 * * * *`, plus manual
`workflow_dispatch`; off the top of the hour because GitHub delays/drops
on-the-hour crons under load). It checks out the repo, installs pnpm deps, and runs
`pnpm --filter @reed/worker refresh` (→ `scripts/refresh.ts`), which
calls `runCron()` — `refreshFeed()` for every feed in Neon, using
`Promise.allSettled` so one failing feed does not abort others. `runCron()`
returns the failures; the script logs each one to stderr and sets
`process.exitCode = 1` when any feed failed, so a broken feed turns the
Actions run red instead of silently passing forever.

### Feed fetch guardrails (SSRF)
Feed URLs are untrusted input (anyone who can reach the unauthenticated API can
register one). `refreshFeed()` validates before every fetch hop via
`assertFetchableUrl()` + `assertPublicHost()` in `lib/refresh.ts`: only
`http:`/`https:` schemes, hostnames resolved through DNS and rejected when they
resolve to loopback/private/link-local/CGNAT addresses (IPv4 ranges + IPv6
unique-local/link-local; literal IPs checked without DNS), redirects followed
**manually** (`redirect: "manual"` + loop, max 5) so each hop re-qualifies,
10s `AbortSignal.timeout`, response body streamed with a 5 MB cap. The same
scheme check runs at `POST /api/feeds` insert time (→ 400). `POST /api/opml`
bodies are capped at 4 MB. Consequence: feeds on localhost/private-network
URLs are refused — use a public URL (or a tunnel) when testing locally.

### Article ownership on refresh
`articles` is unique per **(feed_id, url)** — each feed owns its own article
rows, so two users subscribed to the same feed URL each get their own copies
(read state stays independent). `refreshFeed()` upserts scoped to the feed
it's refreshing; never narrow the constraint back to URL-only (that was the
single-user-era global dedupe and collides across users).

### Multi-user auth (2026-10-11)
Zero new dependencies: passwords are hashed with Node's built-in
`crypto.scryptSync` (`lib/auth.ts`, format `scrypt:<salt>:<hash>`, constant-time
compare); sessions are HS256 JWTs from `hono/jwt` in an `HttpOnly; Secure;
SameSite=Lax` cookie (30 days, stateless — no session table).
`requireAuth` (lib/auth.ts) also accepts `Authorization: Bearer` for the future
CLI; it's mounted with `router.use("*", requireAuth)` at the top of each of the
four data routers (feeds/folders/articles/opml) — health and auth routes stay
public by never mounting it. Every data query must filter by `c.get("userId")`
— single-row endpoints (`/api/feeds/:id` etc.) check ownership in the same
WHERE clause or they're an IDOR hole. Uniqueness moved from global to per-user
for feeds (`user_id, url`) and folders (`user_id, name`); email stays global.
No rate limiting on login — acceptable at personal scale; revisit if the API
ever becomes public-facing with open registration.

Legacy data migration: `drizzle/0002_multiuser.sql` (hand-written under the
documented exception — the backfill can't be generated) adds `users`, puts
`user_id` on folders/feeds with `DEFAULT 'legacy'` (so the old deployed code
and the hourly cron keep writing during the deploy window), and the first real
registration claims those rows. A future `drizzle-kit generate` may emit a
harmless `DROP DEFAULT` for those columns — that's fine, all inserts set
`user_id` explicitly.

Required repository secret: `DATABASE_URL`.

## CI (GitHub Actions)

`.github/workflows/ci.yml` runs on push to main and PRs: lint → type-check →
tests → frontend build → API-bundle freshness (`pnpm build:api` +
`git diff --exit-code api/index.js`). The pre-commit hook remains the local
fast path; CI is the backstop for commits that bypass it.

## Environment Variables

| Variable | Used by | Values |
|----------|---------|--------|
| `DATABASE_URL` | API (`src/db/client.ts`), all scripts, drizzle-kit, Actions | `postgresql://...` Neon connection string (production branch; the password is embedded) |
| `TEST_DATABASE_URL` | Vitest (`test-helpers.ts`) | Throwaway Neon **branch** — tests TRUNCATE all tables, so never point it at a database you use. Unset → DB tests skip cleanly |
| `AUTH_SECRET` | `lib/auth.ts` — session JWT signing/verification | Random string (`openssl rand -hex 32`). Set in Vercel env + local shell; missing → login/verify throws (500) |
| `SIGNUP_CODE` | `POST /api/auth/register` | Optional invite code; when set, registration requires a matching `code` field. Unset = open registration |

In Vercel these are project environment variables; in GitHub Actions they are
repository secrets; locally they can be exported in the shell or set per-command.

---

## Frontend Conventions

- **Design language:** Reeder-style minimal. Warm paper tones, one orange accent, serif article body. Design tokens are semantic CSS variables in `app.css` (`--color-canvas/panel/card/line/ink/ink-2/ink-3/accent`) defined with CSS `light-dark()` — use them as Tailwind utilities (`bg-canvas`, `text-ink-2`, `border-line`, `text-accent`). Never raw Tailwind palette colors (`bg-blue-500`).
- **Dark mode:** toggled via `document.documentElement.style.colorScheme`; all tokens are `light-dark()` so they follow automatically. Never use `dark:` Tailwind prefixes. Persisted in localStorage key `reed-theme`; default light, does not follow OS preference.
- **No component library:** Kumo was removed (2026-10-10). Components are hand-rolled in `src/components/`; icons are inline SVG in `components/icons.tsx`. Don't reintroduce a component library without discussion — bundle must stay lean (~250 KB raw).
- **Brand mark:** the logo/favicon is a reed stalk whose wind-blown plume bends into the three arcs of an RSS icon (ember gradient dot + arcs on an ink stem, tilted -12°). Canonical source is `app/public/favicon.svg` (dark-mode via CSS `<style>` inside the SVG); `logo.svg` is the transparent-bg variant, `ReedMark` in `icons.tsx` is the inline 24-viewBox copy using CSS vars. PNGs are rasterized by rendering at 512 with headless Chrome (`--headless=new --screenshot --user-data-dir=<tmp> --screenshot=… file://<html wrapper with <img style="width:100vw;height:100vh">`) then downscaling with `sips -z 32 32` / `-z 180 180` — Chrome's small viewports render unreliably and there's no rsvg/ImageMagick on this machine. `apple-touch-icon.png` renders from an `rx="0"` full-bleed SVG variant (iOS masks corners itself; transparent corners would show black). Bump the `?v=` cache-buster in `index.html` whenever the assets change.
- **Article typography:** rendered content uses the `.article-body` class (defined in `app.css`) — serif stack, hand-styled elements. Do not use Tailwind `prose` classes.
- **Summary cleaning:** list-card summaries go through `cleanSummary()` in `lib/display.ts` (strips HTML + HN-style metadata blocks). Feed display names fall back to URL hostname via `feedDisplayName()` — never render a raw URL in the sidebar.
- **Feed icons:** sidebar `Avatar` prefers the site icon — `feed.imageUrl` (RSS `<image>`/`<itunes:image>`, parsed on refresh) first, else `siteUrl` + `/favicon.ico` — and falls back to the letter color block on `<img>` error or when neither URL exists. No server-side favicon scraping; the browser's `onError` is the only failure signal.
- **Layout:** three panes — sidebar (w-64, mobile drawer with scrim), list (`md:w-[380px]`), reader (flex-1). On mobile the list and reader swap by `selectedArticle` state; no routing library.
- **Auth gate:** App checks `GET /api/auth/me` on mount (`authed: boolean | null` — null renders nothing); unauthenticated renders `Login.tsx` full-screen. `setOnUnauthorized` (lib/api.ts) is registered once; **any** 401 from any API call flips back to the login screen (covers 30-day session expiry mid-use). Data-loading effects are gated on `authed`. Sign out lives in the sidebar `···` menu (`onSignOut` → POST /api/auth/logout → login screen). Same-origin cookies make the SPA itself auth-free — never add token handling to `request()`.
- **Folders:** sidebar groups feeds into folders (`Folders` section + uncategorized `Feeds` section). Order is auto-ascending by display name via `compareNames()` (`localeCompare`, handles mixed Chinese/English) — no manual ordering, no order columns. Folder rows expand/collapse on click (chevron): default collapsed, auto-expanded while the folder has unread articles or contains the selected feed; manual choices live in a `expandOverride` map in `FeedSidebar` local state (session-only). Collapsing a folder that holds the selected feed deselects it first (`onSelectFeed(null)`) so the active row never hides itself. Feeds move via native HTML5 drag-and-drop (`draggable` rows; folder rows and the uncategorized section are drop targets → `PATCH /api/feeds/:id`) — dropping onto a collapsed folder works. Folders rename/delete via a hand-rolled right-click context menu (`FeedSidebar.tsx`); feeds get their own context menu (right-click or 500ms long-press on touch) with a "Move to" folder list + uncategorized + delete — that is the touch path for folder assignment, since HTML5 DnD does not work on touch. `NameDialog.tsx` is the shared single-name prompt for create/rename. The context menus must render outside the `<aside>` element — the aside's translate transform makes it the containing block for `position: fixed` descendants. The server's `GET /api/articles?folder_id=` filter has no UI consumer since folder article views were removed — kept as API surface (CLI).
- **OPML import/export:** `···` button in the sidebar wordmark row opens a menu (Import OPML… / Export OPML), rendered outside the `<aside>` like the folder context menu. Export is a plain `<a href="/api/opml">` — the API's `Content-Disposition` triggers the download, no fetch wrapper. Import goes through `ImportOpmlDialog.tsx` (`file.text()` → POST `/api/opml`) and App reloads feeds+folders afterwards; the dialog shows result counts and a Done button. Import semantics are server-side (see API table): additive only, URL-dedupe for feeds, name-dedupe for folders. Parsing/generation lives in `worker/src/lib/opml.ts` on the existing `fast-xml-parser` dep — no OPML library.
- **Article content rendering:** `marked` converts markdown → HTML, then `sanitizeArticleHtml()` (`lib/sanitize.ts`, DOMPurify) sanitizes it before the single `dangerouslySetInnerHTML` sink in `ArticleReader` — feed content is untrusted third-party input (audit AUDIT-001). Never add a second innerHTML sink without going through that helper. The sanitizer's regression tests live in `lib/sanitize.test.ts` (vitest + **jsdom** — happy-dom's DOM misparses template content and breaks DOMPurify).
- **Sort order:** client-side by `publishedAt ?? createdAt`, toggleable newest/oldest. Default newest-first.
- **Search:** a search input under the list header (`searchQuery` state in App, input in `ArticleList`) — every keystroke refetches `articlesApi.list({ feedId, q })`, so search composes with the selected feed (empty query = normal view). No debounce: single-user, one cheap query per keystroke. The loading effect aborts the previous request (`AbortController`) so out-of-order responses can't show a stale list. Matches are highlighted client-side in the list (see Search section under Key Design Decisions).
- **Mark all read:** double-check button in the list header (only rendered while the current view has unread) → `POST /api/articles/read-all` scoped to the selected feed, or global when "All articles" is selected; App reloads the view list + `unreadList` afterwards. No confirm — unread state is the only thing at risk.
- **Unread counts:** sidebar badges derive from a dedicated full unread fetch (`articlesApi.list({ unread: true })` → `unreadList` in App), never from the view-scoped `articles` state — that list is filtered by the current feed selection, so counts derived from it would vanish the moment a feed is selected. `handleMarkRead` keeps `unreadList` in sync for immediate feedback.
- **Auto-mark-read:** selecting an article marks it read automatically.
- **List payloads omit `content`:** `GET /api/articles` returns `ArticleListItem` (`Omit<Article, "content">`) — the full body column was making feed switches drag megabytes over the wire. App state `articles`/`unreadList` are `ArticleListItem[]`; opening an article fetches the full row via `articlesApi.get(id)` (`fullArticle` state in App, cancelled-flag race guard) and the reader renders summary-derived content first, swapping to the full body when it lands. Never widen a list select back to `db.select().from(articles)`.
- **Feed-switch loading state:** a feed switch clears `articles` immediately and shows "Loading…" in the list pane (`isLoadingArticles`); search keystrokes keep the current list visible until the fresh response lands — only feed switches clear.
- **Stale-while-revalidate caches (App.tsx):** two `useRef` Maps make repeat visits instant — `articlesCache` (per feed id, `"all"` for unfiltered; list summaries only, search responses never cached) and `fullCache` (full article bodies, immutable → no invalidation, capped at 50 entries). A cache hit paints immediately while the same fetch as before still runs and replaces the view on landing, so nothing can go stale for more than one round trip — no invalidation wiring beyond `handleMarkRead` writing its change through to `articlesCache`.

## General Conventions

- **Exports:** named exports only, no default exports except in `vite.config.ts`
- **File naming:** `kebab-case.ts`, test files colocated as `foo.test.ts`
- **Error handling:** API endpoints return `{ error: string }` JSON, never throw to the client. Unexpected errors surface as a generic `{"error":"Internal server error"}` with the real error only in server logs — internal details (DB hostnames, env problems) must not reach an unauthenticated caller.
- **Types:** always import from `@reed/types`, never redefine inline
- **SQL:** Drizzle query builder for all queries, raw `sql` template tag only when necessary
- **IDs:** always `crypto.randomUUID()`
- **Timestamps:** always Unix milliseconds (`Date.now()`), stored as `integer`

---

## Pre-commit Hook

Husky runs on every commit:
1. **lint-staged** — biome lint + format on staged `*.ts/tsx/js/jsx` files only
2. **type-check** — `tsc --noEmit` across all packages
3. **API bundle check** — regenerates `api/index.js` via `pnpm build:api` and
   fails the commit if the committed copy is stale (`git diff --exit-code`).
   Fix: run `pnpm build:api`, stage `api/index.js`, commit again.

To run manually:
```bash
pnpm lint        # biome lint on entire repo
pnpm format      # biome format --write on entire repo
pnpm type-check  # tsc --noEmit across all packages
```

Tests are run on every commit as a guardrail — particularly important for agent-authored
commits. `--passWithNoTests` is set so the hook doesn't fail before any test files exist.
DB tests read `TEST_DATABASE_URL` (a throwaway Neon branch); when it is unset the
database tests skip, so the hook still passes offline.

---

## Commands

```bash
# Install all dependencies
pnpm install

# Run API in local dev mode on :8787 (Vite proxies /api/* here)
# Needs DATABASE_URL (a Neon connection string — local dev hits Neon directly)
export DATABASE_URL=postgresql://...
pnpm dev

# Run all tests
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Type-check all packages + api/ entry
pnpm type-check

# Build the frontend
pnpm build

# Deploy to Vercel (or just push — Vercel builds from the repo)
pnpm deploy

# Generate Drizzle migration from schema changes
pnpm --filter @reed/worker db:generate

# Apply migrations to Neon (reads DATABASE_URL)
pnpm --filter @reed/worker db:migrate

# Trigger the hourly refresh manually (same code the Actions workflow runs)
pnpm --filter @reed/worker refresh

# Open Drizzle Studio (DB browser, uses DATABASE_URL)
pnpm --filter @reed/worker db:studio
```

---

## Deployment

- **Hosting:** Vercel (one project: static SPA + `api/` serverless function)
- **First-time setup:** import the repo in Vercel (framework: Other — `vercel.json`
  drives the build), then set the `DATABASE_URL` env var
  and bind a custom domain
- **Deploys:** automatic on push to the production branch, or `pnpm deploy` (vercel CLI)
- **Local dev:** `pnpm dev` (Node API on :8787 + `pnpm --filter @reed/app dev`)

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | Complete | API layer — Hono, Neon Postgres, REST endpoints, GH Actions refresh, Vitest |
| 2 | Complete | Frontend — React, Vite, Tailwind v4 (Reeder-style rewrite 2026-10-10), static hosting on Vercel |
| 3 | In progress | Auth (multi-user, shipped 2026-10-11), CLI tool (FTS5 search + OPML import/export shipped 2026-10-11) |

See `WORKLOG.md` for increment-by-increment progress and decisions.
