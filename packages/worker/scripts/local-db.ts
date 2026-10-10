/**
 * Initialise a local SQLite file database with the reed schema.
 * Usage:
 *   TURSO_DATABASE_URL=file:local.db pnpm --filter @reed/worker db:local
 * Then run the dev API against it:
 *   TURSO_DATABASE_URL=file:local.db pnpm --filter @reed/worker dev
 */
import { createClient } from "@libsql/client";
import { SCHEMA_SQL } from "../src/db/ddl.ts";

const url = process.env.TURSO_DATABASE_URL ?? "file:local.db";
const client = createClient({ url });
await client.executeMultiple(SCHEMA_SQL);
console.log(`Schema applied to ${url}`);
