import { DEFAULT_ORGANIZER, EVENT_CATEGORIES, ORGANIZER_BY_CATEGORY } from "../data/calendar";
import type { CalendarRange, EventOrganizer } from "../data/calendar";
import type { Message } from "../types";
import { isForMe, sentMessages, tier } from "./messages";
import type { AppState } from "./state";
import { ts } from "./time";

export interface CalendarView {
  /** Opis zakresu miejscowości – ten sam kontekst co w całej aplikacji, bez drugiego selektora. */
  context: string;
  events: Message[];
  emptyText: string;
}

/** Początek i koniec zakresu liczone od dnia demo (nie od zegara systemowego). Tydzień: pon.–niedz. */
export function rangeBounds(now: string, range: CalendarRange): [number, number] {
  const d = new Date(now);
  const day = (offset: number, end: boolean) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset, end ? 23 : 0, end ? 59 : 0, end ? 59 : 0).getTime();
  const sinceMonday = (d.getDay() + 6) % 7;
  if (range === "today") return [day(0, false), day(0, true)];
  if (range === "weekend") return [day(5 - sinceMonday, false), day(6 - sinceMonday, true)];
  return [day(-sinceMonday, false), day(6 - sinceMonday, true)];
}

export function organizerOf(m: Message): EventOrganizer {
  return ORGANIZER_BY_CATEGORY[m.cat] || DEFAULT_ORGANIZER;
}

/** Wydarzenia = komunikaty z terminem w kategoriach wydarzeń; te same rekordy co w Powiadomieniach. */
export function calendarView(s: AppState, range: CalendarRange): CalendarView {
  const [from, to] = rangeBounds(s.now, range);
  const events = sentMessages(s)
    .filter((m) => EVENT_CATEGORIES.indexOf(m.cat) >= 0 && !!m.evStart && isForMe(s, m))
    .filter((m) => ts(m.evStart) <= to && ts(m.evEnd) >= from)
    .sort((a, b) => (ts(a.evStart) - ts(b.evStart)) || (tier(s, a) - tier(s, b)));
  return {
    context: s.locPriority ? s.loc + " + wydarzenia ogólnogminne" : "Cała gmina – wszystkie miejscowości",
    events,
    emptyText: range === "today" ? "Dziś nie ma wydarzeń w kalendarzu." : range === "weekend" ? "W ten weekend nie ma wydarzeń w kalendarzu." : "W tym tygodniu nie ma wydarzeń w kalendarzu.",
  };
}
