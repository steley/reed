/**
 * Local API dev server. Listens on :8787 — the Vite dev server proxies /api/*
 * here. Connects straight to Neon over HTTP; just export DATABASE_URL:
 *
 *   DATABASE_URL=postgresql://... pnpm dev
 */
import { serve } from "@hono/node-server";
import { createApp } from "../src/worker/index.ts";

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: createApp().fetch, port }, (info) => {
  console.log(`reed API listening on http://localhost:${info.port}`);
});
