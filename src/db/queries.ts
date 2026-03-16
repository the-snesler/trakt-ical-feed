import type { UserRow } from "../lib/types";
import { generateFeedToken } from "../lib/tokens";

export async function getUserByTraktId(
  db: D1Database,
  traktUserId: string
): Promise<UserRow | null> {
  return db
    .prepare("SELECT * FROM users WHERE trakt_user_id = ?")
    .bind(traktUserId)
    .first<UserRow>();
}

export async function getUserById(
  db: D1Database,
  id: string
): Promise<UserRow | null> {
  return db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(id)
    .first<UserRow>();
}

export async function getUserByFeedToken(
  db: D1Database,
  feedToken: string
): Promise<UserRow | null> {
  return db
    .prepare("SELECT * FROM users WHERE feed_token = ?")
    .bind(feedToken)
    .first<UserRow>();
}

export async function upsertUser(
  db: D1Database,
  traktUserId: string,
  traktUsername: string,
  accessToken: string,
  refreshToken: string,
  tokenExpiresAt: number
): Promise<UserRow> {
  const existing = await getUserByTraktId(db, traktUserId);
  if (existing) {
    await db
      .prepare(
        `UPDATE users SET trakt_username = ?, access_token = ?, refresh_token = ?, token_expires_at = ?, updated_at = datetime('now') WHERE trakt_user_id = ?`
      )
      .bind(traktUsername, accessToken, refreshToken, tokenExpiresAt, traktUserId)
      .run();
    return {
      ...existing,
      trakt_username: traktUsername,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: tokenExpiresAt,
    };
  }

  const feedToken = generateFeedToken();
  await db
    .prepare(
      `INSERT INTO users (trakt_user_id, trakt_username, access_token, refresh_token, token_expires_at, feed_token)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(traktUserId, traktUsername, accessToken, refreshToken, tokenExpiresAt, feedToken)
    .run();

  return db
    .prepare("SELECT * FROM users WHERE trakt_user_id = ?")
    .bind(traktUserId)
    .first<UserRow>() as Promise<UserRow>;
}

export async function updateTokens(
  db: D1Database,
  userId: number,
  accessToken: string,
  refreshToken: string,
  tokenExpiresAt: number
): Promise<void> {
  await db
    .prepare(
      `UPDATE users SET access_token = ?, refresh_token = ?, token_expires_at = ?, updated_at = datetime('now') WHERE id = ?`
    )
    .bind(accessToken, refreshToken, tokenExpiresAt, userId)
    .run();
}

export async function regenerateFeedToken(
  db: D1Database,
  userId: number
): Promise<string> {
  const newToken = generateFeedToken();
  await db
    .prepare(
      `UPDATE users SET feed_token = ?, updated_at = datetime('now') WHERE id = ?`
    )
    .bind(newToken, userId)
    .run();
  return newToken;
}
