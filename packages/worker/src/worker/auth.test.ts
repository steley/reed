import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { feeds, users } from "../db/schema.ts";
import { hashPassword, verifyPassword } from "../lib/auth.ts";
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

const REGISTER = { email: "me@example.com", password: "hunter2hunter2" };

// ---------------------------------------------------------------------------
// lib/auth.ts — password hashing
// ---------------------------------------------------------------------------

describe("hashPassword / verifyPassword", () => {
  it("round-trips a correct password", () => {
    const hash = hashPassword("correct horse battery staple");
    expect(verifyPassword("correct horse battery staple", hash)).toBe(true);
  });

  it("rejects a wrong password", () => {
    expect(verifyPassword("wrong", hashPassword("right"))).toBe(false);
  });

  it("never verifies a malformed stored hash", () => {
    expect(verifyPassword("x", "scrypt:zz:zz")).toBe(false);
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", "plaintext")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------

describe("POST /api/auth/register", () => {
  it("creates a user and sets the session cookie", async () => {
    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(REGISTER),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body["email"]).toBe("me@example.com");
    expect(res.headers.get("set-cookie")).toContain("reed_session=");

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, body["id"] as string));
    expect(rows).toHaveLength(1);
    expect(verifyPassword(REGISTER.password, rows[0]!.passwordHash)).toBe(true);
  });

  it("rejects a duplicate email with 409", async () => {
    for (let i = 0; i < 2; i++) {
      const res = await app.request("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(REGISTER),
      });
      expect(res.status).toBe(i === 0 ? 201 : 409);
    }
  });

  it("rejects an invalid email and a short password with 400", async () => {
    for (const body of [
      { email: "not-an-email", password: "longenough1" },
      { email: "a@b.co", password: "short" },
    ]) {
      const res = await app.request("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      expect(res.status).toBe(400);
    }
  });

  it("requires the invite code when SIGNUP_CODE is set", async () => {
    vi.stubEnv("SIGNUP_CODE", "letmein");
    try {
      const noCode = await app.request("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(REGISTER),
      });
      expect(noCode.status).toBe(403);

      const wrong = await app.request("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...REGISTER, code: "nope" }),
      });
      expect(wrong.status).toBe(403);

      const right = await app.request("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...REGISTER, code: "letmein" }),
      });
      expect(right.status).toBe(201);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("the first registration claims the legacy user's feeds and folders", async () => {
    // Simulate the single-user era: legacy placeholder owns a folder + feed
    await db.insert(users).values({
      id: "legacy",
      email: "legacy@reed.invalid",
      passwordHash: "legacy",
      createdAt: 0,
    });
    await db.insert(feeds).values({
      userId: "legacy",
      id: "f-legacy",
      url: "https://old.example.com/feed",
      createdAt: 1,
    });

    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(REGISTER),
    });
    expect(res.status).toBe(201);
    const { id } = (await res.json()) as { id: string };

    const claimed = await db.select().from(feeds).where(eq(feeds.id, "f-legacy"));
    expect(claimed[0]?.userId).toBe(id);
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login + logout
// ---------------------------------------------------------------------------

describe("POST /api/auth/login", () => {
  it("logs in with correct credentials and sets the cookie", async () => {
    await db.insert(users).values({
      id: "u-login",
      email: "login@example.com",
      passwordHash: hashPassword("longenoughpass"),
      createdAt: 1,
    });
    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "login@example.com", password: "longenoughpass" }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("reed_session=");
  });

  it("returns 401 for a wrong password or unknown email", async () => {
    for (const body of [
      { email: "login@example.com", password: "wrongpassword" },
      { email: "ghost@example.com", password: "longenoughpass" },
    ]) {
      const res = await app.request("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      expect(res.status).toBe(401);
    }
  });

  it("logout clears the cookie", async () => {
    const res = await app.request("/api/auth/logout", { method: "POST" });
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});

// ---------------------------------------------------------------------------
// GET /api/auth/me + auth gate
// ---------------------------------------------------------------------------

describe("GET /api/auth/me", () => {
  it("returns the session user", async () => {
    const res = await call("/api/auth/me");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: "u1", email: "u1@test.local" });
  });

  it("returns 401 without a token or with a garbage token", async () => {
    expect((await app.request("/api/auth/me")).status).toBe(401);
    expect(
      (
        await app.request("/api/auth/me", {
          headers: { Authorization: "Bearer not-a-jwt" },
        })
      ).status,
    ).toBe(401);
  });
});

describe("auth gate on scoped routes", () => {
  it("401s anonymous requests to data routes", async () => {
    for (const path of ["/api/feeds", "/api/folders", "/api/articles", "/api/opml"]) {
      const res = await app.request(path);
      expect(res.status).toBe(401);
    }
  });

  it("leaves /api/health public", async () => {
    const res = await app.request("/api/health");
    expect(res.status).not.toBe(401);
  });
});
