import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import type { AppEnv } from "../lib/types";
import { Footer, footerStyles } from "../components/Footer";
import { BrandIcon, Icons } from "../components/icons";
import { css, Style } from "hono/css";

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
        <title>Trakt iCal Generator – Calendar Feed for Your Watchlist</title>
        <meta
          name="description"
          content="Generate an iCal calendar feed from your Trakt watchlist. Subscribe in Google Calendar, Apple Calendar, or Outlook to track air dates for TV shows and release dates for movies."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://trakt.samnesler.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trakt.samnesler.com/" />
        <meta
          property="og:title"
          content="Trakt iCal Generator – Calendar Feed for Your Watchlist"
        />
        <meta
          property="og:description"
          content="Generate an iCal calendar feed from your Trakt watchlist. Subscribe in Google Calendar, Apple Calendar, or Outlook to track air dates for TV shows and release dates for movies."
        />
        <meta
          property="og:image"
          content="https://trakt.samnesler.com/logo.svg"
        />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <Style>{styles}</Style>
      </head>
      <body>
        <div class="container">
          <section class="hero">
            <img src="/logo.svg" alt="Trakt iCal" class="logo" />
            <h1>Trakt iCal Feed</h1>
            <p class="tagline">
              Subscribe to your Trakt watchlist as a calendar feed. See air
              dates for shows and release dates for movies, right in your
              calendar app.
            </p>

            {error && (
              <p class="error">Authentication failed. Please try again.</p>
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

            <p class="reassure">
              <svg
                class="reassure-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Signs in via Trakt's official OAuth — your password never touches
              this app.
            </p>
          </section>

          <section class="features">
            <div class="feature">
              <div class="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3>Watchlist Calendar</h3>
              <p>
                Upcoming episodes and movie releases from your Trakt watchlist,
                delivered as a standard iCal feed.
              </p>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3>Works Everywhere</h3>
              <p>
                Google Calendar, Apple Calendar, Outlook — any app that supports
                URL subscriptions.
              </p>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                  <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
                </svg>
              </div>
              <h3>Always Fresh</h3>
              <p>
                Your calendar updates automatically as your watchlist changes.
                No manual syncing needed.
              </p>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3>Letterboxd Export</h3>
              <p>
                One-click CSV export of your Trakt watch history — ready to
                import into Letterboxd with ratings and rewatches intact.
              </p>
            </div>
          </section>

          <section class="shots">
            <figure class="shot shot-back">
              <div class="shot-frame">
                <img
                  src="/screenshots/dashboard.webp"
                  alt="The Trakt iCal dashboard showing the user's personal feed URL"
                  class="shot-img"
                />
              </div>
              <figcaption>
                The dashboard, where you grab your feed URL.
              </figcaption>
            </figure>
            <figure class="shot shot-front">
              <div class="shot-frame">
                <img
                  src="/screenshots/calendar.webp"
                  alt="A calendar app showing Trakt watchlist events populated from the feed"
                  class="shot-img"
                />
              </div>
              <figcaption>What it looks like once subscribed.</figcaption>
            </figure>
          </section>

          <section class="how">
            <h2 class="section-title">How it works</h2>
            <ol class="steps">
              <li class="step">
                <div class="step-num">1</div>
                <h3>Sign in with Trakt</h3>
                <p>One-click OAuth. Read-only access to your watchlist.</p>
              </li>
              <li class="step">
                <div class="step-num">2</div>
                <h3>Copy your feed URL</h3>
                <p>
                  A private, regenerable iCal URL appears on your dashboard.
                </p>
              </li>
              <li class="step">
                <div class="step-num">3</div>
                <h3>Subscribe in your calendar</h3>
                <p>
                  Paste into Google Calendar, Apple Calendar, Outlook — anything
                  that takes a URL.
                </p>
              </li>
            </ol>
          </section>

          <section class="compat">
            <span class="compat-label">Works with</span>
            <ul class="compat-list">
              <li>
                <BrandIcon icon={Icons.googleCalendar} size={18} />
                <span>Google Calendar</span>
              </li>
              <li>
                <BrandIcon icon={Icons.apple} size={18} />
                <span>Apple Calendar</span>
              </li>
              <li>
                <svg
                  class="compat-glyph"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Outlook</span>
              </li>
              <li class="compat-extra">
                <span>…and anything that reads iCal</span>
              </li>
            </ul>
          </section>

          <Footer />
        </div>
      </body>
    </html>,
  );
});

const styles = css`
  ${footerStyles}
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background:
      radial-gradient(
        ellipse 80% 60% at 50% -10%,
        rgba(237, 28, 36, 0.18),
        transparent 60%
      ),
      radial-gradient(
        ellipse 60% 50% at 100% 30%,
        rgba(237, 28, 36, 0.08),
        transparent 60%
      ),
      radial-gradient(
        ellipse 60% 50% at 0% 60%,
        rgba(120, 60, 200, 0.07),
        transparent 60%
      ),
      #0a0a0a;
    background-attachment: fixed;
    color: #e0e0e0;
    min-height: 100vh;
    line-height: 1.5;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(
      ellipse 80% 70% at 50% 30%,
      #000 30%,
      transparent 80%
    );
    -webkit-mask-image: radial-gradient(
      ellipse 80% 70% at 50% 30%,
      #000 30%,
      transparent 80%
    );
    pointer-events: none;
    z-index: 0;
  }
  .container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr min(720px, 100%) 1fr;
    margin: 0 auto;
    padding: 3rem 1.25rem 2rem;
    position: relative;
    z-index: 1;
  }
  .container > * {
    grid-column: 2;
  }
  .section-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #888;
    margin-bottom: 1rem;
    text-align: center;
  }

  /* Hero */
  .hero {
    text-align: center;
    margin-bottom: 3.5rem;
  }
  .logo {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
  }
  h1 {
    font-size: 2rem;
    color: #ed1c24;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }
  .tagline {
    color: #b3b3b3;
    line-height: 1.6;
    margin: 0 auto 1.5rem;
    max-width: 32rem;
  }
  .error {
    background: #2a1a1a;
    border: 1px solid #ed1c24;
    border-radius: 4px;
    padding: 0.75rem;
    color: #ed1c24;
    font-size: 0.85rem;
    margin: 0 auto 1rem;
    max-width: 24rem;
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
    transition: background 0.15s ease;
  }
  .btn-primary {
    background: #ed1c24;
    color: #fff;
  }
  .btn-primary:hover {
    background: #d41920;
  }
  .reassure {
    justify-content: center;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1rem;
    color: #888;
    font-size: 0.78rem;
  }
  .reassure-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  /* How it works */
  .how {
    margin-bottom: 3rem;
  }
  .steps {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .step {
    background: #141414;
    border: 1px solid #262626;
    border-radius: 8px;
    padding: 1.25rem;
  }
  .step-num {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: #ed1c24;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  .step h3 {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
  }
  .step p {
    font-size: 0.82rem;
    color: #999;
    line-height: 1.45;
  }

  /* Screenshots */
  .shots {
    display: block;
    margin: 3rem auto 3.5rem;
    padding: 0 1rem;
    grid-column: 1 / -1;
    max-width: 1200px;
  }
  .shot {
    margin: 0;
    width: 68%;
    transition: transform 0.3s ease;
    will-change: transform;
  }
  .shot-back {
    transform: rotate(-5deg);
    z-index: 1;
  }
  .shot-front {
    margin-left: auto;
    margin-top: 3rem;
    transform: rotate(4deg);
    z-index: 2;
  }
  .shot-back:hover {
    transform: rotate(-3deg) translateY(-4px);
  }
  .shot-front:hover {
    transform: rotate(2deg) translateY(-4px);
  }
  .shot-frame {
    position: relative;
    background: #141414;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    overflow: hidden;
    box-shadow:
      0 20px 40px -12px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.03);
  }
  .shot-img {
    width: 100%;
  }
  .shot figcaption {
    margin-top: 0.6rem;
    color: #888;
    font-size: 0.75rem;
    text-align: center;
  }

  /* Features */
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 3rem;
  }
  .feature {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1.25rem;
  }
  .feature-icon {
    width: 28px;
    height: 28px;
    color: #ed1c24;
    margin-bottom: 0.75rem;
  }
  .feature-icon svg {
    width: 100%;
    height: 100%;
  }
  .feature h3 {
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
  }
  .feature p {
    font-size: 0.85rem;
    color: #999;
    line-height: 1.5;
  }

  /* Compat row */
  .compat {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem 1.25rem;
    color: #777;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
  .compat-label {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.7rem;
    color: #666;
  }
  .compat-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem 1.25rem;
  }
  .compat-list li {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #888;
  }
  .compat-glyph {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  .compat-extra {
    font-style: italic;
    color: #666;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .container {
      padding: 2rem 1rem 1.5rem;
    }
    .logo {
      width: 96px;
      height: 96px;
    }
    h1 {
      font-size: 1.6rem;
    }
    .steps,
    .features {
      grid-template-columns: 1fr;
    }
    .shots {
      height: 280px;
    }
    .shot {
      width: 78%;
    }
  }
`;

export default home;
