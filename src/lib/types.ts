export type AppEnv = {
  Bindings: CloudflareBindings;
  Variables: {
    userId: string;
    userName: string;
  };
};

export interface SessionData {
  userId: string;
  traktUsername: string;
  createdAt: number;
}

export interface UserRow {
  id: number;
  trakt_user_id: string;
  trakt_username: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: number;
  feed_token: string;
  created_at: string;
  updated_at: string;
}

export interface TraktTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface TraktUser {
  username: string;
  ids: {
    slug: string;
  };
}

export interface CalendarShow {
  first_aired: string;
  episode: {
    season: number;
    number: number;
    title: string;
    ids: { trakt: number };
  };
  show: {
    title: string;
    year: number;
    ids: { trakt: number; slug: string };
  };
}

export interface CalendarMovie {
  released: string;
  movie: {
    title: string;
    year: number;
    released: string;
    ids: { trakt: number; slug: string };
  };
}

export interface WatchlistMovie {
  movie: {
    title: string;
    year: number;
    released: string;
    ids: { trakt: number; slug: string };
  };
}

export interface WatchlistShow {
  show: {
    title: string;
    year: number;
    first_aired: string;
    ids: { trakt: number; slug: string };
  };
}
