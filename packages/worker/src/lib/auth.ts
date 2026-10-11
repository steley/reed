import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { sign, verify } from "hono/jwt";
import type { Variables } from "../worker/index.ts";

type Env = { Variables: Variables };

const SESSION_COOKIE = "reed_session";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Password hashing with Node's built-in scrypt (no bcrypt dependency).
 * Stored format: `scrypt:<salt hex>:<hash hex>`.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

/** Constant-time password check. Malformed stored hashes never verify. */
export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  try {
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function authSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set — cannot issue or verify sessions");
  }
  return secret;
}

export async function createSessionToken(userId: string): Promise<string> {
  return sign(
    { sub: userId, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS },
    authSecret(),
    "HS256",
  );
}

/**
 * Require a valid session. Accepts the HttpOnly cookie (browser) or an
 * `Authorization: Bearer <token>` header (future CLI). On success the user id
 * is available as `c.get("userId")`.
 */
export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const token =
    getCookie(c, SESSION_COOKIE) ?? c.req.header("authorization")?.slice("Bearer ".length);
  if (!token) return c.json({ error: "Unauthorized" }, 401);
  try {
    const payload = await verify(token, authSecret(), "HS256");
    if (typeof payload.sub !== "string") throw new Error("no subject");
    c.set("userId", payload.sub);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

export function setSessionCookie(
  c: { header: (name: string, value: string) => void },
  token: string,
): void {
  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
  );
}

export function clearSessionCookie(c: { header: (name: string, value: string) => void }): void {
  c.header("Set-Cookie", `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
}
