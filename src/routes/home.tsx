import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import type { AppEnv } from "../lib/types";

const home = new Hono<AppEnv>();

home.get("/", async (c) => {
  const sessionId = getCookie(c, "sid");
  let loggedIn = false;
  if (sessionId) {
    const raw = await c.env.SESSIONS.get(`session:${sessionId}`);
    if (raw) loggedIn = true;
  }

  const error = c.req.query("error");

  return c.html(
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Trakt iCal Feed</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <style>{styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="hero">
            <img src="/logo.svg" alt="Trakt iCal" class="logo" />
            <h1>Trakt iCal Feed</h1>
            <p class="tagline">
              Subscribe to your Trakt watchlist as a calendar feed.
              See air dates for shows and release dates for movies,
              right in your calendar app.
            </p>

            {error && (
              <p class="error">
                Authentication failed. Please try again.
              </p>
            )}

            {loggedIn ? (
              <a href="/dashboard" class="btn btn-primary">
                Go to Dashboard
              </a>
            ) : (
              <a href="/auth/trakt" class="btn btn-primary">
                Login with Trakt
              </a>
            )}
          </div>

          <div class="features">
            <div class="feature">
              <h3>Watchlist Calendar</h3>
              <p>Upcoming episodes and movie releases from your Trakt watchlist, delivered as a standard iCal feed.</p>
            </div>
            <div class="feature">
              <h3>Works Everywhere</h3>
              <p>Google Calendar, Apple Calendar, Outlook — any app that supports URL subscriptions.</p>
            </div>
            <div class="feature">
              <h3>Always Fresh</h3>
              <p>Your calendar updates automatically as your watchlist changes. No manual syncing needed.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
});

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background: #0f0f0f;
    color: #e0e0e0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container { max-width: 560px; padding: 2rem 1rem; text-align: center; }
  .hero { margin-bottom: 3rem; }
  .logo { width: 256px; height: 256px; margin-bottom: 1rem; }
  h1 { font-size: 2rem; color: #ed1c24; margin-bottom: 1rem; }
  .tagline { color: #999; line-height: 1.6; margin-bottom: 1.5rem; }
  .error {
    background: #2a1a1a;
    border: 1px solid #ed1c24;
    border-radius: 4px;
    padding: 0.75rem;
    color: #ed1c24;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  .btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
  }
  .btn-primary {
    background: #ed1c24;
    color: #fff;
  }
  .btn-primary:hover { background: #d41920; }
  .features {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: left;
  }
  .feature {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1.25rem;
  }
  .feature h3 { font-size: 0.95rem; margin-bottom: 0.4rem; }
  .feature p { font-size: 0.85rem; color: #999; line-height: 1.5; }
`;

export default home;
