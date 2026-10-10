import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { feeds, folders } from "../../db/schema.ts";
import type { Variables } from "../index.ts";

export const foldersRouter = new Hono<{ Variables: Variables }>();

function parseName(body: unknown): string | null {
  const name = (body as Record<string, unknown> | null)?.name;
  return typeof name === "string" && name.trim() ? name.trim() : null;
}

// GET /api/folders
foldersRouter.get("/", async (c) => {
  const db = c.get("db");
  const rows = await db.select().from(folders).orderBy(folders.createdAt);
  return c.json(rows);
});

// POST /api/folders
foldersRouter.post("/", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const name = parseName(body);
  if (!name) {
    return c.json({ error: "name is required" }, 400);
  }

  const db = c.get("db");

  const existing = await db
    .select({ id: folders.id })
    .from(folders)
    .where(eq(folders.name, name))
    .limit(1);
  if (existing.length > 0) {
    return c.json({ error: "Folder name already exists" }, 409);
  }

  const id = crypto.randomUUID();
  await db.insert(folders).values({ id, name, createdAt: Date.now() });

  const created = await db.select().from(folders).where(eq(folders.id, id)).limit(1);
  return c.json(created[0], 201);
});

// PATCH /api/folders/:id — rename
foldersRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const name = parseName(body);
  if (!name) {
    return c.json({ error: "name is required" }, 400);
  }

  const db = c.get("db");

  const existing = await db
    .select({ id: folders.id })
    .from(folders)
    .where(eq(folders.id, id))
    .limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Folder not found" }, 404);
  }

  const duplicate = await db
    .select({ id: folders.id })
    .from(folders)
    .where(eq(folders.name, name))
    .limit(1);
  if (duplicate[0] && duplicate[0].id !== id) {
    return c.json({ error: "Folder name already exists" }, 409);
  }

  await db.update(folders).set({ name }).where(eq(folders.id, id));

  const updated = await db.select().from(folders).where(eq(folders.id, id)).limit(1);
  return c.json(updated[0]);
});

// DELETE /api/folders/:id — feeds fall back to uncategorized, not deleted.
// Done explicitly (not via the FK's ON DELETE SET NULL) because libsql does
// not guarantee foreign_keys pragma is enabled in every environment.
foldersRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");

  const existing = await db
    .select({ id: folders.id })
    .from(folders)
    .where(eq(folders.id, id))
    .limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Folder not found" }, 404);
  }

  await db.update(feeds).set({ folderId: null }).where(eq(feeds.folderId, id));
  await db.delete(folders).where(eq(folders.id, id));
  return new Response(null, { status: 204 });
});
