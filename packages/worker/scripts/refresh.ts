/**
 * One-shot feed refresh for GitHub Actions (or local runs against Neon).
 * Reads DATABASE_URL from the environment.
 * Exits non-zero when any feed fails, so the Actions run goes red.
 */
import { getDb } from "../src/db/client.ts";
import { runCron } from "../src/worker/cron.ts";

const failures = await runCron(getDb());
for (const failure of failures) {
  console.error(`Feed ${failure.feedId} failed: ${failure.error}`);
}
if (failures.length > 0) {
  console.log(`Feed refresh finished with ${failures.length} failure(s).`);
  process.exitCode = 1;
} else {
  console.log("Feed refresh finished.");
}
