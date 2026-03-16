CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trakt_user_id TEXT UNIQUE NOT NULL,
  trakt_username TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at INTEGER,
  feed_token TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_trakt_user_id ON users(trakt_user_id);
CREATE INDEX IF NOT EXISTS idx_users_feed_token ON users(feed_token);
