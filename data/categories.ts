import type { Category, IconName } from "../types";

/* Kategoria = „czego szukam / co mnie interesuje?”. Nie jest osobnym modułem.
   Zestaw 1:1 z demonstratora – aktualizacja do briefu to osobny etap po migracji. */

/* Kategorie komunikatów (główne + pomocnicze) – CATS. */
export const CATEGORIES: Category[] = [
  "Woda i awarie",
  "Odpady",
  "Drogi, transport i inwestycje",
  "Wydarzenia i kultura",
  "Sport i OSiR",
  "Zdrowie",
  "Edukacja",
  "Urząd / dla mieszkańca",
  "Pogoda i jakość powietrza",
  "Inne",
];

/* Kategorie główne na pulpicie – MAIN_CATS. */
export const MAIN_CATEGORIES: Category[] = [
  "Wydarzenia i kultura",
  "Sport i OSiR",
  "Zdrowie",
  "Drogi, transport i inwestycje",
  "Edukacja",
  "Urząd / dla mieszkańca",
];

/* Ile kategorii widać na Starcie przed kliknięciem „Pokaż wszystkie kategorie” (dodane po migracji). */
export const CATEGORIES_COLLAPSED_COUNT = 3;

export const CATEGORY_ICON: Record<Category, IconName> = {
  "Woda i awarie": "drop",
  "Odpady": "trash",
  "Drogi, transport i inwestycje": "road",
  "Wydarzenia i kultura": "ticket",
  "Sport i OSiR": "sport",
  "Zdrowie": "heart",
  "Edukacja": "edu",
  "Urząd / dla mieszkańca": "office",
  "Pogoda i jakość powietrza": "cloud",
  "Inne": "dots",
};
