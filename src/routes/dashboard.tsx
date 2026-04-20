import { Hono } from "hono";
import type { AppEnv } from "../lib/types";
import { requireAuth } from "../middleware/session";
import { getUserById, regenerateFeedToken } from "../db/queries";
import { getValidAccessToken } from "../lib/auth";
import { fetchWatchlistMovies, fetchWatchlistShows } from "../lib/trakt";

const dashboard = new Hono<AppEnv>();

dashboard.use("*", requireAuth);

dashboard.get("/", async (c) => {
  const userId = c.get("userId");
  const userName = c.get("userName");
  const user = await getUserById(c.env.DB, userId);

  if (!user) {
    return c.redirect("/");
  }

  const origin = new URL(c.req.url).origin;
  const feedUrl = `${origin}/feed/${user.feed_token}`;
  const emptyKind = c.req.query("empty");
  const emptyMessage =
    emptyKind === "movie"
      ? "No released movies on your watchlist."
      : emptyKind === "show"
        ? "No released shows on your watchlist."
        : null;

  return c.html(
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dashboard — Trakt iCal</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <style>{styles}</style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="header-brand">
              <img src="/logo.svg" alt="" class="header-logo" />
              <h1>Trakt iCal Feed</h1>
            </div>
            <div class="user-info">
              <span>
                Signed in as <strong>{userName}</strong>
              </span>
              <form method="post" action="/auth/logout" style="display:inline">
                <button type="submit" class="btn btn-sm">
                  Logout
                </button>
              </form>
            </div>
          </header>

          <section class="card">
            <h2>Your Feed URL</h2>
            <p class="description">
              Add this URL to your calendar app (Google Calendar, Apple
              Calendar, Outlook) to subscribe to your Trakt watchlist.
            </p>
            <div class="feed-url-group">
              <input
                type="text"
                readonly
                value={feedUrl}
                id="feed-url"
                class="feed-url"
              />
              <button onclick="copyUrl()" class="btn" id="copy-btn">
                Copy
              </button>
            </div>
            <label class="checkbox-label">
              <input
                type="checkbox"
                id="allday-toggle"
                onchange="toggleAllDay()"
              />
              All-day events
            </label>
          </section>

          <section class="card">
            <h2>Pick something to watch</h2>
            <p class="description">
              While you're here: Pulls a random released title from your
              watchlist and opens it on Trakt.
            </p>
            <div class="btn-row">
              <a
                href="/dashboard/random/movie"
                target="_blank"
                rel="noopener"
                class="btn"
              >
                Random Movie ↗
              </a>
              <a
                href="/dashboard/random/show"
                target="_blank"
                rel="noopener"
                class="btn"
              >
                Random Show ↗
              </a>
            </div>
            {emptyMessage && <p class="pick-empty">{emptyMessage}</p>}
          </section>

          <section class="card">
            <h2>Regenerate Feed URL</h2>
            <p class="description">
              If your feed URL is compromised, regenerate it. The old URL will
              stop working immediately.
            </p>
            <form method="post" action="/feed/regenerate">
              <button type="submit" class="btn btn-danger">
                Regenerate Token
              </button>
            </form>
          </section>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          var baseUrl = document.getElementById('feed-url').getAttribute('value');
          function updateUrl() {
            var input = document.getElementById('feed-url');
            var allday = document.getElementById('allday-toggle').checked;
            input.value = allday ? baseUrl + '?allday=1' : baseUrl;
          }
          function toggleAllDay() { updateUrl(); }
          function copyUrl() {
            var input = document.getElementById('feed-url');
            navigator.clipboard.writeText(input.value).then(function() {
              var btn = document.getElementById('copy-btn');
              btn.textContent = 'Copied!';
              setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
            });
          }
        `,
          }}
        />
      </body>
    </html>,
  );
});

dashboard.post("/feed/regenerate", async (c) => {
  const userId = c.get("userId");
  await regenerateFeedToken(c.env.DB, Number(userId));
  return c.redirect("/dashboard");
});

dashboard.get("/random/:kind{movie|show}", async (c) => {
  const kind = c.req.param("kind") as "movie" | "show";
  const userId = c.get("userId");
  const user = await getUserById(c.env.DB, userId);

  if (!user) {
    return c.redirect("/");
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(
      c.env,
      user,
      new URL(c.req.url).origin,
    );
  } catch (e) {
    console.error("Token refresh failed:", e);
    return c.text("Token refresh failed — please re-authenticate", 401);
  }

  const now = Date.now();

  try {
    if (kind === "movie") {
      const items = await fetchWatchlistMovies(
        c.env.TRAKT_CLIENT_ID,
        accessToken,
      );
      const released = items.filter((i) => {
        const t = Date.parse(i.movie?.released);
        return !isNaN(t) && t <= now;
      });
      if (released.length === 0) return c.redirect("/dashboard?empty=movie");
      const pick = released[Math.floor(Math.random() * released.length)];
      return c.redirect(`https://trakt.tv/movies/${pick.movie.ids.slug}`);
    } else {
      const items = await fetchWatchlistShows(
        c.env.TRAKT_CLIENT_ID,
        accessToken,
      );
      const released = items.filter((i) => {
        const t = Date.parse(i.show?.first_aired);
        return !isNaN(t) && t <= now;
      });
      if (released.length === 0) return c.redirect("/dashboard?empty=show");
      const pick = released[Math.floor(Math.random() * released.length)];
      return c.redirect(`https://trakt.tv/shows/${pick.show.ids.slug}`);
    }
  } catch (e) {
    console.error("Random pick failed:", e);
    return c.text("Failed to pick a random title", 500);
  }
});

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background: #0f0f0f;
    color: #e0e0e0;
    min-height: 100vh;
  }
  .container { max-width: 640px; margin: 0 auto; padding: 2rem 1rem; }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #333;
  }
  .header-brand { display: flex; align-items: center; gap: 0.75rem; }
  .header-logo { width: 32px; height: 32px; }
  h1 { font-size: 1.5rem; color: #ed1c24; }
  h2 { font-size: 1.1rem; margin-bottom: 0.5rem; }
  .user-info { display: flex; align-items: center; gap: 1rem; font-size: 0.9rem; }
  .card {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  .description { font-size: 0.85rem; color: #999; margin-bottom: 1rem; }
  .feed-url-group { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #ccc;
    cursor: pointer;
  }
  .checkbox-label input { cursor: pointer; }
  .feed-url {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: #111;
    border: 1px solid #444;
    border-radius: 4px;
    color: #e0e0e0;
    font-family: monospace;
    font-size: 0.8rem;
  }
  .btn {
    padding: 0.5rem 1rem;
    border: 1px solid #555;
    border-radius: 4px;
    background: #2a2a2a;
    color: #e0e0e0;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .btn:hover { background: #333; }
  .btn-sm { padding: 0.3rem 0.75rem; font-size: 0.8rem; }
  .btn-danger { border-color: #ed1c24; color: #ed1c24; }
  .btn-danger:hover { background: #2a1a1a; }
  a.btn { display: inline-block; text-decoration: none; }
  .btn-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .pick-empty { margin-top: 0.75rem; font-size: 0.85rem; color: #999; }
`;

export default dashboard;
