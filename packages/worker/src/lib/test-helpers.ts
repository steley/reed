import { neon, neonConfig } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { SCHEMA_SQL } from "../db/ddl.ts";
import * as schema from "../db/schema.ts";
import { createSessionToken } from "./auth.ts";

// requireAuth signs/verifies JWTs — tests share a fixed secret.
process.env.AUTH_SECRET ??= "test-secret";

// Pin the driver's HTTP fetch to the real one: suites stub global fetch to
// mock feed fetching, and the driver shares that global — without this its
// queries receive the mock (XML responses, undefined .ok). neonConfig is the
// singleton the neon-http execute path reads fetchFunction from.
neonConfig.fetchFunction = fetch.bind(globalThis);

const TEST_URL = process.env.TEST_DATABASE_URL?.trim();

let db: NeonHttpDatabase<typeof schema> | undefined;
let schemaReady: Promise<void> | undefined;

/**
 * neon-http runs one statement per request — split the concatenated
 * migration SQL back into single statements. The `--> statement-breakpoint`
 * markers are the primary separator; migrations without a trailing marker
 * (hand-written files, generated-file boundaries) glue neighboring commands
 * together, so each chunk is further split at a semicolon that ends a line.
 * (Semicolons inside string literals would defeat this — none exist in these
 * migrations; don't add SQL functions here without revisiting.)
 */
function schemaStatements(): string[] {
  return SCHEMA_SQL.split("--> statement-breakpoint")
    .flatMap((chunk) => chunk.split(/;(?=\s*\n|$)/))
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * The 0002 migration's marker index — present only when the schema is fully
 * current. Neon branches cut from a migrated production branch carry the
 * whole schema already; replaying history onto them fails half-way (constraints
 * already dropped), so detect and skip instead.
 */
async function schemaIsCurrent(http: {
  query: (query: string) => Promise<unknown>;
}): Promise<boolean> {
  const res = await http.query(
    "SELECT 1 FROM pg_indexes WHERE indexname = 'articles_feed_id_url_unique' LIMIT 1",
  );
  // neon's .query() resolves to the rows array itself
  const rows = Array.isArray(res) ? res : ((res as { rows?: unknown[] }).rows ?? []);
  return rows.length > 0;
}

/**
 * Shared test database over neon-http (TEST_DATABASE_URL), with the reed
 * schema applied once and all tables truncated so every test starts empty.
 * Pass the vitest hook context: when TEST_DATABASE_URL is unset the suite
 * skips instead of failing. Tests wipe data — point TEST_DATABASE_URL at a
 * throwaway Neon branch, never at a database you use.
 */
export async function createTestDb(ctx: {
  skip(): void;
}): Promise<NeonHttpDatabase<typeof schema>> {
  if (!TEST_URL) {
    console.warn(
      "TEST_DATABASE_URL is not set — database tests skipped. " +
        "Set it to a throwaway Neon branch connection string.",
    );
    ctx.skip();
    throw new Error("TEST_DATABASE_URL is not set (unreachable — ctx.skip() aborts the test)");
  }

  if (!db) {
    const http = neon(TEST_URL);
    db = drizzle(http, { schema });
    schemaReady = (async () => {
      if (await schemaIsCurrent(http)) return;
      for (const statement of schemaStatements()) {
        try {
          await http.query(statement);
        } catch (err) {
          // Tolerate a partially-applied schema ("already exists") but let
          // anything else fail loudly.
          if (err instanceof Error && /already exists/i.test(err.message)) continue;
          throw err;
        }
      }
    })();
  }
  await schemaReady;
  await db.execute(sql`TRUNCATE users, folders, feeds, articles CASCADE`);
  return db;
}

/**
 * Insert a user row directly (feeds.user_id has an FK to users). The password
 * hash is deliberately malformed — login is exercised in auth.test.ts.
 */
export async function seedUser(db: NeonHttpDatabase<typeof schema>, id: string): Promise<string> {
  await db.insert(schema.users).values({
    id,
    email: `${id}@test.local`,
    passwordHash: "scrypt:00:00",
    createdAt: 1,
  });
  return id;
}

/**
 * Wrap app.request so every call carries a valid session for `userId`
 * (Bearer header — the cookie path is exercised in auth.test.ts).
 */
export function authedRequest(
  app: { request: (path: string, init?: RequestInit) => Response | Promise<Response> },
  userId: string,
): (path: string, init?: RequestInit) => Promise<Response> {
  return async (path, init) => {
    const token = await createSessionToken(userId);
    return app.request(path, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, ...init?.headers },
    });
  };
}
