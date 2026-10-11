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

## Production debugging: three fixes to make the production site fully work
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

---

## Increment — README homepage screenshot
**Date:** 2026-10-11
**Status:** Complete

### What was done
- Playwright headless Chromium shot the production homepage (1440×900 @2x,
  light scheme, networkidle + 1.2s settle) → `docs/screenshot.png` (~264 KB).
- Embedded under the README tagline. Per AGENTS.md rule 5 the URL used for
  shooting lives outside git — the README image path is relative, no hostname
  committed.

### Gotchas
- `docs/` didn't exist; created it. Screenshot contains the user's own feed
  list (public HN/少数派 titles) — accepted by the user when requesting the
  public-README embed; re-shoot if they ever add private feeds.

---

## Increment — favicon cache-busting
**Date:** 2026-10-11
**Status:** Complete

### What was done
- User reported the tab still showed the old RSS icon. Verified production:
  live `/favicon.svg` and `/favicon.png` md5-match the local build — the new
  reed logo IS deployed. Root cause: browser favicon cache (favicons are
  cached aggressively and often survive hard reload).
- Fix: appended `?v=2` to the three icon links in `index.html` so browsers
  treat the URL as changed and refetch. Bump the version on any future icon
  change.

### Gotchas
- Vite copies `public/` verbatim; file contents are fine — only the HTML
  references needed the bust.

---

## Increment — ReedMark weight + size bump
**Date:** 2026-10-11
**Status:** Complete

### What was done
- User: sidebar mark "too faint, too small". Confirmed via Playwright
  screenshot of local dev (8787 API + Vite 5173, seeded local.db): at 18px
  with 1.7px strokes the mark read as a faint smudge next to the bold
  wordmark.
- Redrew ReedMark: strokeWidth 1.7→2.2, ground 1.5→1.8, default size 18→20,
  plumes enlarged and swept further right. Sidebar renders it at 22px.
- Verified with a 6x element screenshot — stems read as ink, plumes visible.

### Gotchas
- drizzle-kit `turso` dialect refuses `file:` URLs with empty authToken, so
  the local dev db can't be migrated via `pnpm db:migrate`; applied
  `drizzle/*.sql` straight with sqlite3 instead. local.db is gitignored.

---

## Increment — Repo legibility: bundle docs, stale refs, drift check
**Date:** 2026-10-11
**Status:** Complete

### Why
User cloned the repo fresh and found it confusing. Audit showed the structure
itself is fine (standard pnpm monorepo); the confusion came from three fixable
things: a 464 KB generated `api/index.js` at the root with nothing pointing at
its source (the why lives only mid-WORKLOG), stale doc claims (README stack
table still listed the removed @cloudflare/kumo; AGENTS.md described the
removed `api/[[...route]].ts` catch-all), and an unexplained `patches/` dir.

### What was done
- README: stack table kumo → hand-rolled + Tailwind v4; structure tree marks
  `api/` as generated; deployment section explains the pre-bundled function
  and the regenerate-and-commit workflow.
- AGENTS.md: `api/` tree entry + "Vercel serves…" decision updated to the
  bundle reality; new "Pre-bundled API function" and "Dependency patches"
  decision sections; pre-commit hook list gains the bundle step.
- Pre-commit hook: regenerate the bundle (`pnpm build:api`) and fail on
  `git diff --exit-code api/index.js`, catching a stale committed bundle.

### Options considered and discarded
- Stop committing the bundle and build it in `vercel.json` buildCommand —
  cleanest repo (no 464 KB blob in git) but changes deploy behaviour that
  currently works; conservative option (keep + verify) chosen. Revisit if
  bundle churn gets annoying.
- Rename `packages/worker` → `packages/api` (the name is a Cloudflare-era
  leftover). Deferred: 18 refs across 5 files incl. the Actions workflow;
  mechanical but deploy-touching for a cosmetic gain.

### Gotchas
- Verified first that `pnpm build:api` is deterministic (rebuild produced a
  byte-identical `api/index.js`) and that biome excludes `api/**` — otherwise
  lint-staged would reformat the bundle and permanently break the drift check.
- `git diff --exit-code` (worktree vs index) is the right comparison: it
  catches both "regenerated but not staged" and "stale copy staged".
- The husky wrapper runs hooks under `sh -e`, so a failed `pnpm build:api`
  aborts the commit on its own; the explicit `exit 1` covers the diff
  mismatch path.

---

## Increment — Ponytail audit: 9 over-engineering cuts
**Date:** 2026-10-11
**Status:** Complete

### Why
Whole-repo over-engineering audit (ponytail-audit) found ~75 lines of dead
code, duplication, and speculative flexibility. Repo is otherwise lean; no
dependencies flagged.

### What was cut
- `src/db/ddl.ts` — 34 lines of hand-written CREATE statements duplicated the
  generated `drizzle/0000_*.sql`. Now a ~10-line loader that concatenates all
  `drizzle/*.sql` (sorted), so the migrations are the single source of schema
  truth. `executeMultiple` handles the `--> statement-breakpoint` comments
  fine — all 45 tests pass against the migration-loaded schema.
- `Env` type (`Record<string, string>`) in `worker/index.ts` — bindings never
  read; the comment admitted it existed "for route typing consistency". All
  three Hono generics are now `{ Variables: Variables }`.
- App `ApiError` class — `.status` was never read anywhere; plain
  `throw new Error(...)` now. The `ApiError` interface in `@reed/types` had
  zero imports; deleted.
- App.tsx articles-load `useEffect` re-implemented `reloadArticles` (declared
  one block below); now calls it.
- `isUnread()` helper — inlined as `article.read === 0` (App.tsx already
  inlined it twice); unused `Article` type import dropped from display.ts.
- `marked.parse(raw, { async: false })` — `async: false` already set via
  module-level `setOptions`; per-call option dropped.
- Stale api.ts header comment ("wrangler dev server" — Cloudflare-era
  leftover) now describes the actual Vercel/scripts-dev.ts setup.
- App package echo `test`/`test:run` scripts — `pnpm -r run test` silently
  skips packages without the script, so the placeholders were scaffolding.

### Decisions made
- **Migration files as the only DDL:** drizzle-kit generates them anyway for
  `db:migrate`; reading them in tests/local-db removes the drift risk instead
  of managing two copies. Side benefit: resolves the earlier gotcha where
  local.db had to be migrated "straight with sqlite3" — `db:local` now runs
  the real migration SQL via the same loader.
- **Deliberately NOT cut:** drizzle for this query size and the committed
  `api/index.js` bundle (both settled decisions), the refresh N+1 select/insert
  loop (boring beats clever for an upsert that must count added vs updated),
  `totalUnread` via full-list fetch (perf, out of audit scope).

### Gotchas
- Moving the articles-load effect to use `reloadArticles` requires it to be
  declared *before* the effect — biome's `noInvalidUseBeforeDeclaration` and
  tsc both flag the hoisted reference.

---

## Increment — CI pnpm version conflict fix
**Date:** 2026-10-11
**Status:** Complete

### What was built
- Removed the explicit `version: 9` input from the `pnpm/action-setup@v4`
  step in `.github/workflows/refresh.yml`. The action now reads
  `packageManager: pnpm@9.15.9` from the root `package.json` automatically.

### Gotchas
- The Actions run was failing with `ERR_PNPM_BAD_PM_VERSION`: passing
  `version` to `pnpm/action-setup` while `packageManager` is set in
  package.json is a hard error in v4 of the action, not a warning. Rule of
  thumb: one source of truth for the pnpm version — the `packageManager`
  field. When bumping pnpm, only `package.json` changes; workflows need
  nothing.

---

## Increment — Move refresh cron off the top of the hour
**Date:** 2026-10-11
**Status:** Complete

### What was built
- `refresh.yml` cron changed from `0 * * * *` to `37 * * * *`.

### Decisions made
- Only 2 of ~12 hourly slots actually fired after the workflow landed
  (2026-10-10 19:11 → 2026-10-11 07:05), and the two that did were 21 and
  31 minutes late. `0 * * * *` is GitHub's most congested cron slot — under
  load, scheduled runs are delayed or silently dropped. `:37` avoids the
  :00/:15/:30/:45 congestion; no official stats exist, so this is a
  heuristic pick, and RSS tolerates the missed hours either way.
- AGENTS.md refresh section updated to match.

### Gotchas
- Missed scheduled runs leave no trace in the Actions log — the run list
  just shows gaps, nothing failed. Don't debug repo config for this.

---

## Increment — Feed folders (create, rename, delete, drag-and-drop)
**Date:** 2026-10-11
**Status:** Complete (production Turso migration pending — see Gotchas)

### What was built
- **Schema:** new `folders` table (`id`, `name` UNIQUE, `created_at`) and
  `feeds.folder_id` (FK → folders, ON DELETE SET NULL). Migration
  `drizzle/0001_fixed_leo.sql` generated via `db:generate` — a plain
  `CREATE TABLE` + `ALTER TABLE feeds ADD folder_id`, no table rebuild.
- **API:** `routes/folders.ts` (GET/POST/PATCH/DELETE, duplicate names → 409),
  `PATCH /api/feeds/:id` accepting `{ folderId: string | null }` (move into/out
  of a folder, 404 on unknown feed or folder), and a `folder_id` query param on
  `GET /api/articles` (subquery via `inArray`, keeps the flat `Article[]`
  response shape). Router mounted in `worker/index.ts`.
- **Types:** `Folder`, `NewFolder`, `UpdateFolder`, `UpdateFeed`;
  `Feed.folderId`.
- **Frontend:** sidebar `Folders` section with nested (indented) feeds and an
  uncategorized `Feeds` section; "New folder" button in the footer;
  `NameDialog.tsx` shared create/rename prompt; right-click context menu on
  folder rows (Rename / Delete, `window.confirm` on delete); HTML5 drag-and-drop
  of feed rows onto folder rows or the uncategorized zone (custom drop
  highlight); folder click filters the article list (`?folder_id=`); refresh
  scope follows selection (feed → that feed, folder → its feeds, all → all).
- **Tests:** `folders.test.ts` (13 tests) + new cases in `feeds.test.ts`
  (PATCH move) and `articles.test.ts` (folder_id filter). Suite: 64 passing.
- Browser smoke-tested end to end against local dev (create → drag in → drag
  out → rename → delete), including a screenshot of the grouped sidebar.

### Decisions made
- **`folders` table, not a `feeds.category` text column.** The interaction
  design (create an empty folder first, then drag feeds in) requires empty
  folders to exist, and a distinct-value column cannot represent one. Side
  benefit: rename = one UPDATE on the folder row instead of a bulk feed update;
  delete keeps feeds via explicit `UPDATE feeds SET folder_id = NULL` before
  the delete — done in the route, not via the FK's ON DELETE SET NULL, because
  libsql does not guarantee `PRAGMA foreign_keys` is enabled in every
  environment (file: vs Turso). UNIQUE on `folders.name` is a column
  constraint, so the 409 path is DB-backed regardless of pragma state.
- **Auto-ascending order, no manual sorting** (user asked; recommendation
  accepted): folders and feeds sort client-side by display name via
  `compareNames()` (`localeCompare`, sensitivity base — mixed Chinese/English
  works). Manual ordering would need order columns on two tables, batch
  reorder endpoints, and a second drag meaning (reorder vs move). Upgrade path
  if ever wanted: `sort_order` columns + extend DnD.
- **DnD payload is `text/plain` with the feed id;** native HTML5 events, no
  drag library. Drop targets: folder rows + uncategorized wrapper. Same-folder
  drops are short-circuited client-side (no PATCH).
- **Context menu renders outside `<aside>`** as a fragment sibling: the
  aside's `translate` utility makes it the containing block for
  `position: fixed` descendants, which would offset the menu on mobile.
- **`NameDialog` instead of extending `AddFeedDialog`:** one generic
  single-name prompt covers new-folder and rename; the URL dialog stays
  URL-specific. Both follow the same visual pattern.

### Gotchas
- **Production Turso migration NOT applied yet** — no `TURSO_*` env vars in
  the working shell. Run `pnpm --filter @reed/worker db:migrate` with the real
  env vars BEFORE the next deploy: drizzle's `db.select().from(feeds)` lists
  every schema column explicitly, so `GET /api/feeds` errors with
  "no such column: folder_id" against an unmigrated database. Order: migrate
  → deploy.
- `noStaticElementInteractions` fires on the draggable feed row and the
  folder row (context menu + drop handlers) — suppressed with biome-ignore
  comments, consistent with the one precedent in `ArticleReader.tsx`.
- `exactOptionalPropertyTypes` bites optional props passed explicit
  `undefined` (`ArticleList.heading` needed `string | undefined`), and
  `noUncheckedIndexedAccess` bites `duplicate[0].id` — guard with
  `if (duplicate[0] && …)`.
- Native `window.confirm` blocks the page's main thread, which makes
  Playwright's click on the Delete menu item time out even though the dialog
  is open; in browser automation, hook `window.confirm = () => true` before
  driving the delete flow. (The confirm itself appears correctly.)
- `db:local` is not idempotent (`executeMultiple` of the full DDL), and
  `file:local.db` resolves relative to the worker package. The stale
  pre-folders `packages/worker/local.db` was deleted and recreated with the
  new schema + seed data (it was an untracked dev artifact).
- HTML5 drag-and-drop does not exist on touch devices — there is currently no
  mobile way to assign a folder (acceptable for now; a long-press menu would
  be the upgrade path).

---

## Increment — Folder expand/collapse
**Date:** 2026-10-11
**Status:** Complete

### What was built
- Folder rows toggle expand/collapse on click (rotating `ChevronRight`
  indicator, `aria-expanded`). Default collapsed; auto-expanded while the
  folder has unread articles or contains the selected feed. Manual choices
  are an `expandOverride: Record<string, boolean>` map in `FeedSidebar` local
  state (session-only, not persisted) that beats the auto rule.
- **Removed the folder article view** that the previous increment added:
  folder click now means expand/collapse, so `selectedFolderId`,
  `handleSelectFolder`, the `heading` prop on `ArticleList`, and the
  `folderId` option in the app's `articlesApi.list` were all deleted. The
  server's `GET /api/articles?folder_id=` filter and its tests stay — API
  surface for the future CLI, no UI consumer.
- Collapsing a folder that contains the selected feed deselects it first
  (`onSelectFeed(null)`), so the view falls back to "All articles" instead of
  leaving an orphaned selection whose row just vanished from the sidebar.
- Drop targets work on collapsed folders (drag a feed in; folder stays
  collapsed, unread badge updates).

### Decisions made
- **Auto-expand = `unread > 0 || contains selected feed`.** The unread half
  is the user's spec ("内有未读时为展开状态"); the containment half prevents
  the active row from hiding itself — without it, reading a feed inside an
  auto-collapsed folder (unread hits 0 after auto-mark-read) makes the folder
  snap shut around the current selection. The deselection-on-collapse rule
  resolves the remaining conflict: without it, clicking to collapse while
  reading inside the folder would immediately re-expand (display rule wins)
  or hide the active row (override wins). Falling back to All articles is the
  only coherent outcome.
- **`expandOverride` map instead of persisted state:** the default rule
  (collapsed / unread→expanded) is the product behavior; persistence would
  turn it into a fourth state to reason about for little gain. Add
  localStorage if it ever bothers the user.
- **Deselect on collapse implemented in `toggleFolder` (sidebar), not App:**
  the sidebar owns expansion state and already has `onSelectFeed`; App does
  not need to know folders collapse.

### Gotchas
- The bug the deselection rule fixes was caught in browser automation, not by
  reasoning ahead: select a feed inside Tech → click Tech → feed row
  disappeared while the reader still showed it. Tests can't catch this class
  (no app-side test rig); drive the real UI for interaction changes.
- Playwright locator flake on a freshly reloaded IAB tab (click on a
  snapshot-proven button timed out with no state change) — page-level
  `element.click()` via `evaluate` was the reliable path for React synthetic
  onClick handlers.
- `element.textContent` of sidebar rows concatenates the avatar letter with
  the name ("AAlpha Blog"); accessible-name matching (aria snapshot /
  `textContent.includes`) is the correct check for row visibility.

---

## Increment — Fix sidebar unread badges vanishing on feed selection
**Date:** 2026-10-11
**Status:** Complete

### What was built
- Sidebar unread badges are now derived from a dedicated full unread fetch
  (`articlesApi.list({ unread: true })` → `unreadList` state): per-feed
  counts group by `feedId`, total is `unreadList.length`. One fetch replaces
  the two overlapping sources that existed before (view-derived counts +
  separate total fetch).
- `handleMarkRead` keeps `unreadList` in sync both ways (mark read removes
  the article; mark unread re-adds it), so badges stay live between
  refreshes.

### Decisions made
- **Root cause was data scope, not rendering:** `unreadCounts` was computed
  from the currently loaded `articles` list, which is filtered by the
  selected feed — selecting any feed made every other feed's badge vanish
  (known quirk, previously tolerated). Deriving from the global unread list
  fixes badges, folder unread aggregates, and the folder auto-expand rule in
  one move.
- **No new endpoint:** `?unread=true` already returned full article rows
  including `feedId`; a `/api/feeds`-embedded count aggregate would be more
  code for the same information at single-user scale.

### Gotchas
- The containment rule for folder auto-expand (selected feed keeps its
  folder open) now matters even more: with view-derived counts, selecting a
  feed zeroed every other folder's unread and would have collapsed them.
  That flicker is gone with the global counts.
- Verified in browser: select feed → all badges persist; open article →
  its feed/folder/total badges decrement immediately; Mark unread → they
  restore.

---

## Increment — OPML import/export
**Date:** 2026-10-11
**Status:** Complete

### What was built
- `GET /api/opml` — export every feed as OPML 2.0 (`text/xml`, `Content-Disposition:
  attachment; filename="reed.opml"`). Foldered feeds nest one level under a
  `<outline text="FolderName">`; uncategorized feeds sit at the top level of `<body>`.
- `POST /api/opml` — import an OPML body. Feeds match by URL (existing → skipped
  untouched, no folder move), folders match by name (reused, or created on demand).
  Returns `{ feedsAdded, foldersCreated, feedsSkipped }`. Import does NOT trigger
  fetching — the hourly cron picks up new feeds.
- `packages/worker/src/lib/opml.ts` — `parseOpml()` / `buildOpml()` on the existing
  `fast-xml-parser` dep. Parse walks outlines recursively, so feeds nested deeper
  than one level attach to their nearest folder ancestor; build emits one folder
  outline per folder (first-appearance order), uncategorized feeds first.
- UI: a `···` button in the sidebar wordmark row opens a small menu (Import OPML… /
  Export OPML). Export is a plain `<a href="/api/opml">` — no fetch wrapper needed,
  the Content-Disposition header does the download. Import opens
  `ImportOpmlDialog.tsx` (AddFeedDialog variant): file input → FileReader-less
  `file.text()` → POST → success message with counts → Done. App reloads
  feeds + folders after import.
- Menu renders outside the `<aside>` (same fixed-position/containing-block rule as
  the folder context menu) and closes on overlay click or Escape.

### Decisions made
- **No new dependencies:** OPML is just XML — the installed `fast-xml-parser` parses
  and (via string building) generates it. An OPML library would be more code than
  the ~120 lines here.
- **URL-based feed dedupe, name-based folder dedupe:** `feeds.url` already has a
  UNIQUE constraint; re-importing a list is idempotent. Existing feeds are never
  moved into imported folders — import is additive only, so it can't rearrange an
  existing subscription list by accident.
- **Recursive outline walk over strict one-level:** recursion is barely more code
  and degrades gracefully on nested-folder exports from other readers (feed lands
  in its nearest named ancestor folder).
- **No refresh on import:** importing 50 feeds shouldn't hang the request on 50
  upstream fetches; the hourly GH Actions cron (or a manual Refresh) fills them in.
  The dialog says so: "New feeds will fill in with the next refresh."
- **Ellipsis menu in the wordmark row** instead of a settings page or extra footer
  rows: single-user app, two items, already-established menu pattern to reuse.
- **biome's `noAutofocus`** forbids the autoFocus attribute — the dialog focuses
  its primary button via ref + setTimeout in the open effect, matching
  AddFeedDialog.

### Gotchas
- `/api/health` always calls `getDb()` directly and ignores the dev.ts db override,
  so it reports "degraded" against a `file:` URL even when every other route works.
  Not a bug in the new code — just confusing the first time you see it in local dev.
- In-app browser automation can't drive the native file chooser, but setting
  `input.files` via a `DataTransfer` + dispatched `change` event from page context
  exercises the real React onChange → POST → success-message flow.
- `buildOpml` emits uncategorized feeds before foldered ones — round-trip tests
  must expect that order.

### Verification
- 11 new tests (`src/worker/opml.test.ts`): parse (folders, non-OPML, broken XML),
  build (escaping, round-trip), GET export headers + body, POST import (counts,
  skip-existing without moving, reuse existing folder, 400s).
- Driven in the real UI: menu opens, Export href `/api/opml`, dialog file-pick →
  Import → "Imported 2 feeds, created 1 folder, skipped 0 duplicates." → sidebar
  shows the new folder + feed → export round-trips the imported data.

---

## Increment — Full-text search (FTS5)
**Date:** 2026-10-11
**Status:** Complete

### What was built
- `drizzle/0002_fts5_search.sql` — hand-written migration creating
  `articles_fts` (FTS5 virtual table over `title`/`summary`/`content` with an
  UNINDEXED `article_id` column), backfilling all existing articles, and adding
  three AFTER INSERT/UPDATE/DELETE triggers on `articles` that keep the index
  in sync. Journal entry appended to `drizzle/meta/_journal.json` manually.
- `GET /api/articles?q=` — tokenizes the query on whitespace, wraps each token
  in double quotes (FTS syntax injection-proof; tokens AND together), runs the
  MATCH against `articles_fts` via `db.all(sql...)` to get article ids, then
  folds `inArray(articles.id, ids)` into the existing condition list — so `q`
  composes with `feed_id`/`folder_id`/`unread` for free. Empty match → `[]`.
- Frontend: search input under the article-list header. `searchQuery` state in
  App; the article-loading effect depends on it, so every keystroke refetches
  `articlesApi.list({ feedId, q })` — search composes with the selected feed.
  `handleRefresh` passes the current query so a refresh doesn't wipe results.
- README roadmap trimmed to "auth, CLI tool"; search added to Features and the
  API table.

### Decisions made
- **Triggers over code-side sync:** refresh upserts, mark-read updates, and
  cascade deletes all touch `articles`; keeping the index in code would mean
  touching every path. Triggers are one migration and cover paths that don't
  exist yet.
- **UNINDEXED `article_id` column instead of external-content/rowid tricks:**
  deletes become a plain `DELETE ... WHERE article_id = ?`; external-content
  FTS5 would save a little space but needs the `('delete', ...)` rowid dance
  and a rowid→id join for every query. Single-user scale doesn't care.
- **Hand-written migration + manual journal entry:** drizzle-kit cannot
  generate FTS5 virtual tables or triggers. Convention documented in AGENTS.md
  (write the `.sql`, append the journal entry; `ddl.ts` picks up any `*.sql`
  automatically so tests/local DBs need nothing).
- **Tokenize-and-quote instead of raw MATCH:** user input goes through one
  escaping rule (`"` → `""`, per-token double quotes) — no FTS query syntax
  errors, no way to inject `OR`/`NEAR`/`*`.
- **No debounce:** one cheap indexed query per keystroke, single user.
- **AND semantics:** multi-word queries narrow rather than widen — matches how
  the user expects search in a small corpus to behave.

### Gotchas
- Verified FTS5 + triggers work in `@libsql/client`'s `:memory:` (Node) build
  before committing to the design; Turso (libSQL) supports FTS5 too, but the
  production DB still needs `pnpm --filter @reed/worker db:migrate` deployed.
- Mark-read PATCHes fire the UPDATE trigger and reindex the row — harmless but
  it means every read toggle rewrites the FTS row; acceptable at this scale.

### Verification
- 5 new tests in `articles.test.ts`: title/summary match, content match +
  multi-word AND (plus no-cross-match → `[]`), `q` composing with `unread`,
  FTS-syntax input (`" OR 1=1 --`) returning `[]` without erroring.
- Full worker suite green (79 tests).

---

## Increment — Trigram search (CJK fix), highlight, read-all, feed context menu
**Date:** 2026-10-11
**Status:** Complete

### What was built
- **Chinese search fix:** user confirmed unicode61 FTS5 returned nothing for
  Chinese on production. `drizzle/0003_fts5_trigram.sql` drops and rebuilds
  `articles_fts` with `tokenize = 'trigram'` (same triggers, full backfill).
  The query path changed from MATCH to `LIKE` on the fts table: trigram MATCH
  can't match tokens under 3 chars and most Chinese words are 2. `%`/`_`/`\`
  escaped; tokens AND together. LIKE rides the trigram index for ≥3-char
  patterns; shorter ones linear-scan (fine at this scale).
- **Search highlighting:** client-side — `highlightParts()` in app
  `lib/display.ts` splits title/summary on the query tokens (regex-escaped,
  case-insensitive), `ArticleList` wraps hits in `<mark>`. FTS5's `snippet()`
  auxiliary functions require MATCH, which we no longer use — that's why the
  highlight isn't server-side.
- **POST /api/articles/read-all** — marks every unread article read, `{ feedId }`
  scopes to one feed; returns `{ marked }`. UI: double-check button in the
  list header, rendered only while the current view has unread; scope follows
  the selected feed (global when "All articles"). App reloads view + unreadList
  after.
- **Feed context menu (mobile gap):** feed rows now open a context menu on
  right-click *and* 500ms touch long-press: "Move to" list (each folder +
  Uncategorized, current one ticked) + Delete feed. This is the touch path for
  folder assignment that DnD never provided — previously a mobile user couldn't
  even delete a feed (hover-only trash button). Menu state became a
  discriminated union (folder | feed); still rendered outside `<aside>`.

### Decisions made
- **LIKE over MATCH:** one code path for every token length, no trigram-floor
  special-casing, no FTS syntax injection surface at all. Cost: <3-char
  patterns linear-scan the fts table — acceptable, and identical to what MATCH
  would do anyway for those.
- **Rebuild-in-place migration (0003) instead of mutating 0002:** generated
  migrations are immutable; 0002 is already applied to production.
- **Client-side highlight:** server return shape stays plain `Article[]`; the
  painting decision belongs to the UI and costs one regex split.
- **Long-press at 500ms:** standard mobile menu timing; cleared on
  touchmove/scroll so scrolling the sidebar never pops the menu.
- **No confirm on mark-all-read:** unread state is the only casualty, and the
  button only appears when there's something to mark.

### Gotchas
- **libsql `executeMultiple` parse error on backticked FTS5 options:**
  `tokenize` = 'trigram'`` (drizzle-style quoted identifier) fails with
  "parse error"; unquoted `tokenize = 'trigram'` works. Cost one full debug
  cycle — 72 test errors because createTestDb's schema apply failed silently
  (executeMultiple result is fire-and-forget there).
- Trigram needs SQLite ≥3.34 — libSQL ships 3.45.1 (verified locally; Turso
  runs libSQL too).
- `db.update(...).run()` on the libsql driver returns `rowsAffected` — used
  for the `{ marked }` count without a second COUNT query.

### Verification
- 6 new tests: CJK 2-char substring match, `%`/`_` as literals, read-all
  (unscoped count, feedId scoping, empty body, 400 on non-string feedId).
  Existing search tests (title/summary, content, multi-word AND, q+unread,
  FTS-syntax input) all pass unchanged under the LIKE path.
- Full suite: 85 passing. Production needs `db:migrate` for 0003 before push.

### Follow-up (same increment)
- README Features list mentions mark-all-read; no code changes.

## Increment — Audit remediation (all findings except auth)
**Date:** 2026-10-11
**Status:** Complete — 98 tests passing, lint/type-check/build/bundle all green. NOT committed yet.

### Why
Full project audit (AUDIT-REPORT.md, independently verified) + a second external
review converged on the same priorities. User directive: fix everything except
authentication (AUDIT-003 stays open by request).

### What was fixed
- **AUDIT-001 (HIGH, stored XSS):** `app/src/lib/sanitize.ts` — `sanitizeArticleHtml()`
  (DOMPurify) now wraps `marked.parse` in `ArticleReader`, the only innerHTML sink.
  5 XSS regression tests (`sanitize.test.ts`) — the app package gained vitest.
  **Gotcha: happy-dom breaks DOMPurify** (misparses template content — kept
  `<script>`, dropped `<p>`); switched to jsdom, which DOMPurify officially supports.
  Bundle: 254 → 301 KB raw (95 KB gzip) — accepted cost for the sanitizer.
- **AUDIT-002 (SSRF):** `lib/refresh.ts` rewritten fetch path — `assertFetchableUrl()`
  (http/https only) at insert (400) and before every hop; `assertPublicHost()` resolves
  DNS and rejects loopback/private/link-local/CGNAT (IPv4 ranges + IPv6
  unique-local/link-local; `::ffff:` mapped handled); redirects now followed **manually**
  (max 5) so each hop re-qualifies; `AbortSignal.timeout(10s)`; body streamed with a
  5 MB cap (`readBodyWithLimit`). OPML import body capped at 4 MB (413).
  Consequence: localhost/private feed URLs are refused — note for local feed testing.
- **AUDIT-004:** feed delete now deletes articles explicitly (`feeds.ts`) — never
  trust the FK cascade's pragma state. Test added.
- **AUDIT-005:** upsert is ownership-scoped: existing URL under another feed is
  **skipped** (no overwrite, no count). Global-dedupe rule is now explicit; do not
  widen the where-clause back to URL-only. Cross-feed test added.
- **AUDIT-006 (partial):** concurrent duplicate feed insert maps UNIQUE → 409 instead
  of 500. OPML import stays sequential — drizzle's libsql transaction opens a fresh
  connection on `file:`/`:memory:` DBs (fails tests + local dev), so the
  partial-import ceiling is documented in-code (`ponytail:` comment) instead.
- **AUDIT-007:** articles effect aborts the previous request (`AbortController`;
  `articlesApi.list` takes a signal). AbortError swallowed.
- **AUDIT-008:** try/catch + console.error in `handleMarkRead`, `handleMarkAllRead`,
  `handleDeleteFeed`, `handleDeleteFolder`, `handleMoveFeed` — no more unhandled
  rejections from direct event handlers (dialog-driven flows already caught).
- **AUDIT-009:** `handleDeleteFeed` reloads the view list — deleted feed's articles
  leave "All articles" immediately.
- **AUDIT-010:** `runCron()` returns failures; `scripts/refresh.ts` logs each to
  stderr and sets `process.exitCode = 1` — a broken feed now turns Actions red.
- **AUDIT-012:** `onError` returns generic `{"error":"Internal server error"}` and
  logs the real error server-side (health + refresh 502 keep their actionable
  messages deliberately).
- **AUDIT-013:** null-safe body casts (`| null)?.`) in feeds/articles routes — a
  JSON `null` body is 400-shaped, not a 500.
- **A-2:** Atom `rel="self"` links never win the link fallback (parse.ts). Test added.
- **A-3:** dead `allowBuilds` placeholder block removed from `pnpm-workspace.yaml`.
- **A-4:** `/api/health` uses the injected db when present — no more "degraded" in
  local dev.
- **A-6:** server order is `publishedAt DESC` (matches client default; was dead ASC).
- **A-7:** OPML parser entity cap raised to 100k (matches feed parser).
- **CI gap:** new `.github/workflows/ci.yml` — lint → type-check → tests → build →
  API-bundle freshness, on push/PR. Local pre-commit remains the fast path.
- **.env.example:** rewritten from Cloudflare D1 leftovers to Turso vars.

### Deliberately NOT done
- **Auth (AUDIT-003):** excluded per user instruction — still open before any
  untrusted-audience deployment.
- **Pagination/column pruning (AUDIT-011):** scale-conditional feature change, not a
  bug; revisit when the corpus warrants.
- **Cron concurrency limit / 5–15min cadence:** rejected — no freshness requirement,
  single-user feed count doesn't warrant a semaphore.
- **Highlight-vs-raw-text mismatch (A-8):** cosmetic, display-only.

### Gotchas
- drizzle `db.transaction()` + libsql `:memory:`/`file:` = "no such table" inside the
  transaction (fresh connection). Do not reach for transactions in route code unless
  production Turso-only and tested.
- Tests that stub `fetch` must also mock `node:dns/promises` now (refreshFeed does a
  real DNS lookup per hop) — `vi.mock("node:dns/promises", ...)` in refresh/cron/feeds
  test files.
- `exactOptionalPropertyTypes`: `request(path, { signal })` fails tsc when signal is
  possibly undefined — pass `signal ? { signal } : undefined`.
- Redirect-loop tests use `Response(body, { status: 301, headers: { Location } })` —
  works under undici; `res.body?.cancel()` before discarding 3xx responses avoids
  leaked connections.

### Follow-up (CI fix, same day)
- First CI run failed at the bundle-freshness step: `esbuild` not found. Root
  cause: `build:api` runs `pnpm --filter @reed/worker exec esbuild`, but esbuild
  was never a direct dependency of the worker — the locally working bin was a
  stale shim from an older install, pointing at a *different* esbuild version
  than the lockfile's 0.25.12. CI's fresh install (rightly) had no bin.
  Fix: `esbuild@0.25.12` pinned as a worker devDependency (reuses the existing
  lockfile instance via vite), bundle regenerated — output differs from the
  previously committed bundle (built by the old phantom version), so the
  regenerated bundle ships with this commit. Sanity-checked: bundle loads and
  exports all four method handlers.

---

## Increment — Brand mark redesign (logo + favicon)
**Date:** 2026-10-11
**Status:** Complete — lint/type-check/tests green. NOT committed yet.

### Why
User asked to regenerate the logo and favicon with meaning that fits the project
theme. The old mark (three wind-swept reed stalks with ember plumes) read as
generic grass at 16–32 px and said nothing about RSS.

### New mark — "reed sprouting an RSS signal"
One reed stalk grows from a ground line; its plume bends in the wind into the
three concentric arcs of an RSS icon (dot + arcs), tilted -12° for the
wind-blown feel. Reed = the reader, wind = the information flow, arcs = RSS.
Same palette as before: warm paper tile `#faf9f7`, ink stem, ember gradient
`#d9480f → #ff8a3d`; `prefers-color-scheme: dark` swaps to `#121212` tile +
light stem + brighter gradient (CSS `<style>` inside the SVG).

### What changed
- `app/public/favicon.svg` — new mark, full-bleed rounded tile (rx 112).
- `app/public/logo.svg` — same mark, transparent bg, fixed ink colors.
- `app/public/favicon.png` (32×32) and `apple-touch-icon.png` (180×180) —
  rasterized from the SVG with headless Chrome
  (`--headless=new --screenshot --window-size=… --default-background-color=…`
  over an `<img src="favicon.svg" style="width:100vw;height:100vh">` wrapper).
  No rsvg-convert/ImageMagick on the machine; Chrome is the local renderer.
- `app/src/components/icons.tsx` — `ReedMark` redrawn to the same geometry
  (24 viewBox, CSS vars for theme-awareness).
- `app/index.html` — favicon URLs cache-busted `?v=2` → `?v=3`.

### Gotchas
- Chrome headless defaults to light `prefers-color-scheme`, which is what the
  PNGs want (iOS ignores dark anyway); the SVG favicon adapts on its own.
- `userSpaceOnUse` gradient coords shared by dot + arcs so the ember gradient
  flows continuously across the whole plume.
- **apple-touch-icon must be full-bleed** (no rounded transparent corners —
  iOS applies its own mask and fills transparent corners black). It renders
  from a `rx="0"` variant of the favicon SVG (`/tmp` at build time, not
  committed).
- **Chrome headless is unreliable at small window sizes** (a 180px viewport
  silently rendered the SVG unscaled/cropped twice; a 32px render worked;
  512px always worked; one run wrote the file then hung instead of exiting —
  background it, poll for the file, then kill). Working recipe: render at
  512, downscale with `sips -z 180 180` (favicon.png 32 was a lucky direct
  render, re-do it via the 512+sips path if it ever needs regenerating).

### Deliberately NOT done
- No maskable/Safari pinned-tab icon variants — single-user app, revisit if
  the PWA story ever changes.

---

## Increment — Faster feed switching: list payloads drop `content`
**Date:** 2026-10-11
**Status:** Complete

### What was built
Switching feeds in the sidebar felt laggy: every switch refetched
`GET /api/articles`, which returned **every column including the full
`content` body** for every article with no LIMIT — potentially megabytes per
click — and the UI gave no feedback until the whole response landed (the old
feed's cards lingered, then swapped at once).

- `packages/worker/src/worker/routes/articles.ts` — `GET /api/articles` now
  selects everything except `content`. New `GET /api/articles/:id` returns the
  full article (with content) for the reader; 404 on unknown id. `unread=true`
  (sidebar badges) benefits automatically.
- `@reed/types` — new `ArticleListItem = Omit<Article, "content">` for list
  responses.
- `packages/app/src/lib/api.ts` — `articlesApi.list()` returns
  `ArticleListItem[]`; new `articlesApi.get(id)`.
- `packages/app/src/App.tsx` — on a feed switch the list is cleared
  immediately and `isLoadingArticles` shows "Loading…" in the list pane until
  the response lands (search keystrokes keep the current list visible — only
  feed switches clear). Opening an article fetches the full row by id
  (`fullArticle` state, cancelled-flag race guard): title/summary render
  instantly from the list row, the body swaps to full content when it lands.
- `ArticleList` — `isLoading` prop, empty-state text switches between
  "Loading…" and "Nothing here yet.".

### Decisions made
- **Strip content server-side rather than cache client-side first:** the
  payload cut is ~10–50× for text-heavy feeds and helps every consumer
  (list, unread badges, search) with one change; a per-feed cache only helps
  repeat visits and needs invalidation wiring. If switching still feels slow
  after this, a `Map<feedId, ArticleListItem[]>` invalidated on refresh /
  mark-read is the next rung.
- **Progressive reader render:** reader first shows the summary-derived body,
  then full content — avoids a blank reader pane and looks identical for feeds
  whose content equals the summary.
- **No LIMIT/pagination on the list:** single-user scale; payload size was the
  problem, row count wasn't. Revisit if a feed accumulates thousands of rows.

### Gotchas
- `articles.url` UNIQUE + the FTS sync triggers are untouched — the narrower
  select is query-side only, no schema change.
- `handleMarkRead` PATCHes return the full `Article` (with content); it stays
  assignable into the `ArticleListItem[]` state, no special-casing needed.
- Search highlighting is unaffected — it paints `title`/`summary`, both still
  in the list payload.

### Deliberately NOT done
- No client-side per-feed cache yet (see decision above).
- No virtualized list — row count unchanged by this change.

---

## Increment — Stale-while-revalidate caches for feed/article switching
**Date:** 2026-10-11
**Status:** Complete

### What was built
After stripping `content` from list payloads, switching still cost one full
round trip per click. Two client-side caches in App.tsx now make repeat visits
instant:

- `articlesCache` (`Map<feedId | "all", ArticleListItem[]>`) — write-through on
  every un-searched `reloadArticles`. On a feed switch, a cache hit paints
  immediately (no spinner) while the same background fetch as before still
  runs and swaps in the fresh list on landing.
- `fullCache` (`Map<articleId, Article>`, capped at 50, FIFO-evict) — full
  bodies are immutable per article, so cache hits skip the fetch entirely.

### Decisions made
- **SWR over invalidate-on-mutate:** the background revalidate runs on every
  switch regardless, so cache can never be wrong for more than one round trip
  and there is no invalidation wiring to get wrong. The revalidate request is
  exactly the request we were already making — zero extra traffic vs. no cache.
- Only `handleMarkRead` writes through to `articlesCache` (unread-dot flash on
  feed A → B → A was the one visible staleness); read-all/refresh/delete
  rewrite the current view's entry via reloadArticles, and other feeds'
  entries self-heal on their next revalidate.
- Full-body cache deliberately skips revalidation: content comes from the feed
  parse and only changes on refresh, and a stale `read` flag is invisible
  (the reader doesn't display read state).

### Bug fixed en route
Opening article B right after A briefly rendered A's full body under B's
title: `fullArticle` state held the previous article until the new fetch
landed, and it took precedence over the summary merge. The effect now resets
to the cached-or-null value first.

### Deliberately NOT done
- No prefetch of unvisited feeds (N requests per load for a maybe).
- No debounce on search — payloads are small now.

---

## Increment — Fix: cache hit never painted the cached list
**Date:** 2026-10-11
**Status:** Complete

### What was built
Bug from the previous increment: the SWR effect computed the cache hit and
turned the spinner off, but never called `setArticles(cached)` — so a repeat
feed switch showed an empty list reading "Nothing here yet." until the
revalidate landed (worse than the spinner). The effect now paints the cached
list (or clears, when a switch misses) before fetching.

### Gotchas
- `if (feedChanged || cached) setArticles(cached ?? [])` covers both paths in
  one line: switch-miss → `[]` + spinner; hit → cached, no spinner; search
  keystroke (no hit by design) → no-op, list stays visible.

---

## Increment — Database swap: Turso/libSQL → Neon PostgreSQL
**Date:** 2026-10-11
**Status:** Code complete; pending `DATABASE_URL` in Vercel/GitHub and first deploy

### What was built
Full engine swap from Turso (libSQL/SQLite) to Neon (PostgreSQL), driven by the
multi-user roadmap. Historical data is NOT migrated — the Neon database starts
empty; feeds come back via OPML import + hourly cron (article history and read
state are intentionally dropped, per user decision).

- `src/db/client.ts` — `@libsql/client/web` → `@neondatabase/serverless`
  (neon-http mode) + `drizzle-orm/neon-http`. One env var, `DATABASE_URL` (the
  Neon connection string embeds the password; `TURSO_AUTH_TOKEN` is gone).
- `src/db/schema.ts` — `sqlite-core` → `pg-core`. Timestamp columns `integer` →
  `bigint({ mode: "number" })` (unix ms overflows int4); `read` stays integer
  0/1 so `@reed/types`, the API contract, and the frontend are untouched.
- `drizzle/` — four SQLite migrations deleted, new PG baseline `0000`
  generated + hand-written `0001_pg_trgm.sql` (CREATE EXTENSION, per the
  documented hand-written-migration exception).
- Search: FTS5 virtual table + 3 sync triggers → `ILIKE '%token%'` directly on
  `articles.title/summary/content`, backed by a multi-column GIN
  (`gin_trgm_ops`) index declared in schema.ts. Backslash escaping kept; PG
  uses backslash as LIKE's default escape char, so no ESCAPE clause. One query
  instead of the old fts-id-round-trip + main-select.
- `test-helpers.ts` — in-memory libsql → neon-http against `TEST_DATABASE_URL`,
  schema applied by splitting `ddl.ts` output on `--> statement-breakpoint`
  (neon-http is one statement per request), TRUNCATE before every test.
  Unset var → suites skip via `ctx.skip()`, so pre-commit still passes offline.
- 6 test files updated for the now-async `createTestDb(ctx)`.
- `scripts/dev.ts` simplified (no file:/authToken branches); `local-db.ts` and
  `db:local` deleted (no more `file:` databases anywhere).
- Root `pnpm.patchedDependencies` and `patches/` removed — all three patches
  existed solely to keep `@libsql/client`'s CJS tree alive on Vercel; the Neon
  driver needs none. `api/index.js` regenerated (574.9 KB).
- refresh.yml: `TURSO_*` secrets → `DATABASE_URL`. README/.env.example updated.

### Decisions made
- **neon-http over websocket/TCP drivers:** no transactions exist in the
  codebase (OPML import deliberately inserts sequentially — AUDIT-006), so
  neon-http's no-transaction limitation costs nothing; stateless HTTPS also
  means zero pooling config on Vercel. Revisit only if a transaction is ever
  needed — that's the moment to move to the websocket driver, not before.
- **ILIKE + pg_trgm over PG tsvector:** tsvector/websearch would change match
  semantics (tokenization, ranking) from what users already see; ILIKE keeps
  today's substring behavior exactly (including 2-char Chinese words, which
  defeated trigram MATCH on SQLite). The GIN trigram index keeps it indexed.
- **`read` stays 0/1 integer, not boolean:** the column type is the only place
  the convention exists — types, routes, and app code keep their values.
- **Explicit article delete kept in `DELETE /api/feeds/:id`:** PG would cascade
  reliably, but the statement is one line and the behavior is identical.
- **Folder delete now relies on ON DELETE SET NULL:** the old explicit
  null-set existed because libsql didn't guarantee the foreign_keys pragma;
  Postgres enforces FKs, so the workaround (and its comment) went away.
- **Tests skip (not fail) without `TEST_DATABASE_URL`:** tests TRUNCATE all
  tables — pointing them at a used database would wipe it. The skip keeps
  pre-commit green offline; the var should only ever name a throwaway branch.
- **vitest `fileParallelism: false`:** parallel test files sharing one schema
  would TRUNCATE each other's fixtures.

### Options considered and discarded
- **Migrating historical data:** offered a one-off copy script; user chose a
  fresh start (OPML re-import). No `migrate-turso.ts` was written.
- **Local Docker Postgres for tests/dev:** rejected — another moving part on
  the user's machine; neon-http reaches Neon identically from anywhere.
- **postgres.js (TCP) driver:** fine on Vercel but adds pool sizing/timeout
  concerns that neon-http simply doesn't have.

### Gotchas
- `neon()`'s call signature is a tagged template; raw one-off DDL strings go
  through `http.query(statement)`, not `http(statement)`.
- neon-http returns Postgres `rowCount`, not libsql `rowsAffected`; drizzle pg
  update builders are awaited directly (no `.run()`).
- Timestamps MUST be bigint in pg-core — `integer` silently truncates nothing
  at rest but overflows on unix-ms values.
- libsql packages linger in `.pnpm` from drizzle's peer-resolution history;
  the worker's own dependency graph is clean.

### Follow-ups (user actions)
1. Set `DATABASE_URL` in Vercel env vars; replace `TURSO_*` GitHub secrets
   with `DATABASE_URL`.
2. `pnpm --filter @reed/worker db:migrate` against Neon.
3. After deploy: sidebar `···` → Import OPML with the previously exported
   `reed.opml`.
4. For local test runs: `TEST_DATABASE_URL` → a throwaway Neon branch.
### Fix en route: migration ordering
First `db:migrate` failed: the generated 0000 baseline created the GIN
trigram index, but `pg_trgm` (the extension it needs) lived in 0001 —
drizzle-kit applies journal order, extension came last. Fix: the index moved
out of schema.ts entirely and into the hand-written `0001_pg_trgm.sql`
alongside `CREATE EXTENSION` (keeps drizzle-kit diffs clean too — expression
indexes in schema.ts invite spurious regenerates). Neon DB was still empty
(drizzle-kit rolled the failed migration back transactionally), so the re-run
was: drop the bookkeeping `drizzle` schema, regenerate the baseline, migrate.
Verified end-to-end against real Neon: tables + extension + 4 article indexes
present, health/folder CRUD/ILIKE search/read-all all correct via the local
dev server.

## 2026-10-11 — Multi-user accounts (auth + per-user scoping)

### What was built
Full multi-user support, zero new dependencies:
- `drizzle/0002_multiuser.sql` (hand-written under the documented exception —
  includes a data backfill drizzle-kit cannot generate): `users` table,
  `user_id` on folders/feeds, uniqueness moved from global columns to
  per-user/per-feed composites (`folders(user_id,name)`, `feeds(user_id,url)`,
  `articles(feed_id,url)`), `idx_feeds_user_id`. schema.ts matches the final
  state (no `.default("legacy")` declared — a future `db:generate` may emit a
  harmless `DROP DEFAULT`).
- `lib/auth.ts`: scrypt password hashing (`node:crypto`, no bcrypt), HS256
  session JWTs via `hono/jwt` in an `HttpOnly; Secure; SameSite=Lax` cookie
  (30-day expiry, stateless — no session table), `requireAuth` middleware
  accepting cookie or `Authorization: Bearer` (CLI path).
- `routes/auth.ts`: register / login / logout / me. Registration optional
  invite gate via `SIGNUP_CODE`; emails lowercased; password min 8.
- All four data routers mount `router.use("*", requireAuth)`; every query
  filters by `c.get("userId")`, single-row endpoints check ownership in the
  WHERE clause (IDOR covered by tests).
- `refreshFeed()` upsert is now scoped to (feed_id, url) — the old global-URL
  "cross-feed skip" logic is gone; two users subscribed to the same feed URL
  each get independent article rows. `runCron()` unchanged (feeds are just
  rows; refresh doesn't care who owns them).
- Frontend: `Login.tsx` full-screen gate (login/register toggle, invite-code
  field in register mode), `authApi` + `setOnUnauthorized` in lib/api.ts (any
  401 flips back to the login screen — covers mid-session expiry), App gates
  data loads on `authed`, Sign out in the sidebar `···` menu. `@reed/types`
  gained `User`.
- Tests: `auth.test.ts` (hashing, register validation, invite code, legacy
  claim, login/logout/me, 401 gate); multi-user scoping tests in feeds/
  articles suites; existing suites reworked — `seedUser` + `authedRequest`
  helpers in test-helpers (TRUNCATE now includes `users`; fixtures carry
  `userId: "u1"`; requests go through `call()` with a Bearer token).
- API bundle regenerated (600 KB, hono/jwt + scrypt included).

### Decisions made
- **hono/jwt + node:crypto over new deps** (bcrypt/session table/passport):
  scrypt is in the stdlib, HS256 stateless cookies need no session store, and
  Hono already ships both utilities. A sessions table buys revocation we
  don't need at personal scale.
- **First registration claims legacy rows** instead of a backfill script:
  the migration can't know a password, so pre-multiuser feeds/folders belong
  to a `legacy` placeholder (unloggable hash) and the first `register` reassigns
  them. Deploy + register = data preserved, zero user steps beyond signing up.
  Registration should be invite-gated (`SIGNUP_CODE`) so a stranger can't
  register first and inherit the data.
- **Per-feed article uniqueness over a global article pool + subscriptions
  join table**: duplicated rows for shared feeds are trivially cheap on Neon
  and keep `refreshFeed()`/queries exactly as they were shape-wise. The pool
  design is the "hundreds of users" upgrade path, deliberately not built.
- **`DEFAULT 'legacy'` on user_id during migration**: the currently-deployed
  code (and the hourly Actions cron, which may fire mid-deploy) inserts
  without `user_id`; the default keeps those writes alive instead of failing
  them, and they get claimed by the first registration like everything else.
- **401-anywhere → login screen**: one `setOnUnauthorized` hook in
  `request()` instead of per-caller handling. Login's own 401 also triggers
  it — harmless, we're already on that screen.
- **No rate limiting on login/register**: personal scale; revisit if
  registration is ever left open on a public domain.

### Options considered and discarded
- Session table + opaque tokens (rejection via DELETE): revocation isn't a
  requirement; 30-day JWT expiry is acceptable for a personal reader.
- Global users-scoped article dedupe (`ON CONFLICT (feed_id,url) DO UPDATE`):
  drizzle upsert would work, but select-then-write stays consistent with the
  existing no-transaction style (AUDIT-006).
- Claiming legacy data inside a one-off `scripts/claim.ts`: more moving parts
  than folding the claim into first registration.

### Gotchas
- `hono/jwt`'s `verify()` requires the algorithm argument (`"HS256"`) — the
  2-arg call is a type error.
- Hono `app.request()` returns `Response | Promise<Response>` — the
  `authedRequest` test helper types its app param accordingly.
- DB tests could not run locally (no `TEST_DATABASE_URL` in this shell), so
  the migration SQL and the scoped queries are covered by review + types only
  until the user runs the suite against a throwaway branch. Type-check, lint,
  and both builds pass.
- Secure cookies on `http://localhost` are fine (Chrome/Firefox treat
  localhost as trustworthy) — Vite's `/api` proxy path works unmodified.

### Follow-ups (user actions)
1. `pnpm --filter @reed/worker db:migrate` (needs `DATABASE_URL`).
2. Set `AUTH_SECRET` (`openssl rand -hex 32`) in Vercel env vars and locally;
   set `SIGNUP_CODE` too unless open registration is intended.
3. Deploy, register the first account — existing feeds/folders are claimed
   automatically. Re-import OPML only if the legacy data was never migrated
   (fresh-start choice from the Neon migration).
4. Point `TEST_DATABASE_URL` at a throwaway branch and run `pnpm test:run`
   once to exercise the new suites against real Postgres.

### Fix en route: register 500 → 503 + no orphan user
User hit "Internal server error" on account creation. Likely causes are the
documented follow-ups (AUTH_SECRET unset → token signing throws after the
user row was already written; or db:migrate not run → `users` table missing).
Hardened register/login regardless:
- register now checks `AUTH_SECRET` up front and returns **503
  `AUTH_SECRET is not set on the server`** (login likewise) — operator-
  actionable instead of a blind 500. Naming the env var is a deliberate,
  documented exception to the generic-500 convention: it leaks nothing and
  the alternative is undebuggable.
- the session token is signed **before** any DB write, so a token failure
  can no longer leave a half-registered user (which would then 409 on the
  retry).
Test added: register/login → 503 + zero writes with AUTH_SECRET deleted.
