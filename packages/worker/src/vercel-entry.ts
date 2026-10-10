import { handle } from "hono/vercel";
import { createApp } from "./worker/index.ts";

/**
 * Vercel serverless entry. The optional catch-all route file serves /api and
 * /api/*; the Hono app defines full paths (e.g. /api/feeds) so no basePath
 * juggling is needed. Static SPA files are served from packages/app/dist via
 * vercel.json.
 */
const app = createApp();

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
