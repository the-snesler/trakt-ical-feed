import { Hono } from "hono";
import type { AppEnv } from "../lib/types";
import { exchangeCode, getProfile } from "../lib/trakt";
import { encrypt } from "../lib/crypto";
import { upsertUser } from "../db/queries";
import { createSession, destroySession } from "../middleware/session";

const auth = new Hono<AppEnv>();

auth.get("/trakt", (c) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: c.env.TRAKT_CLIENT_ID,
    redirect_uri: `${new URL(c.req.url).origin}/auth/callback`,
  });

  return c.redirect(`https://trakt.tv/oauth/authorize?${params}`);
});

auth.get("/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) {
    return c.redirect("/?error=no_code");
  }

  const redirectUri = `${new URL(c.req.url).origin}/auth/callback`;

  try {
    const tokens = await exchangeCode(
      code,
      c.env.TRAKT_CLIENT_ID,
      c.env.TRAKT_CLIENT_SECRET,
      redirectUri
    );

    const profile = await getProfile(c.env.TRAKT_CLIENT_ID, tokens.access_token);

    const encryptedAccess = await encrypt(tokens.access_token, c.env.ENCRYPTION_KEY);
    const encryptedRefresh = await encrypt(tokens.refresh_token, c.env.ENCRYPTION_KEY);
    const expiresAt = tokens.created_at + tokens.expires_in;

    const user = await upsertUser(
      c.env.DB,
      profile.ids.slug,
      profile.username,
      encryptedAccess,
      encryptedRefresh,
      expiresAt
    );

    await createSession(c, {
      userId: String(user.id),
      traktUsername: user.trakt_username ?? profile.username,
      createdAt: Date.now(),
    });

    return c.redirect("/dashboard");
  } catch (e) {
    console.error("OAuth callback error:", e);
    return c.redirect("/?error=auth_failed");
  }
});

auth.post("/logout", async (c) => {
  await destroySession(c);
  return c.redirect("/");
});

export default auth;
