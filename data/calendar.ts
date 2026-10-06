import type { Category } from "../types";

/* Kalendarz (dodany po migracji) jest kolejnym widokiem tych samych komunikatów-wydarzeń,
   nie osobnym systemem treści. Źródła wydarzeń (Urząd, Centrum Oświaty, OSiR, GCK)
   i integracja z ich kalendarzami: DO SPRAWDZENIA. */

export type CalendarRange = "today" | "weekend" | "week";

export const CALENDAR_RANGES: { value: CalendarRange; label: string }[] = [
  { value: "today", label: "Dziś" },
  { value: "weekend", label: "Weekend" },
  { value: "week", label: "Ten tydzień" },
];

/* Kategorie, których komunikaty z terminem są wydarzeniami (jak w podglądzie kalendarza w referencji). */
export const EVENT_CATEGORIES: Category[] = ["Wydarzenia i kultura", "Sport i OSiR"];

/* Nazwy do widoku miesiąca i nagłówka dnia. */
export const WEEKDAY_HEADERS: { short: string; full: string }[] = [
  { short: "Pn", full: "Poniedziałek" },
  { short: "Wt", full: "Wtorek" },
  { short: "Śr", full: "Środa" },
  { short: "Cz", full: "Czwartek" },
  { short: "Pt", full: "Piątek" },
  { short: "So", full: "Sobota" },
  { short: "Nd", full: "Niedziela" },
];
export const MONTH_NAMES: string[] = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
export const MONTH_NAMES_GENITIVE: string[] = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

/* Źródło / organizator wydarzenia. ZAŁOŻENIE DEMONSTRACYJNE – DO SPRAWDZENIA: dane demo nie mają
   pola organizatora, więc to przypisanie do kategorii NIE jest pokazywane mieszkańcowi jako fakt.
   Zostaje w danych do czasu potwierdzenia źródeł z dostawcą i jednostkami. */
export const EVENT_ORGANIZERS = ["Urząd", "Centrum Oświaty", "OSiR", "GCK"] as const;
export type EventOrganizer = (typeof EVENT_ORGANIZERS)[number];

export const ORGANIZER_BY_CATEGORY: Partial<Record<Category, EventOrganizer>> = {
  "Sport i OSiR": "OSiR",
  "Wydarzenia i kultura": "GCK",
  "Edukacja": "Centrum Oświaty",
};
export const DEFAULT_ORGANIZER: EventOrganizer = "Urząd";
