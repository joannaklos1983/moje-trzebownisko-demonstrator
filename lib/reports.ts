import { MONTHS_SHORT } from "../data/demo";
import { DEMO_REPORTS } from "../data/reports";
import type { Locality, Report, ReportStatus } from "../types";
import type { AppState } from "./state";
import { matchesAllWords, normalize } from "./text";

/* Moduł Zgłoszenia: lista, mapa poglądowa i szczegół korzystają z tych samych rekordów. */

export interface ReportFilters {
  query: string;
  type: "all" | string;
  locality: "all" | Locality;
  status: "all" | ReportStatus;
  /** Zakres dat liczony od dnia demo. */
  days: "all" | "7" | "30";
}

export const REPORT_FILTERS_DEFAULT: ReportFilters = { query: "", type: "all", locality: "all", status: "all", days: "all" };

/** Zgłoszenia mieszkańca z tej sesji + przykładowe. */
export function allReports(s: AppState): Report[] {
  return s.submittedReports.concat(DEMO_REPORTS);
}

export function findReport(s: AppState, id: string | null): Report | undefined {
  return allReports(s).find((r) => r.id === id);
}

function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso + "T00:00"), b = new Date(toIso + "T00:00");
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/** Filtry + kolejność: najpierw moja miejscowość (kontekst z aplikacji), potem najnowsze. */
export function filterReports(s: AppState, f: ReportFilters): Report[] {
  const q = normalize(f.query).trim();
  const today = s.now.slice(0, 10);
  return allReports(s)
    .filter((r) => {
      if (f.type !== "all" && r.type !== f.type) return false;
      if (f.locality !== "all" && r.locality !== f.locality) return false;
      if (f.status !== "all" && r.status !== f.status) return false;
      if (f.days !== "all" && daysBetween(r.date, today) > Number(f.days)) return false;
      if (q && !matchesAllWords(normalize(r.title + " " + r.type + " " + r.locality + " " + r.place + " " + r.desc), q)) return false;
      return true;
    })
    .sort((a, b) => {
      const la = a.locality === s.loc ? 0 : 1, lb = b.locality === s.loc ? 0 : 1;
      if (s.locPriority && la !== lb) return la - lb;
      return b.date.localeCompare(a.date);
    });
}

export function activeReportFilters(f: ReportFilters): number {
  return (f.type !== "all" ? 1 : 0) + (f.locality !== "all" ? 1 : 0) + (f.status !== "all" ? 1 : 0) + (f.days !== "all" ? 1 : 0);
}

/** „5 paź 2026”. */
export function reportDateLabel(iso: string): string {
  const d = new Date(iso + "T00:00");
  return d.getDate() + " " + MONTHS_SHORT[d.getMonth()] + " " + d.getFullYear();
}

export function reportLocation(r: Report): string {
  return r.place ? r.locality + ", " + r.place : r.locality;
}

/** Czego brakuje w formularzu „Zgłoś problem” (pusta lista = można wysłać). */
export function reportFormErrors(s: AppState): string[] {
  const f = s.reportForm;
  const out: string[] = [];
  if (!f.type) out.push("Wybierz rodzaj zgłoszenia.");
  if (!f.locality) out.push("Wybierz miejscowość.");
  if (!f.desc.trim()) out.push("Opisz krótko, co się stało.");
  return out;
}
