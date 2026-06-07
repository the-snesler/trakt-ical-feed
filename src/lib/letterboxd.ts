import type { TraktHistoryEntry, TraktMovieRating } from "./types";

const HEADER = "Title,Year,WatchedDate,Rating10,Rewatch";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function toLetterboxdCsv(
  history: TraktHistoryEntry[],
  ratings: TraktMovieRating[]
): string {
  const ratingByTraktId = new Map<number, number>();
  for (const r of ratings) {
    if (r?.movie?.ids?.trakt && typeof r.rating === "number") {
      ratingByTraktId.set(r.movie.ids.trakt, r.rating);
    }
  }

  type Parsed = {
    entry: TraktHistoryEntry;
    watchedMs: number;
    watchedDate: string;
  };
  const parsed: Parsed[] = [];
  for (const e of history) {
    if (!e?.movie?.ids?.trakt) continue;
    const ts = e.watched_at;
    if (!ts || ts === "released") continue;
    const ms = Date.parse(ts);
    if (!Number.isFinite(ms)) continue;
    const datePart = ts.slice(0, 10);
    if (!DATE_RE.test(datePart)) continue;
    parsed.push({ entry: e, watchedMs: ms, watchedDate: datePart });
  }

  parsed.sort((a, b) => a.watchedMs - b.watchedMs);

  const seen = new Set<number>();
  const rows: string[] = [HEADER];
  for (const p of parsed) {
    const tid = p.entry.movie.ids.trakt;
    const isRewatch = seen.has(tid);
    seen.add(tid);
    const title = p.entry.movie.title ?? "";
    const year = p.entry.movie.year != null ? String(p.entry.movie.year) : "";
    const rating = ratingByTraktId.get(tid);
    const rating10 = typeof rating === "number" ? String(rating) : "";
    rows.push(
      [
        csvField(title),
        csvField(year),
        csvField(p.watchedDate),
        csvField(rating10),
        csvField(isRewatch ? "true" : "false"),
      ].join(",")
    );
  }

  return rows.join("\r\n") + "\r\n";
}

function csvField(v: string): string {
  if (/[",\r\n]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}
