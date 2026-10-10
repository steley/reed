# Reed — Worklog

Agent memory bank. Each increment is logged here with what was built, decisions
made, options discarded, and any dead ends. Read this before starting any new
work to avoid re-litigating settled decisions or repeating failed approaches.

---

## Increment 0 — Monorepo scaffold
**Date:** 2026-03-27
**Status:** Complete

### What was built
- Root `package.json` with pnpm workspace config and root-level scripts
- `pnpm-workspace.yaml` declaring `packages/*`
- Root `tsconfig.json` with strict TypeScript settings (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- `.gitignore` covering `node_modules`, `.wrangler`, D1 local db files, build output
- `AGENTS.md` — full project context document
- `WORKLOG.md` — this file

### Decisions made
- **pnpm over npm:** Chosen for strict dependency isolation (prevents phantom deps
  between packages), faster installs, and consistency with the vega repo and the
  Kumo repo which both use pnpm.
- **Monorepo from the start:** Even though the CLI (phase 3) doesn't exist yet,
  the monorepo structure is established now so it doesn't require restructuring later.
  The `cli` package is not scaffolded yet — it will be added in phase 3.
- **TypeScript strict mode:** `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
  enabled from day one. These are harder to add later than to start with.

### Options considered and discarded
- **npm workspaces:** Rejected in favour of pnpm. npm's hoisting can cause phantom
  dependencies where a package accidentally imports something installed for a sibling
  package. pnpm's strict linking prevents this.
- **Single-package (no monorepo):** Rejected because the CLI tool (phase 3) needs
  to be a separate Node.js binary with its own `package.json` and build, and the
  frontend needs its own Vite build. A monorepo is the cleanest way to share types
  across all three without publishing to npm.

### Dead ends / gotchas
- None at this stage.

---

<!-- New increments are appended below this line -->

## Increments 10–18 — Phase 2 Frontend
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `packages/app/` — full React SPA: Vite + Kumo + Tailwind v4 + `@phosphor-icons/react`
- `src/lib/api.ts` — typed fetch wrappers for all 6 REST endpoints, `ApiError` class
- `src/components/FeedSidebar.tsx` — Kumo `Sidebar` with feed list, unread badges, per-feed refresh, add feed button
- `src/components/AddFeedDialog.tsx` — Kumo `Dialog` + `Field` + `Input` for adding feeds
- `src/components/ArticleList.tsx` — article list with read/unread state, `Badge` for new articles
- `src/components/ArticleReader.tsx` — article detail pane, mark read/unread, open original link
- `src/App.tsx` — three-pane shell: sidebar + article list + reader, full state management
- `wrangler.jsonc` updated with `assets` binding pointing to `packages/app/dist/`
- `vite.config.ts` — `/api/*` proxied to wrangler dev server (port 8787)
- Production deployed to `https://cloud-reader.alexcostaviana.workers.dev`

### Decisions made
- **`Toasty` removed for now:** Kumo's `Toasty` component requires `children` and
  doesn't work as a standalone viewport. Deferred to phase 3 when proper toast
  notification wiring is needed.
- **CSS linting disabled in biome:** Tailwind v4's `@source` directive is not valid
  standard CSS and biome flags it as an error even with overrides. CSS is linted by
  Vite/Tailwind at build time instead.
- **Auto-mark-read on article open:** Selecting an article marks it as read
  automatically. Feels natural for an RSS reader.

### Dead ends / gotchas
- `Toasty.Provider` / `Toasty.Viewport` don't exist — `Toasty` is a flat component
  wrapping both.
- `exactOptionalPropertyTypes: true` causes issues with Kumo's `render` prop pattern
  which spreads `className?: string` onto components expecting `className: string`.
  Fixed with `className={props.className ?? ""}`.
- `useCallback` dependency order matters — `handleAddFeed` originally referenced
  `handleRefreshFeed` before it was declared, and had an empty dep array. Biome's
  `useExhaustiveDependencies` rule caught this as a lint error during pre-commit.
  Fixed by reordering the callbacks.
- Biome v2 `@source` CSS parse error — fixed by disabling CSS linting globally in
  biome.json (`css.linter.enabled: false`).

## Increment 9 — D1 database setup
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `wrangler.jsonc` updated: `database_id` set to `996fad41-7d45-4254-8c22-aafd3950b673`,
  `migrations_dir` set to `drizzle`
- Migration `0000_silly_rumiko_fujikawa.sql` applied locally and remotely

### Decisions made
- **Kept binding name `DB`** (not `cloud_reader` as CF suggested) — `DB` is already
  used throughout all route handlers and is cleaner.
- **`migrations_dir: "drizzle"`** — wrangler defaults to `migrations/` but our
  Drizzle-generated files live in `drizzle/`. This must be set explicitly.

### Dead ends / gotchas
- First `db:migrate` failed because `migrations_dir` was not set in `wrangler.jsonc`.
  Wrangler looks for a `migrations/` folder by default and errors if it doesn't exist.

## Increment 7 — Articles API + tests
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `src/worker/routes/articles.ts` — Hono router: `GET /` with `?feed_id` and
  `?unread=true` query filters, `PATCH /:id` to mark read/unread
- `src/worker/articles.test.ts` — 9 tests: list all, filter by feed_id, filter
  by unread, combined filters, mark read, mark unread, 404 on unknown, 400 on
  missing field, 400 on invalid JSON

### Decisions made
- **`and(...conditions)` for dynamic filters:** Build condition array based on
  query params, spread into Drizzle's `and()`. Avoids nested if/else and works
  cleanly with zero, one, or two conditions.
- **`read` stored as integer, returned as integer:** The API returns `read: 0/1`
  directly from the DB. The frontend and CLI convert to boolean as needed. This
  keeps the DB representation transparent in the API response.

### Dead ends / gotchas
- None.

---

## Increment 8 — Cron handler + tests
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `src/worker/cron.test.ts` — 3 tests: refreshes all feeds, tolerates one
  failure and continues, handles empty feed list

### Decisions made
- **`Promise.allSettled` in `runCron`:** Already in place from increment 6.
  Tests confirm that a 500 response from one feed URL does not prevent other
  feeds from being refreshed.

### Dead ends / gotchas
- None.

## Increment 6 — Feeds API + Hono router
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `hono` added as a runtime dependency
- `src/worker/index.ts` — refactored to use `createApp(dbOverride?)` factory with
  Hono. DB injected via context variable middleware so routes are testable without
  a real D1 binding.
- `src/worker/routes/feeds.ts` — Hono router: `GET /`, `POST /`, `DELETE /:id`,
  `POST /:id/refresh`
- `src/worker/routes/articles.ts` — stub returning 501 (implemented in increment 7)
- `src/worker/cron.ts` — `runCron(db)` extracted from index
- `src/worker/feeds.test.ts` — 11 tests using `app.request()` with in-memory DB

### Decisions made
- **Hono over hand-rolled routing:** Switched at user request. Hono gives typed
  routing, `c.req.param()`, `c.json()`, middleware, and `app.request()` for testing
  — eliminates all the manual URL parsing and method switching.
- **`createApp(dbOverride?)` factory:** Allows tests to pass a `LibSQLDatabase`
  instance as the DB without needing a real D1 binding. The middleware injects it
  into Hono context so all routes use `c.get("db")` rather than calling
  `drizzle(c.env.DB)` directly — clean separation of construction from use.
- **`Variables` type on Hono app:** Typed context variables (`db: DrizzleD1Database`)
  give full type safety on `c.get("db")` throughout all route handlers.

### Options considered and discarded
- **Hand-rolled routing (original plan):** Rejected mid-increment at user request.
  The regex matching and manual method dispatch was already getting verbose.

### Dead ends / gotchas
- None.

## Increment 5 — Refresh logic + tests
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `packages/worker/src/lib/refresh.ts` — `refreshFeed(feedId, db)`: loads feed from
  DB, fetches RSS URL, parses XML, updates feed metadata, upserts articles (check
  existence then insert or update), returns `{ added, updated }`.
- `packages/worker/src/lib/test-helpers.ts` — `createTestDb()`: creates an in-memory
  libsql database with the cloud-reader schema applied, used as a drop-in for D1 in tests.
- `packages/worker/src/lib/refresh.test.ts` — 9 tests: added count, article storage,
  feed metadata update, article fields, upsert on re-refresh, read flag preservation,
  feed-not-found error, HTTP failure error, unparseable XML error.
- `@libsql/client` added as devDependency for in-memory SQLite in tests.

### Decisions made
- **Check-then-insert upsert pattern:** D1's `onConflictDoUpdate` support in Drizzle
  requires careful handling with the `libsql` driver in tests. Using a
  select-then-insert-or-update pattern works identically across both D1 and libsql,
  keeping test behavior consistent with production.
- **`db as never` cast in tests:** The test DB is `LibSQLDatabase` but `refreshFeed`
  takes `DrizzleD1Database`. Both share compatible Drizzle query interfaces — casting
  avoids a complex generic type parameter on `refreshFeed` while keeping production
  types correct.
- **`vi.stubGlobal("fetch")` for network mocking:** No network calls in tests.
  `fetch` is stubbed globally per test via `beforeEach`/`afterEach`.

### Dead ends / gotchas
- None.

## Increment 4 — RSS parsing + tests
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `packages/worker/src/lib/parse.ts` — `parseFeed(xml)` normalizes RSS 2.0 and Atom
  feeds into `ParsedFeed`. Handles: feed metadata (title, siteUrl, description, imageUrl),
  articles (url, title, summary, content, publishedAt), `content:encoded`, CDATA, Atom
  text constructs, Atom link rel filtering, fallback from `published` → `updated`.
- `packages/worker/src/lib/parse.test.ts` — 12 tests covering RSS 2.0, Atom, and edge
  cases (no image, no pubDate, invalid XML, unrecognized XML format).

### Decisions made
- **`fast-xml-parser` with `isArray` for `item`/`entry`:** Single-item feeds would
  otherwise return an object instead of an array. The `isArray` option forces consistent
  array output.
- **Filter articles with empty URL:** Articles with no resolvable URL are dropped
  rather than stored with an empty string, which would violate the `NOT NULL` constraint
  and cause upsert collisions.
- **`parseFeed` returns `null` on unrecognized format:** Caller decides how to handle
  (log and skip vs. error).

### Dead ends / gotchas
- `allowImportingTsExtensions: true` is required in `tsconfig.json` to import
  `./parse.ts` with the `.ts` extension in test files. Without it, tsc errors even
  though Vitest handles it fine at runtime.

## Increment 3 — DB schema + migration
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `packages/worker/src/db/schema.ts` — Drizzle schema for `feeds` and `articles` tables
  with all finalized columns, foreign key with `ON DELETE CASCADE`, and three explicit
  indexes on `articles`: `idx_articles_feed_id`, `idx_articles_read`, `idx_articles_published_at`
- `packages/worker/drizzle/0000_silly_rumiko_fujikawa.sql` — generated migration
- `packages/worker/drizzle/meta/` — drizzle-kit journal and snapshot

### Decisions made
- **Explicit index definitions in schema:** Drizzle does not auto-generate query
  indexes — only unique indexes. The three query indexes (`feed_id`, `read`,
  `published_at`) were added using `index()` in the third argument of `sqliteTable`.
- **`published_at` index is not DESC:** Drizzle's SQLite `index()` helper does not
  support descending index direction. A plain ascending index on `published_at` still
  helps the query planner for `ORDER BY published_at DESC` on small-to-medium datasets.

### Dead ends / gotchas
- Generated migration twice. First run lacked indexes (Drizzle only auto-generates
  unique indexes, not query indexes). Had to add `index()` calls to the schema and
  regenerate. The `drizzle/` folder was wiped and regenerated from scratch to get a
  clean `0000_` migration rather than `0001_`.

## Pre-commit hook — Biome + Husky
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `biome.json` — root biome v2 config: linter (recommended rules + `noUnusedImports: error`),
  formatter (2-space, 100 col, double quotes, trailing commas), file includes/excludes
- `.husky/pre-commit` — runs `pnpm lint-staged` then `pnpm type-check`
- `lint-staged` config in root `package.json` — biome lint + format on staged `*.ts/tsx/js/jsx`
- Root scripts: `lint`, `format`
- `husky` + `lint-staged` + `@biomejs/biome` installed as root devDependencies
- `pnpm.onlyBuiltDependencies` already present — no changes needed

### Decisions made
- **Biome over ESLint:** Same tool as vega repo. Single binary, no plugin ecosystem to
  manage, lint + format in one pass.
- **Tests run in pre-commit:** Originally type-check only, but changed to also run
  `pnpm test:run` as an agent guardrail — prevents agents from committing broken code
  without noticing. `--passWithNoTests` prevents failure before test files exist.
- **lint-staged for biome:** Only lints files staged for the current commit — avoids
  re-linting the entire repo on every commit.

### Options considered and discarded
- **lefthook:** Used by Kumo repo. Rejected because husky is simpler, already used
  by vega, and works well with pnpm workspaces.
- **Running tests in pre-commit:** Rejected — test suite will grow and a slow hook
  gets bypassed with `--no-verify`. Type-check catches the most common class of errors.

### Dead ends / gotchas
- Biome v2 changed the config schema from v1. `organizeImports` is now under
  `assist.actions.source`, and `files.ignore` is now `files.includes` with `!` prefixes.
  Running `biome migrate --write` fixed this automatically.
- `biome lint --write` does not apply "unsafe" fixes — the `process.env["KEY"]` →
  `process.env.KEY` suggestion required manual edits despite being trivially safe.

## Increment 2 — Worker package scaffold
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `packages/worker/package.json` — `@cloud-reader/worker`, deps: `drizzle-orm`, `fast-xml-parser`, `@cloud-reader/types`; devDeps: `wrangler`, `drizzle-kit`, `vitest`, `@cloudflare/workers-types`
- `packages/worker/tsconfig.json` — extends root, adds `@cloudflare/workers-types`
- `packages/worker/wrangler.jsonc` — D1 binding (placeholder `database_id` until increment 9), hourly cron trigger
- `packages/worker/drizzle.config.ts` — `d1-http` driver, credentials from env vars
- `packages/worker/vitest.config.ts` — Node environment, `src/**/*.test.ts`
- `packages/worker/src/worker/index.ts` — minimal stub with correct `Env` interface and placeholder handlers
- Root `package.json` updated with `pnpm.onlyBuiltDependencies` to approve native build scripts for `esbuild`, `sharp`, `workerd`

### Decisions made
- **`database_id: "placeholder"`** in `wrangler.jsonc` — actual ID requires running
  `wrangler d1 create` which needs CF credentials. Deferred to increment 9.
- **`drizzle.config.ts` uses env vars for credentials** — `CLOUDFLARE_ACCOUNT_ID`,
  `CLOUDFLARE_DATABASE_ID`, `CLOUDFLARE_D1_TOKEN`. These are only needed for
  `drizzle-kit studio` / remote operations, not for local dev or tests.
- **`pnpm.onlyBuiltDependencies`** in root `package.json` — pnpm v9+ requires
  explicit approval for packages that run install scripts. Added `esbuild`, `sharp`,
  `workerd` (wrangler's runtime binary).

### Dead ends / gotchas
- `ScheduledEvent` is the wrong type for the `scheduled()` handler — the correct
  type is `ScheduledController`. `ScheduledEvent` is the DOM event interface.
  Fixed before committing.

## Increment 1 — Shared types package
**Date:** 2026-03-27
**Status:** Complete

### What was built
- `packages/types/package.json` — `@cloud-reader/types` workspace package
- `packages/types/tsconfig.json` — extends root tsconfig
- `packages/types/src/index.ts` — canonical types:
  - `Feed`, `NewFeed`
  - `Article`, `UpdateArticle`
  - `RefreshResult`, `ApiError`
  - `ParsedFeed`, `ParsedFeedMeta`, `ParsedArticle` — internal shape from parser

### Decisions made
- **No runtime code:** Package is types-only. The `exports` field points directly
  to `src/index.ts` — no build step needed for a types-only package.
- **`ParsedFeed` types included here:** Even though `parse.ts` lives in the worker,
  the parsed feed shape is defined in types so the CLI could eventually use it too
  if it ever parses feeds locally.
- **`read` stays as `number` (not `boolean`):** SQLite stores booleans as integers.
  The `Article` interface reflects the DB representation (`0` / `1`) to avoid
  silent coercion bugs. The API layer converts to boolean when needed.

### Options considered and discarded
- **Separate `ParsedFeed` types in worker:** Rejected — if the CLI ever parses feeds
  locally, it would need to duplicate these types. Defining them in `@cloud-reader/types`
  is free and keeps the canonical source clear.

### Dead ends / gotchas
- None.

---

## Post-phase-2 fixes and features
**Date:** 2026-03-28
**Status:** Complete

### What was built

**Content rendering**
- Added `marked` for markdown → HTML conversion in `ArticleReader`
- Heuristic: content with HTML tags treated as raw HTML, otherwise parsed as Markdown
- Applied same renderer to `summary` fallback path
- Added `@tailwindcss/typography` so `prose` classes apply typographic styles

**Article sort order**
- Toggle button in `ArticleList` header — newest/oldest first (default: newest)
- Local state in `ArticleList`, resets on feed change
- Falls back to `createdAt` for articles with no `publishedAt`

**Article title as link**
- `ArticleReader` title is an `<a>` opening the original URL in a new tab
- Conditionally rendered — plain `<span>` if no URL

**Site name in article reader**
- `ArticleReader` receives `feed` prop, passed from `App` via `selectedArticleFeed`
- Displays `feed.title · date` below title, separator only shown when both present

**Site name on article cards**
- `ArticleList` receives `feedsById: Record<string, Feed>` from `App`
- Feed title shown on each card in "All articles" view only

**HTML entity decoding**
- Replaced manual regex entity list with `DOMParser`
- Handles all named and numeric entities (`&#8217;`, `&mdash;`, etc.) in one pass

**Dark mode toggle**
- Moon/sun icon in sidebar footer, state in `App.tsx`
- Initialises from `window.matchMedia("(prefers-color-scheme: dark)")`
- Sets `document.documentElement.style.colorScheme` — Kumo's `light-dark()` tokens respond automatically

**GitHub source link**
- `GithubLogoIcon` + "Source code" in sidebar footer, opens repo in new tab

### Decisions made
- **`DOMParser` over regex:** Browser's own HTML parser handles every entity correctly. Previous regex only covered a handful of named entities.
- **`marked` over custom renderer:** Small, fast, zero deps, synchronous mode works in React render.
- **Dark mode via `colorScheme` not `.dark` class:** Kumo explicitly uses CSS `light-dark()` which responds to the `color-scheme` property, not a class toggle.
- **Sort is client-side only:** API returns all articles already; a `?sort=` param adds API complexity for no real benefit at current scale.

### Dead ends / gotchas
- `Toasty.Provider` / `Toasty.Viewport` don't exist — `Toasty` is a flat component. Removed; toast notifications deferred to phase 3.
- Biome CSS linter flags Tailwind v4's `@source` directive as invalid. Fixed by setting `css.linter.enabled: false` in `biome.json`.
- `useCallback` dependency order: `handleAddFeed` referenced `handleRefreshFeed` before declaration with an empty dep array. Biome's `useExhaustiveDependencies` caught this at pre-commit. Fixed by reordering.

---

## UI polish
**Date:** 2026-03-28
**Status:** Complete

### What was built

**Article reader layout**
- Toolbar moved to a slim top bar (mark read + open external); header moved into the
  scrollable content area so it scrolls with the article
- Content constrained to `max-w-2xl` centred column for comfortable line length
- Title bumped to `text-3xl font-bold` with tight tracking
- `prose` / `prose-sm` classes dropped — replaced with a hand-rolled `.article-body`
  class in `app.css` that uses Kumo CSS variables (`var(--color-kumo-*)`) directly,
  giving correct dark mode behaviour for headings, links, code, blockquotes, lists, images

**Article list cards**
- `bg-kumo-base` added to both the populated and empty-state variants so all three
  panes share the same background colour
- "New" `Badge` replaced with a small `h-2 w-2 rounded-full bg-kumo-brand` dot —
  less visually noisy
- Spacing tightened: `mt-1.5` on summary, `mt-2` on metadata row, `gap-1.5` between metadata items
- Separator dot between site name and date in the metadata row

### Decisions made
- **Hand-rolled `.article-body` CSS over `prose`:** Tailwind Typography's `prose`
  classes don't use Kumo's CSS variables, so colors break in dark mode. The custom
  class is ~80 lines and covers all the cases we need.
- **`bg-kumo-base` on all panes:** Kumo's sidebar already has its own background.
  Explicitly setting `bg-kumo-base` on the article list and reader ensures they
  switch correctly with the dark mode toggle instead of defaulting to the browser's
  background color.

### Dead ends / gotchas
- Missing `bg-kumo-base` on `ArticleList` caused the cards to appear a different
  shade from the sidebar and reader panes. Both the populated and empty-state
  branches of the component needed the class added.

---

## Sidebar polish + refresh button reorganisation
**Date:** 2026-03-28
**Status:** Complete

### What was built

**Sidebar width and resizability**
- `Sidebar.Provider` now has `defaultWidth={280}` (up from Kumo's ~240px default),
  `minWidth={220}`, and `resizable` — drag the edge to any width

**Sidebar layout cleanup**
- "All articles" moved into its own `Sidebar.Group` above a `Sidebar.Separator`,
  so it's visually distinct from the per-feed list
- "Feeds" group label moved to the feed list group where it's contextually correct
- Footer dark-mode toggle and GitHub link converted to proper `Sidebar.MenuButton`
  items (with icons), replacing the custom `<div>` + `<Button>` combo
- `PlusIcon` added to "Add feed" for consistent icon treatment across footer items

**Refresh button reorganisation**
- Removed per-feed `Sidebar.MenuAction` refresh icons from every feed row — too cluttered
- Added a single refresh-all `Sidebar.MenuAction` next to "All articles" — spins while
  running, uses `Promise.allSettled` so one failing feed doesn't block others
- Added per-feed refresh button in the `ArticleList` header — only shown when a single
  feed is selected, hidden on "All articles" view

### Decisions made
- **Refresh-all on sidebar, per-feed refresh in article list header:** Matches the
  mental model — the sidebar is navigation, the article list header is context for
  the current view. Refresh belongs in the context, not the nav.
- **`Promise.allSettled` for refresh-all:** Consistent with the cron handler. One
  bad feed URL shouldn't block all others from refreshing.

### Options considered and discarded
- **Per-app colour theming (Solarized, Tokyo Night, Dracula, Nord etc.):** Explored
  but rejected. Kumo owns its component colours via CSS `light-dark()` and `--color-kumo-*`
  variables. Theming only the parts we own (article body, cards) while Kumo's chrome
  stays neutral would look fragmented. Deferred indefinitely.

### Dead ends / gotchas
- None.

---

## Delete feed button
**Date:** 2026-03-28
**Status:** Complete

### What was built
- `TrashIcon` button in `ArticleList` header — only shown when a single feed is selected
- Two-step inline confirmation: click trash → "Confirm" / "Cancel" appear in the header
- `handleDeleteFeed` in `App.tsx`: calls `feedsApi.delete(id)`, clears `selectedFeedId`,
  `articles`, and `selectedArticleId` — returns UI to global "All articles" view
- `onDeleteFeed` prop on `ArticleList` (`(() => void) | null`)

### Decisions made
- **Inline confirm/cancel over a dialog:** A modal for a single destructive action is
  heavy. Inline confirm keeps the interaction in-place and dismisses cleanly with Cancel.
- **Delete returns to "All articles":** Avoids a broken empty pane for the deleted feed.
- **Header location over sidebar:** Delete is contextual to the current feed view — the
  article list header is the right place. Keeps the sidebar clean.

### Dead ends / gotchas
- None.

---

## Aesthetic improvements
**Date:** 2026-03-28
**Status:** Complete

### What was built
- **`app.css`** — `font-family: Georgia, "Times New Roman", serif` on `.article-body`
- **`ArticleList`** — article count inline with title (`All articles · 42`), removed separate count line
- **`ArticleList`** — left border accent on unread cards (`border-l-2 border-kumo-brand`), transparent border on read cards to preserve layout stability
- **`ArticleList`** — read cards `opacity-60` for clearer visual hierarchy
- **`ArticleList`** — article list pane widened from `w-80` (320px) to `w-96` (384px)
- **`ArticleReader`** — toolbar: `bg-kumo-surface` background, `py-3` padding
- **`ArticleReader`** — mark-read button fixed `w-32` to prevent layout shift on label change
- **`ArticleReader`** — `<hr>` separator between article header and body

### Decisions made
- **Both border and tint on selected+unread:** The blue left border is a read/unread indicator; the tint is a selection indicator. They're orthogonal so both show simultaneously.
- **Transparent border on read cards:** Using `border-transparent` rather than no border keeps all cards the same total width — prevents layout shift when items transition read↔unread.
- **`opacity-60` on read cards:** More visually effective than just dimming the title text alone, which was easy to miss.

### Dead ends / gotchas
- None.

---

## Fix: fast-xml-parser entity expansion limit
**Date:** 2026-03-28
**Status:** Complete

### What was built
- `processEntities: { maxTotalExpansions: 100000 }` in `XMLParser` config in `src/lib/parse.ts`
- Regression test added: feeds with >1000 HTML entities in `content:encoded` now parse correctly

### Root cause
`fast-xml-parser` defaults to `processEntities: true` (boolean), which sets `maxTotalExpansions: 1000`.
Feeds with full article content in `content:encoded` encode all HTML as XML entities (`&lt;`, `&gt;`,
`&amp;`, etc.). A feed with 82 articles easily exceeds 10,000 entity expansions. Parser threw
`Entity expansion limit exceeded`, `parseFeed()` returned `null`, Worker returned 502.

### Dead ends / gotchas
- `entityExpansionLimit` is not a valid XMLParser option.
- `htmlEntities: { maxTotalExpansions: ... }` does not control this path — it's a separate option.
- 10,000 was not enough either — the feed has >10,000 entity expansions across 82 articles. Set to 100,000.

---

## Feed list sidebar redesign
**Date:** 2026-03-28
**Status:** Complete

### What was built
- Replaced `Sidebar.MenuButton` + `Badge` pattern in the feeds list with a custom `<button>` per feed item
- Unread count now on the left as a small brand-colored number, aligned to the top of the text
- Feed title wraps (no `truncate`) so full site names are readable
- `py-2.5` + `gap-0.5` between items gives more vertical breathing room
- Active state uses `bg-kumo-tint font-medium text-kumo-strong` to match Kumo's own active style

### Decisions made
- **Custom `<button>` over `Sidebar.MenuButton`:** `Sidebar.MenuButton` is a fixed single-line
  component — it truncates text and doesn't support left-side count placement. Custom button
  gives full layout control while still using Kumo colour tokens for hover/active states.
- **Unread count on left as plain number:** More scannable than a right-aligned badge.
  A placeholder `<span>` of the same width is used when count is 0 to keep text aligned.

### Dead ends / gotchas
- None.

---

## Default to light mode
**Date:** 2026-03-28
**Status:** Complete

### What was built
- `isDark` in `App.tsx` initialises to `false` instead of reading from `window.matchMedia`

### Decisions made
- **Light mode default over OS preference:** The app looks better in light mode at this
  stage of polish. The toggle is still available for users who prefer dark. Removing the
  `matchMedia` call also avoids a flash of dark mode on first load for OS dark mode users.

---

## Platform migration: Cloudflare Workers + D1 → Vercel + Turso + GitHub Actions
**Date:** 2026-10-10
**Status:** Complete (code side; Vercel project import + Turso provisioning pending)

### What was built
- `packages/worker/src/db/client.ts` — new libsql client singleton (`getDb()`), reads
  `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` env vars; supports `libsql://` (Turso) and
  `file:` (local dev) URLs. Exports the canonical `DB` type (`LibSQLDatabase<typeof schema>`).
- `packages/worker/src/worker/index.ts` — dropped D1 binding + `ExportedHandler` +
  `scheduled()`; `createApp()` unchanged otherwise. No platform bindings left.
- `refresh.ts` / `cron.ts` / all 4 route+test files — `DrizzleD1Database` → `DB`;
  removed all `db as never` casts in tests (types now align exactly).
- `src/db/ddl.ts` — extracted shared CREATE statements; used by `test-helpers.ts`
  (in-memory test DB) and new `scripts/local-db.ts` (local file DB init).
- `api/[[...route]].ts` + `api/tsconfig.json` — Vercel serverless entry, Hono app
  adapted via `hono/vercel` `handle()`. Routes stay full-path (`/api/feeds`).
- `vercel.json` — `pnpm --filter @cloud-reader/app build` → `packages/app/dist`,
  SPA fallback rewrite excludes `/api/`.
- `.github/workflows/refresh.yml` — hourly cron + manual dispatch; runs
  `scripts/refresh.ts` (tsx) against Turso. Secrets: `TURSO_DATABASE_URL`,
  `TURSO_AUTH_TOKEN`.
- `scripts/dev.ts` — `@hono/node-server` dev server on :8787 (Vite proxy target
  unchanged). `scripts/refresh.ts` — one-shot cron replacement.
- `drizzle.config.ts` — `dialect: "turso"`, credentials from `TURSO_*` env vars.
- `package.json` (worker): `@libsql/client` moved to dependencies; added
  `@hono/node-server`, `@types/node`, `tsx`; wrangler kept only for the one-time
  `db:export-d1` (D1 dump). Root: added `hono`, `typescript`, `@types/node`;
  type-check now also covers `api/`.
- Docs: AGENTS.md (stack/decisions/cron→Actions/deployment/commands), README.md.

### Decisions made
- **Turso over D1:** user's real-world testing shows Vercel + custom domain is
  faster from mainland China than Cloudflare — that measurement beat any
  benchmark, so platform moved. Turso keeps the SQLite/Drizzle schema as-is.
- **GitHub Actions over Vercel Cron:** Hobby plan limits cron to daily; Actions
  gives hourly free and runs identical `runCron()` code in full Node.
- **Full-path Hono routes:** `hono/vercel` `handle()` passes the original URL
  through, so existing `/api/*` routes needed zero changes.
- **Env-var DB config (no bindings):** same code path on Vercel / Actions /
  local; `file:` URLs make offline dev trivial.

### Dead ends / gotchas
- `@libsql/client` `createClient({ authToken: string | undefined })` fails under
  `exactOptionalPropertyTypes` — must pass `authToken` only when defined.
- pnpm incremental installs in this sandbox kept failing with
  `ERR_PNPM_CODEBUDDY_BROKER_DENY` (ENOENT/EEXIST on symlink creation mid-reify,
  different package each run). Clean delete of all `node_modules` + one fresh
  `pnpm install` fixed it reliably — do that instead of retrying incremental.
- Removed `workerd` from `pnpm.onlyBuiltDependencies` (its build script is
  ignored now; wrangler d1 export doesn't need the workerd binary).

### Remaining (outside repo)
1. Create Turso DB: `turso db create cloud-reader --location sin` (or hkg),
   `turso db tokens create`, optional `turso db replicas add hkg`.
2. Apply schema: `db:migrate` with TURSO_* env vars (drizzle/0000_*.sql).
3. Migrate data: `db:export-d1` → `turso db shell <db> < dump.sql`; remove
   wrangler dep + `db:export-d1` script afterwards.
4. Import repo in Vercel, set env vars, bind domain; delete the CF Worker.
5. Add the two secrets to GitHub repo; trigger `workflow_dispatch` once.

---

## Fix Vercel FUNCTION_INVOCATION_FAILED (CJS deps in esbuild-ESM bundle)
**Date:** 2026-10-10
**Status:** Complete (verified locally via esbuild bundle repro; awaiting redeploy)

### Root cause
`@libsql/client` (all entries, incl. `/web`) statically pulls:
`@libsql/hrana-client/index.js` → `@libsql/isomorphic-ws` → `ws` (CJS), and
`cross-fetch` → `node-fetch` (CJS). Under `@vercel/node`'s esbuild-ESM
bundling, those CJS packages throw `Dynamic require of "stream"/"path" is not
supported` at module load → every function invocation dies before our code
runs (FUNCTION_INVOCATION_FAILED, even for /api/health).
Additionally `drizzle-orm/libsql/driver.js` imports `@libsql/client` (Node
entry → native libsql binding) at runtime even when a client is injected.

### What was built
- `src/db/client.ts`: static import of `@libsql/client/web` (pure JS HTTP);
  sync `getDb()`; rejects `file:` URLs (dev-only path is scripts/dev.ts).
- `scripts/dev.ts`: builds a Node client (supports `file:local.db`) and
  injects it via `createApp(dbOverride)`.
- pnpm patches (patches/ dir, registered in package.json):
  - `@libsql/isomorphic-ws@0.1.5` — node entry uses `globalThis.WebSocket`,
    drops `ws` import.
  - `@libsql/hrana-client@0.9.0` — index.js/http/client.js/http/stream.js use
    global `fetch/Request/Headers/WebSocket` instead of cross-fetch/isomorphic-ws.
  - `drizzle-orm@0.41.0` — libsql/driver.js imports `@libsql/client/web`.
- `/api/health` now pings `SELECT 1` and returns 503 + concrete DB error;
  `app.onError` returns `{error}` JSON; TURSO_* env values are trimmed.
- Local repro harness: esbuild bundle of `api/[[...route]].ts` + node run with
  fake Turso creds — before patches: `Dynamic require of "stream"` crash
  (matches production); after: graceful 503 JSON.

### Decisions made
- Patch polyfills instead of replacing the driver: Node 18+ has all globals
  the patched code needs; ws:// transport is unused (HTTP-only via Turso).
- Static web-client import instead of runtime branch: @vercel/node's file
  tracer misses dynamic-import chunks; static pure-JS is the safest shape.

### Dead ends / gotchas
- Upstream has no fix as of @libsql/client@0.18.0 / hrana-client@0.10.0 —
  static isomorphic-ws import is still there. Re-check when upgrading.
- drizzle-orm/libsql pulls the Node client even for injected clients — patch
  driver.js, or expect native-libsql crashes on serverless.
- Local pnpm install repeatedly SIGKILLed in this environment while applying
  patches (exit 137). Verify patch application on Vercel build logs.

---

## Increment — Sidebar UI fixes + Kumo Tailwind `@source` path bug
**Date:** 2026-10-10
**Status:** Complete (uncommitted)

### What was built
- `packages/app/src/app.css`: fixed `@source` path for Kumo scanning —
  `../../node_modules/...` → `../node_modules/...`. From `packages/app/src/`,
  `../../` resolves to `packages/node_modules` (doesn't exist), so Tailwind v4
  was silently scanning nothing in Kumo's dist. Built CSS grew 32KB → 127KB.
- `packages/app/src/components/FeedSidebar.tsx`:
  - Moved `<Sidebar.Trigger />` from Footer to Header, right-aligned via
    `ml-auto` next to the "cloud-reader" title.
  - Title span hides when sidebar collapses:
    `group-data-[state=collapsed]/sidebar:hidden` (Kumo idiom, prevents text
    overflowing the 3rem icon rail).

### Decisions made
- No custom CSS for the refresh button: the misalignment was purely the
  missing Tailwind classes. Kumo's `MenuAction` is already
  `absolute right-1.5 top-1/2` — once `@source` works, it right-aligns onto
  the "All articles" row by itself.

### Dead ends / gotchas
- **Tailwind v4 `@source` failures are silent** — wrong glob path just yields
  missing utilities, no error/warning. Symptom in UI: `MenuAction` rendered
  in normal flow below the button, left-aligned; any kumo-only class
  (`bg-kumo-overlay`, `group-data-*`) absent from built CSS while app-source
  classes were present. Verify with `grep -c "bg-kumo-overlay" dist/assets/*.css`.
- Kumo ships zero structural CSS for Sidebar (`kumo.css` has no
  `[data-sidebar]` rules) — everything depends on the Tailwind scan.

### Correction (same increment, 22:35)
- Trigger-in-header v1 was wrong: put on the same row as the title with
  `ml-auto`. Two problems: (1) user wanted it *below* the title row,
  right-aligned; (2) in collapsed 3rem mode the flex row overflowed
  (icon 20 + gap 8 + trigger 26 > 32px content) and the trigger got clipped
  → impossible to re-expand.
- Final layout: Header row 1 = RSS icon + title, hidden entirely when
  collapsed; row 2 = `<Sidebar.Trigger />` in `flex justify-end px-2 pb-2`.
  Trigger survives collapse and stays reachable.

---

## Production debugging: three fixes to make reader.wesync.cn fully work
**Date:** 2026-10-10
**Status:** Complete — all API endpoints verified live

1. **Pre-bundled function**: patches alone didn't stop FUNCTION_INVOCATION_FAILED
   (@vercel/node pipeline still crashed at module load while the equivalent
   local esbuild bundle ran). Shipped a committed self-contained CJS bundle
   (`api/index.js`, regenerate via `pnpm build:api`; source is
   `packages/worker/src/vercel-entry.ts`, biome excludes `api/**`).
2. **Catch-all only matches one segment** under framework:null — multi-segment
   paths 404'd at the edge (x-vercel-error: NOT_FOUND, function never invoked).
   Fix: rewrite `{ "source": "/api/(.*)", "destination": "/api/index" }`.
3. **Feeds 403'd without a UA**: refresh.ts now sends a browser UA + Accept.
   Note: ruanyifeng.com blocks Vercel datacenter IPs outright (UA-independent).

Verified live: health (db connected), create/list/delete feeds, per-feed
refresh (sspai: +10 articles), article listing.

### Correction 2 (22:40)
- Root cause of "trigger still on title row": kumo `Sidebar.Header` is itself
  `flex items-center gap-2` — my two row divs became side-by-side children.
  Fix: `<Sidebar.Header className="flex-col items-stretch gap-1 py-2">`.
- Collapsed clipping: header has built-in `px-2` + `overflow-hidden`; nested
  `px-2` on the trigger row left only 16px for a 32px button in 3rem mode.
  Fix: padding lives only on the Header, rows are padding-free.
- Right panes were NOT broken — kumo `Empty` now renders its real card style
  (was invisible pre-@source-fix). Added breathing room: list empty container
  `p-4`; reader empty container `p-6` + `max-w-lg` wrapper so the card stops
  spanning the full 900px pane edge-to-edge.
- Verified via Playwright (1440x900): trigger right-aligned below title
  (x=239..271 of 280), visible and clickable when collapsed, re-expand works
  (width back to 280).

### Correction 3 (22:49) — final header layout
- User verdict: two-row header too tall. Reverted to single row: RSS icon +
  title + `Trigger className="ml-auto"` on the same line, trigger
  right-aligned (gap 9px). Collapsed mode: icon + title hidden via
  `group-data-[state=collapsed]/sidebar:hidden`, trigger alone fits the 3rem
  rail exactly (32px in 32px content width), visible and clickable.
  Verified via Playwright: same row as title, right-aligned, collapse +
  re-expand cycle works.

---

## Frontend rewrite: Reeder-style minimal UI (drop Kumo)
**Date:** 2026-10-10
**Status:** Complete — verified locally against production API via static+proxy preview

### Why
The Kumo-based UI had polluted list cards (raw HN metadata in summaries), raw
URLs in the sidebar for untitled feeds, a fixed 3-pane layout that wasted 2/3
of the screen on an empty reader pane, no visible error state for failing
feeds, and a generic default look. User chose a full frontend rewrite over
incremental fixes (option A: Reeder-like minimal).

### What was built
- `app.css` rewritten: semantic tokens via Tailwind v4 `@theme inline` +
  CSS `light-dark()` (canvas/panel/card/line/ink/ink-2/ink-3/accent), warm
  paper palette, hand-styled `.article-body` (serif, 65ch measure).
- `lib/display.ts`: `cleanSummary()` (strips HTML + HN metadata blocks),
  `relativeTime()`, `feedDisplayName()` (hostname fallback), deterministic
  letter-avatar colors, theme persistence (localStorage).
- `components/icons.tsx`: inline SVG icon set (replaces @phosphor-icons).
- `FeedSidebar` (mobile drawer + scrim, letter avatars, hover-delete),
  `ArticleList` (clean cards: title/clean summary/source/relative time/unread
  dot, accent selection bar, sort + refresh in header), `ArticleReader`
  (centered 65ch, toolbar: mark-unread / original), `AddFeedDialog`
  (hand-rolled modal), `App` (mobile list/reader swap, no Kumo Sidebar).
- Removed deps: `@cloudflare/kumo`, `@phosphor-icons/react`,
  `@tailwindcss/typography`, `zod`. Bundle: 525 KB → 254 KB (gzip 163 → 80 KB).
- Local preview trick: single Node server serving `packages/app/dist` with
  `/api/*` forwarded to production — screenshot-verified all states with real
  data before deploying.

### Deferred
- Full-content fetching (readability) — sspai-style summary-only feeds still
  show a stub in the reader (phase 2; linkedom is the candidate, pure JS).
- Feed-level error surfacing (failing feeds look idle today; needs a schema
  column + API field).

### Gotchas
- `@theme inline` + `light-dark()` is the only dark-mode mechanism; adding
  `dark:` classes would be a style regression.
- Port 8787 on this machine is held by an unrelated long-running node process —
  the local preview trick (static + proxy in one server) avoids it entirely.

---

## Increment — Rename cloud-reader → Reed
**Date:** 2026-10-10
**Status:** Code complete — dependency reinstall + pre-commit checks pending on user's machine

### Why
User disliked the original name. "Light RSS" was proposed and rejected: "Light"
is a generic prefix and sells the architecture (lightweight) instead of the
experience. Chose **Reed** — reads as "RSS + read", short, brandable, and the
future CLI binary (`reed`) gets a clean command name. Alternatives considered:
Skim (skim-reading), River (Dave Winer's "River of News"), Drift.

### What was done
- Package scope `@cloud-reader/*` → `@reed/*` everywhere: root/worker/app/types
  `package.json`, `vercel.json` buildCommand, `refresh.yml` filter, all imports.
- Brand display: sidebar title + `index.html` `<title>` → "Reed"; README and
  AGENTS.md headers → "Reed".
- localStorage theme key `cloud-reader-theme` → `reed-theme` (one-time theme
  reset for the single user; acceptable).
- Descriptive comments in worker scripts, `ddl.ts`, types, and libsql patches
  updated; WORKLOG historical entries intentionally left as-is (they describe
  past reality, incl. the old workers.dev URL).

### Not done here (manual / user machine)
- GitHub repo rename (steley/cloud-reader → steley/reed) + `git remote set-url`.
- Local folder rename `~/Sites/cloud-reader` → `reed`.
- Vercel project name (optional; custom domain unaffected).
- `pnpm install` to regenerate the lockfile (still contains @cloud-reader
  importer names; a successful install rewrites it automatically).
- The sandbox blocked every pnpm install attempt (ERR_PNPM_CODEBUDDY_BROKER_DENY,
  symlink ENOENT/EEXIST at random packages, even after full node_modules delete,
  retry loop, and `--force`). User is running the install locally; lint,
  type-check and tests must pass before committing.

### Gotchas
- Worklog header replacement had to run as a second pass because WORKLOG.md was
  deliberately excluded from the global find/replace list.

---

## Increment — Logo + favicon
**Date:** 2026-10-10
**Status:** Complete

### What was built
- Hand-written SVG mark: three wind-swept reed stalks (ink stems, ember plumes
  with a `#d9480f → #ff8a3d` gradient) matching the app's warm-paper palette.
- `packages/app/public/logo.svg` — bare mark on transparent bg (README use).
- `packages/app/public/favicon.svg` — rounded warm tile, embeds a
  `prefers-color-scheme: dark` block (dark bg / light stems / lighter plume
  gradient), so the favicon adapts in modern browsers.
- `favicon.png` (32) + `apple-touch-icon.png` (180, full-bleed square) rendered
  from the SVG via headless Chromium (Playwright, data-URI img — file://
  subresources from `about:blank` pages are blocked, first attempt produced
  broken-image PNGs).
- `index.html`: svg+png favicon links, apple-touch-icon, light/dark
  theme-color meta. README gets the logo under the H1.
- Vite `public/` → `dist/` copy verified by build.

### Design note
First pass (fat plumes + 11px stems) read as matches; second pass slimmed
stems to 8px, narrowed plumes and unified the lean — reads as reeds down to
32px. Kept flat/no outlines, consistent with the hand-rolled Reeder-style UI.
