# cloud-reader — Agent Guide

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

---

## What This Is

A self-hosted RSS reader with:
- A REST API backend (Hono on Node) served from Vercel serverless functions
- A Turso (libSQL/SQLite) database for feeds and articles, accessed via `@libsql/client` over HTTP
- Hourly feed refresh via GitHub Actions (`schedule` cron)
- A React frontend (Vite + Kumo component library) served as static output by Vercel
- A CLI tool for terminal access to the API (phase 3)

This is a **personal, single-user application**. There is no multi-tenancy, no
per-user auth in phase 1.

---

## Monorepo Structure

```
cloud-reader/
├── package.json              # Root: pnpm workspace config + root scripts
├── pnpm-workspace.yaml       # Declares packages/*
├── tsconfig.json             # Root: base TS config, extended by all packages
├── vercel.json               # Vercel build config + SPA fallback rewrites
├── api/                      # Vercel serverless entry ([[...route]].ts → hono/vercel handle)
├── .github/workflows/        # refresh.yml — hourly feed refresh into Turso
├── AGENTS.md                 # This file
├── WORKLOG.md                # Increment-by-increment build log (agent memory)
└── packages/
    ├── types/                # @cloud-reader/types  — shared TS types
    ├── worker/               # @cloud-reader/worker — Hono API + Turso + refresh scripts
    ├── app/                  # @cloud-reader/app    — React frontend (phase 2)
    └── cli/                  # @cloud-reader/cli    — CLI tool (phase 3)
```

### Package purposes

| Package | Description |
|---------|-------------|
| `@cloud-reader/types` | Shared `Feed`, `Article`, `NewFeed`, `NewArticle` TypeScript interfaces. No runtime code — types only. Imported by worker, app, and cli. |
| `@cloud-reader/worker` | Owns the REST API (Hono), Turso/libsql queries via Drizzle, RSS fetching/parsing, and the refresh scripts (`scripts/refresh.ts` for Actions, `scripts/dev.ts` for local dev). |
| `@cloud-reader/app` | React SPA built with Vite. Uses `@cloudflare/kumo` component library. Built to `dist/` and served as static output by Vercel. |
| `@cloud-reader/cli` | Node.js CLI binary. Makes HTTP calls to the deployed REST API. Phase 3 — not yet scaffolded. |

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
| Frontend | React 19 + Vite | Standard SPA setup, good Kumo compatibility |
| UI components | `@cloudflare/kumo` | Component library, built on Base UI, Tailwind v4 |
| Scheduled refresh | GitHub Actions cron | Free for public/private repos, full Node runtime, no Vercel Pro needed for hourly frequency |
| Testing | Vitest | Fast, native ESM, works in Node with in-memory libsql |
| Monorepo | pnpm workspaces | Strict dependency isolation, fast installs, consistent with Kumo and vega repos |
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
`outputDirectory` in `vercel.json`; the API is the optional catch-all function
`api/[[...route]].ts` which adapts the Hono app via `hono/vercel`'s `handle()`.
Routes are defined with full paths (`/api/feeds`) so no basePath juggling is
needed. A rewrite sends all non-`/api` paths to `/index.html` (SPA fallback).

### Shared types package
`@cloud-reader/types` contains the canonical `Feed` and `Article` interfaces.
All packages import from here. Never define these types inline in worker or app code.

### Drizzle migrations
Schema changes go through `drizzle-kit generate` (produces SQL in `packages/worker/drizzle/`)
then `drizzle-kit migrate` against Turso (`TURSO_*` env vars). Never manually
edit generated migration files.

---

## Data Model

### `feeds`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `crypto.randomUUID()` |
| `url` | `text` UNIQUE NOT NULL | The RSS/Atom feed URL |
| `title` | `text` | From feed `<title>` |
| `site_url` | `text` | From feed `<link>` |
| `description` | `text` | From feed `<description>` / `<subtitle>` |
| `image_url` | `text` | From feed `<image>` or `<itunes:image>` |
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
| `DELETE` | `/api/feeds/:id` | Delete feed + cascade articles → `204` |
| `POST` | `/api/feeds/:id/refresh` | Manually refresh feed → `200 { added, updated }` |
| `GET` | `/api/articles` | List articles. Query params: `feed_id`, `unread=true` |
| `PATCH` | `/api/articles/:id` | Update article `{ read: boolean }` → `200` |

All error responses: `{ error: string }` with appropriate HTTP status.

---

## Feed Refresh (GitHub Actions)

`.github/workflows/refresh.yml` runs hourly (`0 * * * *`, plus manual
`workflow_dispatch`). It checks out the repo, installs pnpm deps, and runs
`pnpm --filter @cloud-reader/worker refresh` (→ `scripts/refresh.ts`), which
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

- **Dark mode:** toggled via `document.documentElement.style.colorScheme`. Kumo uses CSS `light-dark()` internally so all tokens respond automatically. Never use `dark:` Tailwind prefixes. Default is **light mode** (`isDark` initialises to `false`) — does not follow OS preference.
- **No app-wide custom theming:** Kumo owns its component colours via `light-dark()` and `--color-kumo-*` variables. Theming only the parts we own (article body, cards) while Kumo's chrome stays neutral looks fragmented. Stick to Kumo's light/dark toggle.
- **Semantic tokens only:** use `bg-kumo-base`, `text-kumo-default` etc. Never raw Tailwind colors (`bg-blue-500`).
- **All content panes must have `bg-kumo-base`:** the sidebar has its own background from Kumo; the article list and reader must explicitly set `bg-kumo-base` or they'll use the browser default and look wrong in dark mode. Note: `bg-kumo-surface` is a visibly different (elevated) color — do not use it for pane backgrounds, only for cards/dialogs that sit above the base layer.
- **Article typography:** use the `.article-body` CSS class (defined in `app.css`) for rendered article content — NOT Tailwind's `prose` classes. `prose` doesn't use Kumo's CSS variables so colors break in dark mode. `.article-body` uses `var(--color-kumo-*)` directly.
- **HTML entities in article cards:** use `DOMParser` to strip tags and decode all entities. Never manual regex replacement.
- **Article content rendering:** `marked` converts markdown → HTML. Heuristic: if content contains HTML tags treat as HTML, otherwise parse as markdown.
- **Sort order:** article list sorts client-side by `publishedAt ?? createdAt`. Default is newest-first.
- **Auto-mark-read:** selecting an article marks it read automatically.
- **Refresh layout:** refresh-all is a `Sidebar.MenuAction` on the "All articles" row. Per-feed refresh is a button in the `ArticleList` header, shown only when a single feed is selected. No refresh icons on individual sidebar feed rows.
- **Sidebar width:** `defaultWidth={280}`, `minWidth={220}`, `resizable`. Do not reduce these without good reason — feed titles need space.
- **Kumo styling depends on the Tailwind `@source` scan** (`app.css` line 1). The path is relative to the CSS file: from `packages/app/src/` it must be `../node_modules/@cloudflare/kumo/dist/**` — `../../` points at the nonexistent `packages/node_modules` and **fails silently** (no error, Kumo utilities just vanish from the built CSS: unstyled `MenuAction`, `Empty` as plain text, etc.). Sanity check: `grep -c "bg-kumo-overlay" packages/app/dist/assets/*.css` must be ≥ 1.
- **`Sidebar.Header` is itself `flex items-center gap-2`** — stacking multiple rows inside requires an explicit `className="flex-col ..."`. It also has built-in `px-2` and `overflow-hidden`: don't add nested horizontal padding on children, or content gets clipped when the sidebar collapses to 3rem (icon rail).
- **Kumo `Empty` renders as a bordered card with `w-full`** — wrap it in a padded, width-capped container (`p-4`/`p-6` + `max-w-*`) or it spans the full pane edge-to-edge.

## General Conventions

- **Exports:** named exports only, no default exports except in `vite.config.ts`
- **File naming:** `kebab-case.ts`, test files colocated as `foo.test.ts`
- **Error handling:** API endpoints return `{ error: string }` JSON, never throw to the client
- **Types:** always import from `@cloud-reader/types`, never redefine inline
- **SQL:** Drizzle query builder for all queries, raw `sql` template tag only when necessary
- **IDs:** always `crypto.randomUUID()`
- **Timestamps:** always Unix milliseconds (`Date.now()`), stored as `integer`

---

## Pre-commit Hook

Husky runs on every commit:
1. **lint-staged** — biome lint + format on staged `*.ts/tsx/js/jsx` files only
2. **type-check** — `tsc --noEmit` across all packages

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
TURSO_DATABASE_URL=file:local.db pnpm --filter @cloud-reader/worker db:local

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
pnpm --filter @cloud-reader/worker db:generate

# Apply migrations to Turso (reads TURSO_* env vars)
pnpm --filter @cloud-reader/worker db:migrate

# Trigger the hourly refresh manually (same code the Actions workflow runs)
pnpm --filter @cloud-reader/worker refresh

# Open Drizzle Studio (DB browser, uses TURSO_* env vars)
pnpm --filter @cloud-reader/worker db:studio

# One-time D1 → Turso data migration helper (kept until data is migrated)
pnpm --filter @cloud-reader/worker db:export-d1   # then: turso db shell <db> < dump.sql
```

---

## Deployment

- **Hosting:** Vercel (one project: static SPA + `api/` serverless function)
- **First-time setup:** import the repo in Vercel (framework: Other — `vercel.json`
  drives the build), then set `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` env vars
  and bind a custom domain
- **Deploys:** automatic on push to the production branch, or `pnpm deploy` (vercel CLI)
- **Local dev:** `pnpm dev` (Node API on :8787 + `pnpm --filter @cloud-reader/app dev`)

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | Complete | API layer — Hono, Turso, REST endpoints, GH Actions refresh, Vitest |
| 2 | Complete | Frontend — React, Vite, Kumo, static hosting on Vercel |
| 3 | Deferred | Auth, CLI tool, FTS5 search, OPML import/export |

See `WORKLOG.md` for increment-by-increment progress and decisions.
