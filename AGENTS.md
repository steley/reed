# Reed — Agent Guide

Personal RSS reader built on Vercel (Hono API), Turso (libSQL/SQLite), and
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
- A Turso (libSQL/SQLite) database for feeds and articles, accessed via `@libsql/client` over HTTP
- Hourly feed refresh via GitHub Actions (`schedule` cron)
- A React frontend (Vite + Tailwind v4, hand-rolled components) served as static output by Vercel
- A CLI tool for terminal access to the API (phase 3)

This is a **personal, single-user application**. There is no multi-tenancy, no
per-user auth in phase 1.

---

## Monorepo Structure

```
reed/
├── package.json              # Root: pnpm workspace config + root scripts
├── pnpm-workspace.yaml       # Declares packages/*
├── tsconfig.json             # Root: base TS config, extended by all packages
├── vercel.json               # Vercel build config + SPA fallback rewrites
├── api/                      # GENERATED serverless bundle (pnpm build:api) — do not edit
├── .github/workflows/        # refresh.yml — hourly feed refresh into Turso
├── AGENTS.md                 # This file
├── WORKLOG.md                # Increment-by-increment build log (agent memory)
└── packages/
    ├── types/                # @reed/types  — shared TS types
    ├── worker/               # @reed/worker — Hono API + Turso + refresh scripts
    ├── app/                  # @reed/app    — React frontend (phase 2)
    └── cli/                  # @reed/cli    — CLI tool (phase 3)
```

### Package purposes

| Package | Description |
|---------|-------------|
| `@reed/types` | Shared `Feed`, `Article`, `NewFeed`, `NewArticle` TypeScript interfaces. No runtime code — types only. Imported by worker, app, and cli. |
| `@reed/worker` | Owns the REST API (Hono), Turso/libsql queries via Drizzle, RSS fetching/parsing, and the refresh scripts (`scripts/refresh.ts` for Actions, `scripts/dev.ts` for local dev). |
| `@reed/app` | React SPA built with Vite. Hand-rolled components + Tailwind v4. Built to `dist/` and served as static output by Vercel. |
| `@reed/cli` | Node.js CLI binary. Makes HTTP calls to the deployed REST API. Phase 3 — not yet scaffolded. |

---

## Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Vercel serverless functions (Node) | Deployed from the same repo; user's real-world testing shows Vercel + custom domain is faster from mainland China than Cloudflare |
| Database | Turso (libSQL/SQLite) | Managed SQLite over HTTP (`@libsql/client`), works from Vercel + GitHub Actions, supports Drizzle |
| ORM | Drizzle ORM + drizzle-kit | Type-safe queries, `turso` dialect for migrations; same sqlite-core schema as the old D1 setup |
| HTTP router | Hono | Lightweight, typed routing; `app.request()` enables clean unit tests; `hono/vercel` adapter for the serverless entry |
| RSS parsing | `fast-xml-parser` | Pure JS, no native deps, handles RSS 2.0 + Atom |
| Markdown rendering | `marked` | Converts markdown content to HTML for feeds that provide markdown bodies |
| Frontend | React 19 + Vite | Standard SPA setup |
| UI components | Hand-rolled + Tailwind v4 | Reeder-style minimal UI; no component library (removed 2026-10-10) |
| Scheduled refresh | GitHub Actions cron | Free for public/private repos, full Node runtime, no Vercel Pro needed for hourly frequency |
| Testing | Vitest | Fast, native ESM, works in Node with in-memory libsql |
| Monorepo | pnpm workspaces | Strict dependency isolation, fast installs |
| Linter | Biome | Fast Rust-based linter + formatter, consistent with vega repo, single config at root |
| Language | TypeScript (strict) | `strict: true` + `noUncheckedIndexedAccess` throughout |

---

## Key Design Decisions

### Turso over D1 (2026-10 migration)
Migrated off Cloudflare Workers + D1 because the user's real-world testing showed
Vercel + custom domain loads faster from mainland China than Cloudflare. Turso was
chosen over Neon/Supabase because the schema is SQLite (zero Drizzle schema
changes), reads/writes from a single-user app don't hit SQLite's single-writer
ceiling, and the HTTP-based libsql client works identically from Vercel functions,
GitHub Actions runners, and local dev (`file:` URLs). Database connection is
configured via `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` env vars — never a
platform binding — so the same code runs in every environment.

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
`handle()`), built by `pnpm build:api` with esbuild. It is committed because
Vercel's own bundling pipeline crashed at module load on CJS transitive deps of
`@libsql/client` even with the pnpm patches in place (full diagnosis in
WORKLOG).
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
then `drizzle-kit migrate` against Turso (`TURSO_*` env vars). Never manually
edit generated migration files. Test databases (`test-helpers.ts`) and
`scripts/local-db.ts` apply that same generated SQL via `src/db/ddl.ts` (a
loader that concatenates all `drizzle/*.sql`) — the migrations are the only
place the DDL lives; never hand-write schema SQL elsewhere.

### Dependency patches (`patches/`)
pnpm `patchedDependencies` in the root `package.json` carries three
version-exact patches, all serving the Vercel serverless runtime (upstream had
no fix as of `@libsql/client` 0.18): `@libsql/isomorphic-ws` and
`@libsql/hrana-client` swap CJS `ws`/`cross-fetch` imports for Node's global
`fetch`/`WebSocket`; `drizzle-orm` makes the libsql driver import
`@libsql/client/web`. Patch pins include exact versions — bumping any of these
packages means updating the pins and re-verifying the patches. See WORKLOG for
the full diagnosis.

---

## Data Model

### `folders`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `crypto.randomUUID()` |
| `name` | `text` UNIQUE NOT NULL | Display name; duplicates rejected with `409` |
| `created_at` | `integer` | Unix ms, set on insert |

### `feeds`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `crypto.randomUUID()` |
| `url` | `text` UNIQUE NOT NULL | The RSS/Atom feed URL |
| `title` | `text` | From feed `<title>` |
| `site_url` | `text` | From feed `<link>` |
| `description` | `text` | From feed `<description>` / `<subtitle>` |
| `image_url` | `text` | From feed `<image>` or `<itunes:image>` |
| `folder_id` | `text` FK → `folders.id` ON DELETE SET NULL | `NULL` = uncategorized. Folder delete nulls it explicitly in the route (libsql does not guarantee the FK pragma is on in every environment) |
| `last_fetched_at` | `integer` | Unix ms, updated on each successful refresh |
| `created_at` | `integer` | Unix ms, set on insert |

### `articles`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `crypto.randomUUID()` |
| `feed_id` | `text` FK → `feeds.id` ON DELETE CASCADE | |
| `url` | `text` UNIQUE NOT NULL | Upsert key |
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

---

## REST API

Base path: `/api`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/feeds` | List all feeds |
| `POST` | `/api/feeds` | Add feed `{ url: string }` → `201` |
| `PATCH` | `/api/feeds/:id` | Move feed into/out of a folder `{ folderId: string \| null }` → `200` |
| `DELETE` | `/api/feeds/:id` | Delete feed + cascade articles → `204` |
| `POST` | `/api/feeds/:id/refresh` | Manually refresh feed → `200 { added, updated }` |
| `GET` | `/api/folders` | List folders |
| `POST` | `/api/folders` | Create folder `{ name: string }` → `201`; duplicate name → `409` |
| `PATCH` | `/api/folders/:id` | Rename folder `{ name: string }` → `200` |
| `DELETE` | `/api/folders/:id` | Delete folder; member feeds become uncategorized (not deleted) → `204` |
| `GET` | `/api/articles` | List articles. Query params: `feed_id`, `folder_id`, `unread=true` |
| `PATCH` | `/api/articles/:id` | Update article `{ read: boolean }` → `200` |

All error responses: `{ error: string }` with appropriate HTTP status.

---

## Feed Refresh (GitHub Actions)

`.github/workflows/refresh.yml` runs hourly (`37 * * * *`, plus manual
`workflow_dispatch`; off the top of the hour because GitHub delays/drops
on-the-hour crons under load). It checks out the repo, installs pnpm deps, and runs
`pnpm --filter @reed/worker refresh` (→ `scripts/refresh.ts`), which
calls `runCron()` — `refreshFeed()` for every feed in Turso, using
`Promise.allSettled` so one failing feed does not abort others.

Required repository secrets: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`.

## Environment Variables

| Variable | Used by | Values |
|----------|---------|--------|
| `TURSO_DATABASE_URL` | API (`src/db/client.ts`), all scripts, drizzle-kit | `libsql://...` (Turso) or `file:local.db` (local dev) |
| `TURSO_AUTH_TOKEN` | Same, when URL is remote | Turso auth token (not needed for `file:` URLs) |

In Vercel these are project environment variables; in GitHub Actions they are
repository secrets; locally they can be exported in the shell or set per-command.

---

## Frontend Conventions

- **Design language:** Reeder-style minimal. Warm paper tones, one orange accent, serif article body. Design tokens are semantic CSS variables in `app.css` (`--color-canvas/panel/card/line/ink/ink-2/ink-3/accent`) defined with CSS `light-dark()` — use them as Tailwind utilities (`bg-canvas`, `text-ink-2`, `border-line`, `text-accent`). Never raw Tailwind palette colors (`bg-blue-500`).
- **Dark mode:** toggled via `document.documentElement.style.colorScheme`; all tokens are `light-dark()` so they follow automatically. Never use `dark:` Tailwind prefixes. Persisted in localStorage key `reed-theme`; default light, does not follow OS preference.
- **No component library:** Kumo was removed (2026-10-10). Components are hand-rolled in `src/components/`; icons are inline SVG in `components/icons.tsx`. Don't reintroduce a component library without discussion — bundle must stay lean (~250 KB raw).
- **Article typography:** rendered content uses the `.article-body` class (defined in `app.css`) — serif stack, hand-styled elements. Do not use Tailwind `prose` classes.
- **Summary cleaning:** list-card summaries go through `cleanSummary()` in `lib/display.ts` (strips HTML + HN-style metadata blocks). Feed display names fall back to URL hostname via `feedDisplayName()` — never render a raw URL in the sidebar.
- **Layout:** three panes — sidebar (w-64, mobile drawer with scrim), list (`md:w-[380px]`), reader (flex-1). On mobile the list and reader swap by `selectedArticle` state; no routing library.
- **Folders:** sidebar groups feeds into folders (`Folders` section + uncategorized `Feeds` section). Order is auto-ascending by display name via `compareNames()` (`localeCompare`, handles mixed Chinese/English) — no manual ordering, no order columns. Folder rows expand/collapse on click (chevron): default collapsed, auto-expanded while the folder has unread articles or contains the selected feed; manual choices live in a `expandOverride` map in `FeedSidebar` local state (session-only). Collapsing a folder that holds the selected feed deselects it first (`onSelectFeed(null)`) so the active row never hides itself. Feeds move via native HTML5 drag-and-drop (`draggable` rows; folder rows and the uncategorized section are drop targets → `PATCH /api/feeds/:id`) — dropping onto a collapsed folder works. Folders rename/delete via a hand-rolled right-click context menu (`FeedSidebar.tsx`); `NameDialog.tsx` is the shared single-name prompt for create/rename. The context menu must render outside the `<aside>` element — the aside's translate transform makes it the containing block for `position: fixed` descendants. HTML5 DnD does not work on touch; there is no mobile path to assign folders yet. The server's `GET /api/articles?folder_id=` filter has no UI consumer since folder article views were removed — kept as API surface (CLI).
- **Article content rendering:** `marked` converts markdown → HTML, injected via `dangerouslySetInnerHTML`. 
- **Sort order:** client-side by `publishedAt ?? createdAt`, toggleable newest/oldest. Default newest-first.
- **Unread counts:** sidebar badges derive from a dedicated full unread fetch (`articlesApi.list({ unread: true })` → `unreadList` in App), never from the view-scoped `articles` state — that list is filtered by the current feed selection, so counts derived from it would vanish the moment a feed is selected. `handleMarkRead` keeps `unreadList` in sync for immediate feedback.
- **Auto-mark-read:** selecting an article marks it read automatically.

## General Conventions

- **Exports:** named exports only, no default exports except in `vite.config.ts`
- **File naming:** `kebab-case.ts`, test files colocated as `foo.test.ts`
- **Error handling:** API endpoints return `{ error: string }` JSON, never throw to the client
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

---

## Commands

```bash
# Install all dependencies
pnpm install

# Run API in local dev mode on :8787 (Vite proxies /api/* here)
# Needs TURSO_DATABASE_URL (use file:local.db for offline dev)
pnpm dev

# Initialise a local SQLite file DB with the schema (one-time)
TURSO_DATABASE_URL=file:local.db pnpm --filter @reed/worker db:local

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

# Apply migrations to Turso (reads TURSO_* env vars)
pnpm --filter @reed/worker db:migrate

# Trigger the hourly refresh manually (same code the Actions workflow runs)
pnpm --filter @reed/worker refresh

# Open Drizzle Studio (DB browser, uses TURSO_* env vars)
pnpm --filter @reed/worker db:studio

# One-time D1 → Turso data migration helper (kept until data is migrated)
pnpm --filter @reed/worker db:export-d1   # then: turso db shell <db> < dump.sql
```

---

## Deployment

- **Hosting:** Vercel (one project: static SPA + `api/` serverless function)
- **First-time setup:** import the repo in Vercel (framework: Other — `vercel.json`
  drives the build), then set `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` env vars
  and bind a custom domain
- **Deploys:** automatic on push to the production branch, or `pnpm deploy` (vercel CLI)
- **Local dev:** `pnpm dev` (Node API on :8787 + `pnpm --filter @reed/app dev`)

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | Complete | API layer — Hono, Turso, REST endpoints, GH Actions refresh, Vitest |
| 2 | Complete | Frontend — React, Vite, Tailwind v4 (Reeder-style rewrite 2026-10-10), static hosting on Vercel |
| 3 | Deferred | Auth, CLI tool, FTS5 search, OPML import/export |

See `WORKLOG.md` for increment-by-increment progress and decisions.
