import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { feeds, folders } from "../db/schema.ts";
import { authedRequest, createTestDb, seedUser } from "../lib/test-helpers.ts";
import { createApp } from "./index.ts";

let db: Awaited<ReturnType<typeof createTestDb>>;
let app: ReturnType<typeof createApp>;
let call: ReturnType<typeof authedRequest>;

beforeEach(async (ctx) => {
  db = await createTestDb(ctx);
  app = createApp(db);
  await seedUser(db, "u1");
  call = authedRequest(app, "u1");
});

// ---------------------------------------------------------------------------
// GET /api/folders
// ---------------------------------------------------------------------------

describe("GET /api/folders", () => {
  it("returns empty array when no folders exist", async () => {
    const res = await call("/api/folders");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns all folders", async () => {
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: Date.now() });
    const res = await call("/api/folders");
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// POST /api/folders
// ---------------------------------------------------------------------------

describe("POST /api/folders", () => {
  it("creates a folder and returns 201", async () => {
    const res = await call("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Tech" }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["name"]).toBe("Tech");
    expect(body["id"]).toBeTypeOf("string");
  });

  it("trims the name", async () => {
    const res = await call("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "  Tech  " }),
    });
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["name"]).toBe("Tech");
  });

  it("returns 409 on duplicate name", async () => {
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: Date.now() });
    const res = await call("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Tech" }),
    });
    expect(res.status).toBe(409);
  });

  it("returns 400 when name is missing or blank", async () => {
    for (const body of [{}, { name: "   " }]) {
      const res = await call("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      expect(res.status).toBe(400);
    }
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await call("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/folders/:id — rename
// ---------------------------------------------------------------------------

describe("PATCH /api/folders/:id", () => {
  it("renames a folder", async () => {
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: Date.now() });
    const res = await call("/api/folders/fol-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Technology" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["name"]).toBe("Technology");
  });

  it("returns 404 for unknown folder", async () => {
    const res = await call("/api/folders/nonexistent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Whatever" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 409 when renaming to an existing name", async () => {
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: Date.now() });
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-2", name: "News", createdAt: Date.now() });
    const res = await call("/api/folders/fol-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "News" }),
    });
    expect(res.status).toBe(409);
  });

  it("allows renaming a folder to its own name", async () => {
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: Date.now() });
    const res = await call("/api/folders/fol-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Tech" }),
    });
    expect(res.status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/folders/:id
// ---------------------------------------------------------------------------

describe("DELETE /api/folders/:id", () => {
  it("deletes the folder and moves its feeds out, returns 204", async () => {
    await db
      .insert(folders)
      .values({ userId: "u1", id: "fol-1", name: "Tech", createdAt: Date.now() });
    await db.insert(feeds).values({
      userId: "u1",
      id: "f1",
      url: "https://a.com/feed",
      folderId: "fol-1",
      createdAt: Date.now(),
    });

    const res = await call("/api/folders/fol-1", { method: "DELETE" });
    expect(res.status).toBe(204);

    const remainingFolders = await db.select().from(folders).where(eq(folders.id, "fol-1"));
    expect(remainingFolders).toHaveLength(0);

    // Feed survives, moved out of the folder
    const survivingFeeds = await db.select().from(feeds).where(eq(feeds.id, "f1"));
    expect(survivingFeeds).toHaveLength(1);
    expect(survivingFeeds[0]?.folderId).toBeNull();
  });

  it("returns 404 for unknown folder", async () => {
    const res = await call("/api/folders/nonexistent", { method: "DELETE" });
    expect(res.status).toBe(404);
  });
});
