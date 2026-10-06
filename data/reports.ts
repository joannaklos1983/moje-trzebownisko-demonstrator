import type { ReportDraft } from "../types";

/* Zgłoszenia – lista typów przykładowa (w systemie pobierana z modułu Zgłoszenia). */
export const REPORT_TYPES: string[] = [
  "Uszkodzona droga lub chodnik",
  "Awaria oświetlenia ulicznego",
  "Nielegalne wysypisko odpadów",
  "Uszkodzony znak drogowy",
  "Inne",
];

/* Pusty formularz zgłoszenia. W demo zgłoszenie nie jest nigdzie wysyłane. */
export const REPORT_DRAFT_DEFAULTS: ReportDraft = { type: "", date: "2026-10-06", desc: "", file: false, mode: "current", sent: false };
