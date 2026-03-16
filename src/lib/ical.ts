import ical from "ical-generator";
import dayjs from "dayjs";
import type { CalendarShow, CalendarMovie } from "./types";

export function generateCalendar(shows: CalendarShow[], movies: CalendarMovie[], allDay: boolean = false): string {
  const calendar = ical({ name: "Trakt Watchlist Calendar", timezone: "UTC" });

  for (const item of shows) {
    if (!item.first_aired) continue;

    const event = calendar.createEvent({
      start: dayjs(item.first_aired).toDate(),
      summary: `${item.show.title} S${String(item.episode.season).padStart(2, "0")}E${String(item.episode.number).padStart(2, "0")}`,
      description: item.episode.title ?? "",
      allDay,
    });
    event.uid(`trakt-show-${item.episode.ids.trakt}`);
  }

  for (const item of movies) {
    const releaseDate = item.released || item.movie?.released;
    if (!releaseDate) continue;

    const event = calendar.createEvent({
      start: dayjs(releaseDate).toDate(),
      summary: item.movie.title,
      allDay: true,
    });
    event.uid(`trakt-movie-${item.movie.ids.trakt}`);
  }

  return calendar.toString();
}
