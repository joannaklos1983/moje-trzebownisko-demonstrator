import { MONTHS_SHORT, WEEKDAYS_SHORT } from "../data/demo";
import { LOCALITIES } from "../data/localities";
import { WASTE_FIRST_PICKUP, WASTE_FRACTIONS, WASTE_SCHEDULE_PATTERN } from "../data/waste";
import type { Locality, WasteFraction } from "../types";
import type { AppState } from "./state";

export interface WastePickup {
  date: string;
  fr: WasteFraction[];
  days: number;
}

export interface WasteView {
  loc: Locality;
  locNote: string;
  next: { date: string; rel: string; fr: WasteFraction[] };
  list: WastePickup[];
}

/* Dzień demo, od którego liczymy „za N dni” (6 października 2026). */
const WASTE_TODAY: [number, number, number] = [2026, 9, 6];

/** Przykładowy harmonogram dla miejscowości: pięć odbiorów co 7 dni, z przesunięciem zależnym od miejscowości. */
export function wasteSchedule(loc: Locality): WastePickup[] {
  const off = Math.max(0, LOCALITIES.indexOf(loc)) % 5;
  const [y, mo, d] = WASTE_FIRST_PICKUP;
  const today = new Date(WASTE_TODAY[0], WASTE_TODAY[1], WASTE_TODAY[2]);
  return WASTE_SCHEDULE_PATTERN.map((fr, i) => {
    const dt = new Date(y, mo, d + off + i * 7);
    return {
      date: WEEKDAYS_SHORT[dt.getDay()] + ", " + dt.getDate() + " " + MONTHS_SHORT[dt.getMonth()],
      fr: fr.map((k) => WASTE_FRACTIONS[k]),
      days: Math.round((dt.getTime() - today.getTime()) / 86400000),
    };
  });
}

/** Odpady dziedziczą „Moją miejscowość” aplikacji – bez własnego selektora.
    W widoku „Cała gmina” harmonogram pokazujemy dla miejscowości z Profilu. */
export function wasteView(s: AppState): WasteView {
  const list = wasteSchedule(s.loc);
  const nx = list[0];
  return {
    loc: s.loc,
    locNote: s.locPriority
      ? "Moja miejscowość. Zmienisz ją na Starcie lub w Profilu."
      : "Widok „Cała gmina” – harmonogram pokazujemy dla Twojej miejscowości z Profilu.",
    next: { date: nx.date, rel: nx.days === 1 ? "jutro" : "za " + nx.days + " dni", fr: nx.fr },
    list,
  };
}
