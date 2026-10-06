import type { Message } from "../types";

/* Komunikaty przykładowe – 1:1 z demonstratora (SEED). Dane demonstracyjne, nie rzeczywiste
   komunikaty Gminy. Pola w nawiasach kwadratowych to miejsca do uzupełnienia. */
export const SEED_MESSAGES: Message[] = [
  { id: "wind", type: "Ostrzeżenie", cat: "Pogoda i jakość powietrza", group: "Wszyscy", title: "Silny wiatr – cała gmina", place: "Cała gmina", when: "Dziś 18:00 – jutro 6:00",
    text: "Prognozowany silny wiatr w porywach. Zabezpiecz przedmioty na posesji.", todo: "Zabezpiecz przedmioty na balkonach i posesji. Nie parkuj pod drzewami.",
    sentAt: "2026-10-06T09:00", od: "2026-10-06T09:00", do: "2026-10-07T06:00", evStart: "2026-10-06T18:00", evEnd: "2026-10-07T06:00", important: true, action: "detail", btn: "Szczegóły" },
  { id: "waste-jas", type: "Informacja", cat: "Odpady", group: "Jasionka", title: "Odbiór odpadów – Jasionka", place: "Jasionka", when: "Czw, 8 paź",
    text: "Odbiór odpadów zmieszanych oraz metali i tworzyw sztucznych.", todo: "Wystaw pojemniki i worki w dniu odbioru.",
    sentAt: "2026-10-05T12:00", od: "2026-10-06T00:00", do: "2026-10-08T18:00", evStart: "2026-10-08T06:00", evEnd: "2026-10-08T18:00", important: true, action: "waste", btn: "Sprawdź harmonogram" },
  { id: "waste-laka", type: "Informacja", cat: "Odpady", group: "Łąka", title: "Odbiór odpadów – Łąka", place: "Łąka", when: "Pt, 9 paź",
    text: "Odbiór odpadów zmieszanych oraz metali i tworzyw sztucznych.", todo: "Wystaw pojemniki i worki w dniu odbioru.",
    sentAt: "2026-10-05T12:00", od: "2026-10-06T00:00", do: "2026-10-09T18:00", evStart: "2026-10-09T06:00", evEnd: "2026-10-09T18:00", important: true, action: "waste", btn: "Sprawdź harmonogram" },
  { id: "road-laka", type: "Informacja", cat: "Drogi, transport i inwestycje", group: "Łąka", title: "Ruch wahadłowy – Łąka", place: "Łąka, [odcinek drogi]", when: "Do [data zakończenia]",
    text: "Prace drogowe. Zaplanuj dłuższy czas przejazdu.", todo: "Sprawdź trasę przejazdu przed wyjazdem.",
    sentAt: "2026-10-01T08:00", od: "2026-10-01T08:00", do: "2026-10-20T18:00", evStart: "2026-10-01T08:00", evEnd: "2026-10-20T18:00", important: true, action: "map", btn: "Pokaż na mapie" },
  { id: "orlik", type: "Informacja", cat: "Sport i OSiR", group: "Wszyscy", title: "Otwarcie Orlika w Łące", place: "Łąka, [adres boiska]", when: "Śr, 7 paź, [godzina]",
    text: "Zapraszamy na otwarcie boiska w Łące.", todo: "",
    sentAt: "2026-10-01T10:00", od: "2026-10-01T10:00", do: "2026-10-07T23:59", evStart: "2026-10-07T00:00", evEnd: "2026-10-07T23:59", important: false, action: "detail", btn: "Szczegóły" },
  { id: "warsztaty", type: "Informacja", cat: "Wydarzenia i kultura", group: "Wszyscy", title: "Warsztaty artystyczno-kreatywne", place: "[Miejsce]", when: "Wt, 6 paź, [godzina]",
    text: "Warsztaty dla mieszkańców. [Dla kogo, zapisy – do uzupełnienia].", todo: "",
    sentAt: "2026-10-01T10:00", od: "2026-10-01T10:00", do: "2026-10-06T23:59", evStart: "2026-10-06T16:00", evEnd: "2026-10-06T19:00", important: false, action: "detail", btn: "Szczegóły" },
  { id: "relacje", type: "Informacja", cat: "Wydarzenia i kultura", group: "Wszyscy", title: "Czas na relacje – warsztat robótek ręcznych", place: "[Miejsce]", when: "Śr, 7 paź, [godzina]",
    text: "Warsztat robótek ręcznych. [Dla kogo, zapisy – do uzupełnienia].", todo: "",
    sentAt: "2026-10-01T10:00", od: "2026-10-01T10:00", do: "2026-10-07T23:59", evStart: "2026-10-07T16:00", evEnd: "2026-10-07T19:00", important: false, action: "detail", btn: "Szczegóły" },
  { id: "fizjo", type: "Informacja", cat: "Zdrowie", group: "Wszyscy", title: "Fizjoterapia 60+", place: "[Miejsce]", when: "[Termin zapisów]",
    text: "Program dla mieszkańców 60+. Sprawdź, dla kogo i jak się zapisać.", todo: "Zapisy: [sposób zapisu, telefon].",
    sentAt: "2026-10-01T10:00", od: "2026-10-01T10:00", do: "2026-10-31T23:59", evStart: null, evEnd: null, important: false, action: "detail", btn: "Sprawdź" },
  { id: "water-nw", type: "Informacja", cat: "Woda i awarie", group: "Nowa Wieś", title: "Przerwa w dostawie wody – Nowa Wieś", place: "Nowa Wieś", when: "4 sierpnia, 9:00–14:00",
    text: "W godz. 9:00–14:00 nastąpiła przerwa w dostawie wody.", todo: "",
    sentAt: "2026-08-03T12:00", od: "2026-08-04T09:00", do: "2026-08-04T14:00", evStart: "2026-08-04T09:00", evEnd: "2026-08-04T14:00", important: false, action: "detail", btn: "Szczegóły" },
];
