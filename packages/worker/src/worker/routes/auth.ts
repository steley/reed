import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { feeds, folders, users } from "../../db/schema.ts";
import {
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  requireAuth,
  setSessionCookie,
  verifyPassword,
} from "../../lib/auth.ts";
import type { Variables } from "../index.ts";

export const authRouter = new Hono<{ Variables: Variables }>();

/**
 * The single-user era's rows belong to this placeholder user (see
 * drizzle/0002_multiuser.sql). The first real registration claims them, so a
 * deploy + register is all it takes to keep existing feeds — no backfill script.
 */
const LEGACY_USER_ID = "legacy";

function parseCredentials(body: unknown): { email: string; password: string } | null {
  const record = body as Record<string, unknown> | null;
  const email = record?.email;
  const password = record?.password;
  if (typeof email !== "string" || typeof password !== "string") return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return { email: email.trim().toLowerCase(), password };
}

async function jsonBody(c: { req: { json: () => Promise<unknown> } }): Promise<unknown | null> {
  try {
    return await c.req.json();
  } catch {
    return null;
  }
}

// POST /api/auth/register — { email, password, code? }. When SIGNUP_CODE is
// set the body must carry it; unset means registration is open.
authRouter.post("/register", async (c) => {
  const body = await jsonBody(c);
  if (body === null) return c.json({ error: "Invalid JSON body" }, 400);

  const requiredCode = process.env.SIGNUP_CODE;
  if (requiredCode && (body as Record<string, unknown>)["code"] !== requiredCode) {
    return c.json({ error: "Invalid invite code" }, 403);
  }

  const credentials = parseCredentials(body);
  if (!credentials) return c.json({ error: "Valid email and password are required" }, 400);
  if (credentials.password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters" }, 400);
  }

  const db = c.get("db");
  const id = crypto.randomUUID();
  try {
    await db.insert(users).values({
      id,
      email: credentials.email,
      passwordHash: hashPassword(credentials.password),
      createdAt: Date.now(),
    });
  } catch (err) {
    if (err instanceof Error && /UNIQUE|duplicate key/i.test(err.message)) {
      return c.json({ error: "Email already registered" }, 409);
    }
    throw err;
  }

  // First real account inherits the pre-multiuser data (owned by the legacy
  // placeholder, which can never log in). A brand-new user's tables have no
  // legacy rows, so this is a no-op for everyone after the first registrant.
  await db.update(folders).set({ userId: id }).where(eq(folders.userId, LEGACY_USER_ID));
  await db.update(feeds).set({ userId: id }).where(eq(feeds.userId, LEGACY_USER_ID));

  const token = await createSessionToken(id);
  setSessionCookie(c, token);
  return c.json({ id, email: credentials.email }, 201);
});

// POST /api/auth/login — { email, password }
authRouter.post("/login", async (c) => {
  const body = await jsonBody(c);
  if (body === null) return c.json({ error: "Invalid JSON body" }, 400);
  const credentials = parseCredentials(body);
  if (!credentials) return c.json({ error: "Invalid email or password" }, 401);

  const db = c.get("db");
  const rows = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, credentials.email))
    .limit(1);
  const user = rows[0];
  if (!user || !verifyPassword(credentials.password, user.passwordHash)) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const token = await createSessionToken(user.id);
  setSessionCookie(c, token);
  return c.json({ id: user.id, email: credentials.email });
});

// POST /api/auth/logout
authRouter.post("/logout", (c) => {
  clearSessionCookie(c);
  return c.json({ ok: true });
});

// GET /api/auth/me — session check for the SPA
authRouter.get("/me", requireAuth, async (c) => {
  const userId = c.get("userId");
  const db = c.get("db");
  const rows = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const user = rows[0];
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  return c.json(user);
});
