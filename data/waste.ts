import type { WasteFraction, WasteFractionKey, WasteSortRule } from "../types";

/* Odpady – dane przykładowe. Moduł dziedziczy „Moją miejscowość” aplikacji. */

export const WASTE_FRACTIONS: Record<WasteFractionKey, WasteFraction> = {
  zm: { l: "Zmieszane", c: "#3C474C" },
  mt: { l: "Metale i tworzywa sztuczne", c: "#F2C200" },
  pa: { l: "Papier", c: "#137FB0" },
  sz: { l: "Szkło", c: "#2F824F" },
  bio: { l: "Bio", c: "#8B5A2B" },
};

/* Frakcje w kolejnych pięciu odbiorach (co 7 dni). */
export const WASTE_SCHEDULE_PATTERN: WasteFractionKey[][] = [["zm", "mt"], ["pa", "sz"], ["zm", "bio"], ["mt"], ["zm", "pa"]];

/* Pierwszy odbiór: 8 października 2026 (rok, indeks miesiąca, dzień) + przesunięcie zależne od miejscowości. */
export const WASTE_FIRST_PICKUP: [number, number, number] = [2026, 9, 8];

/* „Jak segregować”. */
export const WASTE_SORT_RULES: WasteSortRule[] = [
  { k: "pa", l: "Papier", c: "#137FB0", yes: "gazety, kartony, papier biurowy, zeszyty", no: "papier zatłuszczony, paragony, kartony po napojach" },
  { k: "sz", l: "Szkło", c: "#2F824F", yes: "butelki i słoiki szklane", no: "ceramika, szyby, lustra, żarówki" },
  { k: "mt", l: "Metale i tworzywa sztuczne", c: "#F2C200", yes: "butelki plastikowe, puszki, kartony po napojach", no: "opakowania po farbach i olejach, baterie" },
  { k: "bio", l: "Bio", c: "#8B5A2B", yes: "resztki warzyw i owoców, liście, skoszona trawa", no: "kości, odchody zwierząt, olej" },
  { k: "zm", l: "Zmieszane", c: "#3C474C", yes: "odpady, których nie da się posegregować", no: "odpady niebezpieczne, elektroodpady, gruz" },
];
