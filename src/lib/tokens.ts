function generateToken(byteLength: number = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSessionId(): string {
  return generateToken(32);
}

export function generateFeedToken(): string {
  return generateToken(32);
}
