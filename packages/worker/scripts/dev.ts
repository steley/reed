/**
 * Local API dev server (replaces `wrangler dev`). Listens on :8787 — the Vite
 * dev server proxies /api/* here. Point TURSO_DATABASE_URL at a local
 * `file:local.db` (init once with scripts/local-db.ts) or a remote Turso DB.
 */
import { serve } from "@hono/node-server";
import { createApp } from "../src/worker/index.ts";

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: createApp().fetch, port }, (info) => {
  console.log(`cloud-reader API listening on http://localhost:${info.port}`);
});
