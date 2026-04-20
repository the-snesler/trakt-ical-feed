import type { UserRow } from "./types";
import { decrypt, encrypt } from "./crypto";
import { refreshAccessToken } from "./trakt";
import { updateTokens } from "../db/queries";

export async function getValidAccessToken(
  env: CloudflareBindings,
  user: UserRow,
  origin: string
): Promise<string> {
  const accessToken = await decrypt(user.access_token, env.ENCRYPTION_KEY);

  const now = Math.floor(Date.now() / 1000);
  if (!user.token_expires_at || now < user.token_expires_at - 300) {
    return accessToken;
  }

  const refreshToken = await decrypt(user.refresh_token, env.ENCRYPTION_KEY);
  const newTokens = await refreshAccessToken(
    refreshToken,
    env.TRAKT_CLIENT_ID,
    env.TRAKT_CLIENT_SECRET,
    `${origin}/auth/callback`
  );

  const encryptedAccess = await encrypt(newTokens.access_token, env.ENCRYPTION_KEY);
  const encryptedRefresh = await encrypt(newTokens.refresh_token, env.ENCRYPTION_KEY);
  const expiresAt = newTokens.created_at + newTokens.expires_in;

  await updateTokens(env.DB, user.id, encryptedAccess, encryptedRefresh, expiresAt);

  return newTokens.access_token;
}
