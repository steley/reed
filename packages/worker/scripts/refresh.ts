/**
 * One-shot feed refresh for GitHub Actions (or local runs against Turso).
 * Reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN from the environment.
 */
import { getDb } from "../src/db/client.ts";
import { runCron } from "../src/worker/cron.ts";

await runCron(getDb());
console.log("Feed refresh finished.");
