import type { SearchStaticEntry } from "../types";

/* Stałe pozycje wyszukiwarki (usługi i szybki dostęp). Komunikaty trafiają do wyników
   z tej samej listy co Powiadomienia – nie mają tu osobnej kopii. */
export const SEARCH_STATIC_ENTRIES: SearchStaticEntry[] = [
  { title: "Harmonogram odbioru odpadów", meta: "Usługa · Odpady", metaWithLocality: true, icon: "trash", keywords: "harmonogram odbioru odpady smieci wywoz", local: 0, target: { screen: "waste" } },
  { title: "Jak segregować odpady", meta: "Usługa · Odpady · poradnik", icon: "trash", keywords: "jak segregowac odpady segregacja papier szklo bio", local: 1, target: { screen: "waste" } },
  { title: "Dodaj zgłoszenie", meta: "Usługa · Zgłoszenia", icon: "report", keywords: "zgloszenie zglos awaria usterka droga dziura oswietlenie", local: 1, target: { screen: "reports" } },
  { title: "E-voting", meta: "Usługa · głosowania", icon: "vote", keywords: "e-voting glosowanie konsultacje budzet", local: 1, target: { stub: "evoting" } },
  { title: "Mapa Gminy", meta: "Szybki dostęp · DO SPRAWDZENIA", icon: "map", keywords: "mapa gminy miejsca", local: 1, target: { stub: "map" } },
];

/* Popularne wyszukiwania. */
export const SEARCH_SUGGESTIONS: string[] = ["woda", "odpady", "droga", "Orlik", "fizjoterapia"];
