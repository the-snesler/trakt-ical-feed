import { Hono } from "hono";
import type { AppEnv } from "../lib/types";
import { getUserByFeedToken, updateTokens } from "../db/queries";
import { decrypt, encrypt } from "../lib/crypto";
import { refreshAccessToken, fetchCalendarShows, fetchCalendarMovies } from "../lib/trakt";
import { generateCalendar } from "../lib/ical";

const feed = new Hono<AppEnv>();

feed.get("/:feedToken", async (c) => {
  const feedToken = c.req.param("feedToken");
  const user = await getUserByFeedToken(c.env.DB, feedToken);

  if (!user) {
    return c.text("Not found", 404);
  }

  let accessToken = await decrypt(user.access_token, c.env.ENCRYPTION_KEY);

  // Refresh token if expired (with 5 minute buffer)
  const now = Math.floor(Date.now() / 1000);
  if (user.token_expires_at && now >= user.token_expires_at - 300) {
    try {
      const refreshToken = await decrypt(user.refresh_token, c.env.ENCRYPTION_KEY);
      const redirectUri = `${new URL(c.req.url).origin}/auth/callback`;
      const newTokens = await refreshAccessToken(
        refreshToken,
        c.env.TRAKT_CLIENT_ID,
        c.env.TRAKT_CLIENT_SECRET,
        redirectUri
      );

      accessToken = newTokens.access_token;
      const encryptedAccess = await encrypt(newTokens.access_token, c.env.ENCRYPTION_KEY);
      const encryptedRefresh = await encrypt(newTokens.refresh_token, c.env.ENCRYPTION_KEY);
      const expiresAt = newTokens.created_at + newTokens.expires_in;

      await updateTokens(c.env.DB, user.id, encryptedAccess, encryptedRefresh, expiresAt);
    } catch (e) {
      console.error("Token refresh failed:", e);
      return c.text("Token refresh failed — please re-authenticate", 401);
    }
  }

  try {
    const [shows, movies] = await Promise.all([
      fetchCalendarShows(c.env.TRAKT_CLIENT_ID, accessToken),
      fetchCalendarMovies(c.env.TRAKT_CLIENT_ID, accessToken),
    ]);

    const ical = generateCalendar(shows, movies);

    return c.body(ical, 200, {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="trakt.ics"',
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    });
  } catch (e) {
    console.error("Feed generation failed:", e);
    return c.text("Failed to generate feed", 500);
  }
});

export default feed;
