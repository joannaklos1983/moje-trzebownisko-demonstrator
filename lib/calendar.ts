import { DEFAULT_ORGANIZER, EVENT_CATEGORIES, MONTH_NAMES, MONTH_NAMES_GENITIVE, ORGANIZER_BY_CATEGORY, WEEKDAY_HEADERS } from "../data/calendar";
import type { CalendarRange, EventOrganizer } from "../data/calendar";
import type { Message } from "../types";
import { isForMe, sentMessages, tier } from "./messages";
import type { AppState } from "./state";
import { ts } from "./time";

/* Kalendarz liczy wszystko od dnia demo (state.now), nigdy od zegara systemowego. */

export interface CalendarView {
  /** Opis zakresu miejscowości – ten sam kontekst co w całej aplikacji, bez drugiego selektora. */
  context: string;
  events: Message[];
  emptyText: string;
}

export interface DayRef {
  y: number;
  m: number;
  d: number;
}

export function toDayRef(date: Date): DayRef {
  return { y: date.getFullYear(), m: date.getMonth(), d: date.getDate() };
}

export function sameDay(a: DayRef, b: DayRef): boolean {
  return a.y === b.y && a.m === b.m && a.d === b.d;
}

/** Dzień demo. */
export function demoToday(s: AppState): DayRef {
  return toDayRef(new Date(s.now));
}

function dayStart(r: DayRef): number {
  return new Date(r.y, r.m, r.d, 0, 0, 0).getTime();
}
function dayEnd(r: DayRef): number {
  return new Date(r.y, r.m, r.d, 23, 59, 59).getTime();
}

/** Pierwszy i ostatni dzień zakresu. Tydzień: pon.–niedz.; weekend: sobota–niedziela tego tygodnia. */
export function rangeDays(now: string, range: CalendarRange): [DayRef, DayRef] {
  const d = new Date(now);
  const at = (offset: number) => toDayRef(new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset));
  const sinceMonday = (d.getDay() + 6) % 7;
  if (range === "today") return [at(0), at(0)];
  if (range === "weekend") return [at(5 - sinceMonday), at(6 - sinceMonday)];
  return [at(-sinceMonday), at(6 - sinceMonday)];
}

/** Początek i koniec zakresu jako znaczniki czasu. */
export function rangeBounds(now: string, range: CalendarRange): [number, number] {
  const [a, b] = rangeDays(now, range);
  return [dayStart(a), new Date(b.y, b.m, b.d, 23, 59, 0).getTime()];
}

export function isInRange(day: DayRef, from: DayRef, to: DayRef): boolean {
  return dayStart(day) >= dayStart(from) && dayStart(day) <= dayStart(to);
}

/** Wydarzenia = komunikaty z terminem w kategoriach wydarzeń; te same rekordy co w Powiadomieniach.
    Zakres miejscowości jak w całej aplikacji. */
export function calendarEvents(s: AppState, from: DayRef, to: DayRef): Message[] {
  const a = dayStart(from), b = dayEnd(to);
  return sentMessages(s)
    .filter((m) => EVENT_CATEGORIES.indexOf(m.cat) >= 0 && !!m.evStart && isForMe(s, m))
    .filter((m) => ts(m.evStart) <= b && ts(m.evEnd) >= a)
    .sort((x, y) => (ts(x.evStart) - ts(y.evStart)) || (tier(s, x) - tier(s, y)));
}

export function calendarContext(s: AppState): string {
  return s.locPriority ? s.loc + " + wydarzenia ogólnogminne" : "Cała gmina – wszystkie miejscowości";
}

export function calendarView(s: AppState, range: CalendarRange): CalendarView {
  const [from, to] = rangeDays(s.now, range);
  return {
    context: calendarContext(s),
    events: calendarEvents(s, from, to),
    emptyText: range === "today" ? "Dziś nie ma wydarzeń w kalendarzu." : range === "weekend" ? "W ten weekend nie ma wydarzeń w kalendarzu." : "W tym tygodniu nie ma wydarzeń w kalendarzu.",
  };
}

/* ---------- widok miesiąca ---------- */

/** Tygodnie miesiąca od poniedziałku; null = pusta komórka przed pierwszym / po ostatnim dniu. */
export function monthGrid(y: number, m: number): (number | null)[][] {
  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** Liczba wydarzeń w każdym dniu miesiąca (klucz: dzień miesiąca). */
export function eventCountsByDay(s: AppState, y: number, m: number): Record<number, number> {
  const out: Record<number, number> = {};
  const days = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const n = calendarEvents(s, { y, m, d }, { y, m, d }).length;
    if (n) out[d] = n;
  }
  return out;
}

export function shiftMonth(y: number, m: number, delta: number): { y: number; m: number } {
  const d = new Date(y, m + delta, 1);
  return { y: d.getFullYear(), m: d.getMonth() };
}

/* ---------- teksty ---------- */

export function monthTitle(y: number, m: number): string {
  return MONTH_NAMES[m] + " " + y;
}

/** „Środa, 7 października”. */
export function dayHeading(r: DayRef): string {
  const wd = (new Date(r.y, r.m, r.d).getDay() + 6) % 7;
  return WEEKDAY_HEADERS[wd].full + ", " + r.d + " " + MONTH_NAMES_GENITIVE[r.m];
}

/** „7 października”. */
export function dayLabel(r: DayRef): string {
  return r.d + " " + MONTH_NAMES_GENITIVE[r.m];
}

/** „10–11 października” albo „28 września – 4 października”. */
export function spanLabel(from: DayRef, to: DayRef): string {
  if (sameDay(from, to)) return dayLabel(from);
  if (from.m === to.m && from.y === to.y) return from.d + "–" + to.d + " " + MONTH_NAMES_GENITIVE[to.m];
  return dayLabel(from) + " – " + dayLabel(to);
}

/** „1 wydarzenie”, „2 wydarzenia”, „5 wydarzeń”, „brak wydarzeń”. */
export function eventsCountLabel(n: number): string {
  if (n === 0) return "brak wydarzeń";
  if (n === 1) return "1 wydarzenie";
  const last = n % 10, lastTwo = n % 100;
  return n + (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14) ? " wydarzenia" : " wydarzeń");
}

/* ---------- dane karty wydarzenia: tylko to, co naprawdę jest w rekordzie ---------- */

/** Usuwa pola do uzupełnienia w nawiasach kwadratowych, np. „Łąka, [adres boiska]” → „Łąka”. */
export function withoutPlaceholders(text: string | null | undefined): string {
  return (text || "").replace(/\[[^\]]*\]/g, "").replace(/\s{2,}/g, " ").replace(/^[\s,–-]+|[\s,–-]+$/g, "");
}

/** Godzina wydarzenia – tylko jeśli jest podana w opisie terminu (nie zgadujemy jej z pól technicznych). */
export function eventTime(m: Message): string {
  const match = withoutPlaceholders(m.when).match(/\d{1,2}:\d{2}(\s*[–-]\s*\d{1,2}:\d{2})?/);
  return match ? match[0] : "";
}

export function eventPlace(m: Message): string {
  return withoutPlaceholders(m.place);
}

/** Założenie demonstracyjne (DO SPRAWDZENIA) – nie jest pokazywane mieszkańcowi jako fakt. */
export function organizerOf(m: Message): EventOrganizer {
  return ORGANIZER_BY_CATEGORY[m.cat] || DEFAULT_ORGANIZER;
}
