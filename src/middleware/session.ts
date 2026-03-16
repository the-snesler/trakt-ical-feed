import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type { Context } from "hono";
import type { AppEnv, SessionData } from "../lib/types";
import { generateSessionId } from "../lib/tokens";

const SESSION_COOKIE = "sid";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days

export async function createSession(
  c: Context<AppEnv>,
  data: SessionData
): Promise<void> {
  const sessionId = generateSessionId();
  await c.env.SESSIONS.put(`session:${sessionId}`, JSON.stringify(data), {
    expirationTtl: SESSION_TTL,
  });
  setCookie(c, SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function destroySession(c: Context<AppEnv>): Promise<void> {
  const sessionId = getCookie(c, SESSION_COOKIE);
  if (sessionId) {
    await c.env.SESSIONS.delete(`session:${sessionId}`);
  }
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
}

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const sessionId = getCookie(c, SESSION_COOKIE);
  if (!sessionId) {
    return c.redirect("/");
  }

  const raw = await c.env.SESSIONS.get(`session:${sessionId}`);
  if (!raw) {
    deleteCookie(c, SESSION_COOKIE, { path: "/" });
    return c.redirect("/");
  }

  const session: SessionData = JSON.parse(raw);
  c.set("userId", session.userId);
  c.set("userName", session.traktUsername);
  await next();
});
