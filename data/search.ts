import type { SearchFilter, SearchStaticEntry } from "../types";

/* Stałe pozycje wyszukiwarki (usługi i szybki dostęp). Komunikaty trafiają do wyników
   z tej samej listy co Powiadomienia – nie mają tu osobnej kopii.
   Pola source i snippet dodano po migracji; opisy to teksty już używane w demonstratorze. */
export const SEARCH_STATIC_ENTRIES: SearchStaticEntry[] = [
  { title: "Harmonogram odbioru odpadów", source: "Odpady", snippet: "Harmonogram odbioru i zasady segregacji.", meta: "Usługa · Odpady", metaWithLocality: true, icon: "trash", keywords: "harmonogram odbioru odpady smieci wywoz", local: 0, target: { screen: "waste" } },
  { title: "Jak segregować odpady", source: "Odpady", snippet: "Harmonogram odbioru i zasady segregacji.", meta: "Usługa · Odpady · poradnik", icon: "trash", keywords: "jak segregowac odpady segregacja papier szklo bio", local: 1, target: { screen: "waste" } },
  { title: "Dodaj zgłoszenie", source: "Zgłoszenia", snippet: "Zgłoś usterkę lub problem w przestrzeni publicznej.", meta: "Usługa · Zgłoszenia", icon: "report", keywords: "zgloszenie zglos awaria usterka droga dziura oswietlenie", local: 1, target: { screen: "reports" } },
  { title: "E-voting", source: "Usługi", snippet: "Głosowania i konsultacje.", meta: "Usługa · głosowania", icon: "vote", keywords: "e-voting glosowanie konsultacje budzet", local: 1, target: { stub: "evoting" } },
  { title: "Mapa Gminy", source: "Usługi", snippet: "Mapa Gminy – integracja z istniejącą mapą do sprawdzenia z dostawcą.", meta: "Szybki dostęp · DO SPRAWDZENIA", icon: "map", keywords: "mapa gminy miejsca", local: 1, target: { stub: "map" } },
];

/* Popularne wyszukiwania. */
export const SEARCH_SUGGESTIONS: string[] = ["woda", "odpady", "droga", "Orlik", "fizjoterapia"];

/* Lekkie filtry wyników (dodane po migracji). */
export const SEARCH_FILTERS: { value: SearchFilter; label: string }[] = [
  { value: "all", label: "Wszystko" },
  { value: "Powiadomienia", label: "Powiadomienia" },
  { value: "Odpady", label: "Odpady" },
  { value: "Zgłoszenia", label: "Zgłoszenia" },
];
