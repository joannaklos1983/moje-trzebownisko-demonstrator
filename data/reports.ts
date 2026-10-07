import type { Report, ReportDraft, ReportFormState, ReportStatus } from "../types";

/* Zgłoszenia – lista typów przykładowa (w systemie pobierana z modułu Zgłoszenia). */
export const REPORT_TYPES: string[] = [
  "Uszkodzona droga lub chodnik",
  "Awaria oświetlenia ulicznego",
  "Nielegalne wysypisko odpadów",
  "Uszkodzony znak drogowy",
  "Inne",
];

/* Pusty formularz zgłoszenia z demonstratora referencyjnego (zostaje dla zgodności ze stanem referencji). */
export const REPORT_DRAFT_DEFAULTS: ReportDraft = { type: "", date: "2026-10-06", desc: "", file: false, mode: "current", sent: false };

/* ---------- Moduł Zgłoszenia (gałąź start-redesign) – DANE DEMONSTRACYJNE ---------- */

export const REPORT_STATUSES: Record<ReportStatus, { label: string; bg: string; fg: string; info: string }> = {
  new: { label: "Nowe", bg: "#E3F1F8", fg: "#0B5A80", info: "Zgłoszenie zostało przyjęte i czeka na weryfikację przez Urząd Gminy." },
  inProgress: { label: "W realizacji", bg: "#FFEFC9", fg: "#6E4300", info: "Zgłoszenie zostało zweryfikowane i jest w realizacji." },
  done: { label: "Zakończone", bg: "#EEF0EF", fg: "#4E5A63", info: "Zgłoszenie zostało zakończone." },
};
export const REPORT_STATUS_ORDER: ReportStatus[] = ["new", "inProgress", "done"];

/* Trzy przykładowe zgłoszenia z dokumentu „Dane demonstracyjne i wytyczne techniczne” (rozdz. 8):
   tytuł, miejscowość, lokalizacja i status pochodzą z dokumentu.
   Dodane na potrzeby demonstratora (nie ma ich w dokumencie): typ z listy REPORT_TYPES, data, opis
   oraz położenie na mapie poglądowej (mapX / mapY w procentach – to NIE są współrzędne geograficzne). */
export const DEMO_REPORTS: Report[] = [
  {
    id: "zgl-1", title: "Awaria infrastruktury wodociągowej", type: "Inne", locality: "Jasionka", place: "ul. przykładowa / punkt na mapie",
    status: "new", date: "2026-10-05", desc: "Zgłoszenie awarii infrastruktury wodociągowej. Zgłaszający wskazał miejsce na mapie.", mapX: 62, mapY: 34,
  },
  {
    id: "zgl-2", title: "Uszkodzona latarnia", type: "Awaria oświetlenia ulicznego", locality: "Łąka", place: "okolice drogi gminnej",
    status: "inProgress", date: "2026-10-02", desc: "Latarnia przy drodze gminnej nie świeci po zmroku.", mapX: 30, mapY: 58,
  },
  {
    id: "zgl-3", title: "Ubytek w nawierzchni drogi", type: "Uszkodzona droga lub chodnik", locality: "Zaczernie", place: "punkt wskazany na mapie",
    status: "done", date: "2026-09-24", desc: "Ubytek w nawierzchni drogi utrudniał przejazd. Zgłoszenie zostało zakończone.", mapX: 74, mapY: 72,
  },
];

/* Pusty formularz „Zgłoś problem”. Miejscowość jest podpowiadana z aplikacji przy otwarciu formularza. */
export const REPORT_FORM_DEFAULTS: ReportFormState = { type: "", locality: "", place: "", desc: "", photo: false };

/* Nazwa pliku pokazywana po „Dodaj zdjęcie” – zdjęcie nie jest nigdzie przesyłane. */
export const REPORT_DEMO_PHOTO_NAME = "zdjecie_zgloszenia.jpg";

/* Filtr daty na liście zgłoszeń (liczony od dnia demo). */
export const REPORT_DATE_FILTERS: { value: "all" | "7" | "30"; label: string }[] = [
  { value: "all", label: "Dowolna data" },
  { value: "7", label: "Ostatnie 7 dni" },
  { value: "30", label: "Ostatnie 30 dni" },
];
