import type { Category } from "../types";

/* Kalendarz (dodany po migracji) jest kolejnym widokiem tych samych komunikatów-wydarzeń,
   nie osobnym systemem treści. Źródła wydarzeń i integracja z kalendarzami jednostek: DO SPRAWDZENIA. */

export type CalendarRange = "today" | "weekend" | "week";

export const CALENDAR_RANGES: { value: CalendarRange; label: string }[] = [
  { value: "today", label: "Dziś" },
  { value: "weekend", label: "Weekend" },
  { value: "week", label: "Ten tydzień" },
];

/* Kategorie, których komunikaty z terminem są wydarzeniami (jak w podglądzie kalendarza w referencji). */
export const EVENT_CATEGORIES: Category[] = ["Wydarzenia i kultura", "Sport i OSiR"];

/* Źródło / organizator wydarzenia. ZAŁOŻENIE DEMONSTRACYJNE (DO SPRAWDZENIA): dane demo nie mają
   pola organizatora, więc przypisujemy go do kategorii. Docelowo powinien pochodzić ze źródła wydarzenia. */
export const EVENT_ORGANIZERS = ["Urząd", "Centrum Oświaty", "OSiR", "GCK"] as const;
export type EventOrganizer = (typeof EVENT_ORGANIZERS)[number];

export const ORGANIZER_BY_CATEGORY: Partial<Record<Category, EventOrganizer>> = {
  "Sport i OSiR": "OSiR",
  "Wydarzenia i kultura": "GCK",
  "Edukacja": "Centrum Oświaty",
};
export const DEFAULT_ORGANIZER: EventOrganizer = "Urząd";
