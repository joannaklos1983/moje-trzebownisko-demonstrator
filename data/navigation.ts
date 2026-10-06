import type { NavTab, QuickLink, ScreenId, StubDef, StubKey } from "../types";

/* Stała dolna nawigacja. */
export const NAV_TABS: NavTab[] = [
  { id: "home", label: "Start", icon: "home" },
  { id: "search", label: "Szukaj", icon: "search" },
  { id: "fav", label: "Ulubione", icon: "star" },
  { id: "profile", label: "Profil", icon: "user" },
];

/* Tytuły nagłówka podstron (tytuł zaślepki pochodzi ze STUBS). */
export const SCREEN_TITLES: Partial<Record<ScreenId, string>> = {
  notifs: "Powiadomienia",
  detail: "Komunikat",
  reports: "Zgłoszenia",
  waste: "Odpady",
  search: "Szukaj",
  fav: "Ulubione",
  profile: "Profil",
  stub: "",
};

/* Zaślepki modułów i ekrany informacyjne – z oznaczeniem statusu funkcji. */
export const STUBS: Record<StubKey, StubDef> = {
  evoting: { title: "E-voting", icon: "vote", badge: "MODUŁ ISTNIEJĄCY", tagClass: "tagn", text: "Moduł E-voting działa w obecnym systemie. W demonstratorze pokazujemy tylko wejście z pulpitu." },
  card: { title: "Karta Mieszkańca", icon: "idcard", badge: "DO SPRAWDZENIA", tagClass: "tag", text: "Karty Mieszkańca nie potwierdzono w audytowanej wersji web. Do weryfikacji z dostawcą, zanim pojawi się jako usługa." },
  contact: { title: "Kontakt", icon: "phone", badge: "DO SPRAWDZENIA", tagClass: "tag", text: "Dane kontaktowe Urzędu Gminy – źródło danych i sposób prezentacji do ustalenia." },
  transport: { title: "Komunikacja", icon: "bus", badge: "DO SPRAWDZENIA", tagClass: "tag", text: "Rozkłady i komunikacja – możliwa integracja z istniejącym źródłem. Do sprawdzenia z dostawcą." },
  map: { title: "Mapa Gminy", icon: "map", badge: "DO SPRAWDZENIA", tagClass: "tag", text: "Mapa Gminy – integracja z istniejącą mapą do sprawdzenia z dostawcą." },
  mapmsg: { title: "Pokaż na mapie", icon: "map", badge: "DO SPRAWDZENIA", tagClass: "tag", text: "Przycisk „Pokaż na mapie” prowadzi do mapy z zaznaczonym odcinkiem drogi lub objazdem. Źródło mapy do potwierdzenia." },
  calendar: { title: "Kalendarz gminny", icon: "cal", badge: "DO SPRAWDZENIA", tagClass: "tag", text: "Kalendarz to dalszy etap rozwoju. Korzysta z tych samych kategorii i miejscowości co Powiadomienia – nie jest osobnym systemem treści." },
  register: { title: "Załóż konto", icon: "user", badge: "POZA ZAKRESEM DEMO", tagClass: "tag", text: "Rejestracja działa w obecnym systemie. W demonstratorze nie budujemy logowania ani rejestracji.", loginCta: true },
  about: {
    title: "Co oferuje aplikacja", icon: "info", badge: "DO SPRAWDZENIA: PODGLĄD BEZ LOGOWANIA", tagClass: "tag", text: "Moje Trzebownisko zbiera w jednym miejscu najważniejsze informacje i sprawy Gminy.", loginCta: true,
    items: [
      { icon: "bell", t: "Powiadomienia", d: "Komunikaty dla Twojej miejscowości i całej gminy." },
      { icon: "report", t: "Zgłoszenia", d: "Zgłoś usterkę lub problem w przestrzeni publicznej." },
      { icon: "trash", t: "Odpady", d: "Harmonogram odbioru i zasady segregacji." },
      { icon: "vote", t: "E-voting", d: "Głosowania i konsultacje." },
    ],
  },
};

/* Zaślepka pokazywana, gdy klucz nie jest ustawiony. */
export const DEFAULT_STUB: StubKey = "about";

/* Szybki dostęp na pulpicie (DO SPRAWDZENIA). */
export const QUICK_LINKS: QuickLink[] = [
  { label: "Kontakt", icon: "phone", end: "chevR", target: { stub: "contact" } },
  { label: "Komunikacja", icon: "bus", end: "chevR", target: { stub: "transport" } },
  { label: "Mapa Gminy", icon: "map", end: "chevR", target: { stub: "map" } },
  { label: "Strona Gminy", icon: "globe", end: "ext", target: { url: "https://www.trzebownisko.pl" } },
  { label: "Kalendarz", icon: "cal", end: "chevR", target: { stub: "calendar" } },
];
