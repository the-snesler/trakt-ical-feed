import type {
  TraktTokenResponse,
  TraktUser,
  CalendarShow,
  CalendarMovie,
} from "./types";

const TRAKT_API = "https://api.trakt.tv";

function headers(clientId: string, accessToken?: string): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    "trakt-api-key": clientId,
    "trakt-api-version": "2",
  };
  if (accessToken) {
    h["Authorization"] = `Bearer ${accessToken}`;
  }
  return h;
}

export async function exchangeCode(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<TraktTokenResponse> {
  const res = await fetch(`${TRAKT_API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status}`);
  }

  return res.json();
}

export async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<TraktTokenResponse> {
  const res = await fetch(`${TRAKT_API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  return res.json();
}

export async function getProfile(
  clientId: string,
  accessToken: string
): Promise<TraktUser> {
  const res = await fetch(`${TRAKT_API}/users/me`, {
    headers: headers(clientId, accessToken),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }

  return res.json();
}

export async function fetchCalendarShows(
  clientId: string,
  accessToken: string,
  days: number = 33
): Promise<CalendarShow[]> {
  const startDate = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${TRAKT_API}/calendars/my/shows/${startDate}/${days}`,
    { headers: headers(clientId, accessToken) }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch calendar shows: ${res.status}`);
  }

  return res.json();
}

export async function fetchCalendarMovies(
  clientId: string,
  accessToken: string,
  days: number = 33
): Promise<CalendarMovie[]> {
  const startDate = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${TRAKT_API}/calendars/my/movies/${startDate}/${days}`,
    { headers: headers(clientId, accessToken) }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch calendar movies: ${res.status}`);
  }

  return res.json();
}
