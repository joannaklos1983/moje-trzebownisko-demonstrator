import { DEMO_TODAY, DEMO_TOMORROW, MONTHS_SHORT } from "../data/demo";

/* Daty zapisujemy jako czas lokalny „RRRR-MM-DDTGG:MM”. Czas bieżący pochodzi ze stanu demo,
   nigdy z zegara systemowego. */

export function ts(s: string | null | undefined): number {
  return s ? new Date(s).getTime() : 0;
}

export function hm(d: Date): string {
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}

export function dayLabel(d: Date): string {
  const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  if (iso === DEMO_TODAY) return "Dziś";
  if (iso === DEMO_TOMORROW) return "Jutro";
  return d.getDate() + " " + MONTHS_SHORT[d.getMonth()];
}

/** Opis terminu z „Ważne od / do”, np. „Dziś, 8:00–14:00”. */
export function whenLabel(a: string, b: string): string {
  if (!a || !b) return "[termin]";
  const d1 = new Date(a);
  const d2 = new Date(b);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return "[termin]";
  if (d1.toDateString() === d2.toDateString()) return dayLabel(d1) + ", " + hm(d1) + "–" + hm(d2);
  return dayLabel(d1) + " " + hm(d1) + " – " + dayLabel(d2).toLowerCase() + " " + hm(d2);
}

/** „6.10.2026, 8:00”. */
export function formatDateTime(s: string | null | undefined): string {
  if (!s) return "–";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "–";
  return d.getDate() + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + d.getFullYear() + ", " + hm(d);
}
