import type { A11yKey, Category, ChannelKey, DemoTime, Locality } from "../types";

/* Czas w demonstratorze jest symulowany – aplikacja nie czyta zegara systemowego. */
export const DEMO_TODAY = "2026-10-06";
export const DEMO_TOMORROW = "2026-10-07";

/* Przełącznik „Czas demo” na pasku demonstratora. */
export const DEMO_TIMES: DemoTime[] = [
  { value: "2026-10-06T07:30", label: "7:30" },
  { value: "2026-10-06T10:30", label: "10:30" },
  { value: "2026-10-06T15:00", label: "15:00" },
];

/* Skróty nazw miesięcy i dni tygodnia. */
export const MONTHS_SHORT: string[] = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
export const WEEKDAYS_UPPER: string[] = ["ND", "PN", "WT", "ŚR", "CZ", "PT", "SB"];
export const WEEKDAYS_SHORT: string[] = ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sob"];

/* Wartości początkowe demonstratora (stan po „Resetuj demo”). */
export const INITIAL_NOW = "2026-10-06T10:30";
export const INITIAL_LOCALITY: Locality = "Jasionka";
export const INITIAL_UNREAD_IDS: string[] = ["wind", "waste-jas", "road-laka"];
export const INITIAL_FAVORITE_CATEGORIES: Category[] = ["Wydarzenia i kultura"];
export const INITIAL_CHANNELS: Record<ChannelKey, boolean> = { push: true, email: false, sms: false };
export const INITIAL_FAV_NOTIFY = false;
export const INITIAL_A11Y: Record<A11yKey, boolean> = { big: false, motion: false };
