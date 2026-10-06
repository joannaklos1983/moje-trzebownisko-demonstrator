import { describe, expect, it } from "vitest";
import { NAV_TABS } from "../../data/navigation";
import {
  calendarEvents, calendarView, dayHeading, eventCountsByDay, eventPlace, eventTime, eventsCountLabel, monthGrid, monthTitle,
  organizerOf, rangeBounds, rangeDays, shiftMonth, spanLabel, withoutPlaceholders,
} from "../../lib/calendar";
import { confirmedExternalUrl, favoriteFeed } from "../../lib/messages";
import { filterNotifications } from "../../lib/notifications";
import { SEED_MESSAGES } from "../../data/notifications";
import { apply, ids, msg, run, titles } from "./helpers";

const seed = (id: string) => SEED_MESSAGES.find((m) => m.id === id)!;
const oct = (d: number) => ({ y: 2026, m: 9, d });

describe("Kalendarz – wspólny widok wydarzeń", () => {
  it("dolna nawigacja: Start | Szukaj | Kalendarz | Ulubione | Profil", () => {
    expect(NAV_TABS.map((t) => t.label)).toEqual(["Start", "Szukaj", "Kalendarz", "Ulubione", "Profil"]);
  });

  it("zakresy liczone od dnia demo (wt 6 paź 2026): dziś, weekend 10–11 paź, tydzień 5–11 paź", () => {
    const d = (t: number) => { const x = new Date(t); return `${x.getDate()}.${x.getMonth() + 1} ${x.getHours()}:${String(x.getMinutes()).padStart(2, "0")}`; };
    const b = (r: Parameters<typeof rangeBounds>[1]) => rangeBounds("2026-10-06T10:30", r).map(d);
    expect(b("today")).toEqual(["6.10 0:00", "6.10 23:59"]);
    expect(b("weekend")).toEqual(["10.10 0:00", "11.10 23:59"]);
    expect(b("week")).toEqual(["5.10 0:00", "11.10 23:59"]);
    expect(rangeDays("2026-10-06T10:30", "weekend")).toEqual([oct(10), oct(11)]);
  });

  it("Dziś / Weekend / Ten tydzień na danych demo", () => {
    const s = run({ type: "login" });
    expect(titles(calendarView(s, "today").events)).toEqual(["Warsztaty artystyczno-kreatywne"]);
    expect(calendarView(s, "weekend")).toMatchObject({ events: [], emptyText: "W ten weekend nie ma wydarzeń w kalendarzu." });
    expect(titles(calendarView(s, "week").events)).toEqual(["Warsztaty artystyczno-kreatywne", "Otwarcie Orlika w Łące", "Czas na relacje – warsztat robótek ręcznych"]);
  });

  it("wydarzenia to te same rekordy co w Powiadomieniach, nie osobne treści", () => {
    const s = run({ type: "patch", patch: { nScope: "all", nLoc: "all" } });
    const inNotifications = new Set(ids(filterNotifications(s)));
    expect(calendarView(s, "week").events.every((m) => inNotifications.has(m.id))).toBe(true);
  });

  it("personalizacja miejscowością bez drugiego selektora", () => {
    const local = msg({ id: "festyn-laka", cat: "Wydarzenia i kultura", group: "Łąka", evStart: "2026-10-08T15:00", evEnd: "2026-10-08T18:00" });
    const base = { ...run(), published: [local] };
    expect(ids(calendarView(base, "week").events)).not.toContain("festyn-laka");
    expect(calendarView(base, "week").context).toBe("Jasionka + wydarzenia ogólnogminne");
    const laka = apply(base, { type: "selectLocality", value: "Łąka" });
    expect(ids(calendarView(laka, "week").events)).toContain("festyn-laka");
    const all = apply(base, { type: "selectLocality", value: "__all" });
    expect(ids(calendarView(all, "week").events)).toContain("festyn-laka");
    expect(calendarView(all, "week").context).toBe("Cała gmina – wszystkie miejscowości");
  });

  it("komunikaty bez terminu i spoza kategorii wydarzeń nie trafiają do kalendarza", () => {
    const all = titles(calendarView(run(), "week").events);
    expect(all).not.toContain("Fizjoterapia 60+");
    expect(all).not.toContain("Silny wiatr – cała gmina");
  });
});

describe("Kalendarz – widok miesiąca", () => {
  it("siatka października 2026 zaczyna się w czwartek, tygodnie od poniedziałku", () => {
    const grid = monthGrid(2026, 9);
    expect(grid[0]).toEqual([null, null, null, 1, 2, 3, 4]);
    expect(grid[1]).toEqual([5, 6, 7, 8, 9, 10, 11]);
    expect(grid.at(-1)).toEqual([26, 27, 28, 29, 30, 31, null]);
    expect(grid.every((w) => w.length === 7)).toBe(true);
  });

  it("dni z wydarzeniami w październiku: 6 (1) i 7 (2)", () => {
    expect(eventCountsByDay(run(), 2026, 9)).toEqual({ 6: 1, 7: 2 });
    expect(eventCountsByDay(run(), 2026, 10)).toEqual({});
  });

  it("wybór dnia: z wydarzeniami i bez", () => {
    const s = run();
    expect(titles(calendarEvents(s, oct(7), oct(7)))).toEqual(["Otwarcie Orlika w Łące", "Czas na relacje – warsztat robótek ręcznych"]);
    expect(calendarEvents(s, oct(8), oct(8))).toEqual([]);
  });

  it("zmiana miesiąca przechodzi przez granicę roku", () => {
    expect(shiftMonth(2026, 9, 1)).toEqual({ y: 2026, m: 10 });
    expect(shiftMonth(2026, 11, 1)).toEqual({ y: 2027, m: 0 });
    expect(shiftMonth(2026, 0, -1)).toEqual({ y: 2025, m: 11 });
    expect(monthTitle(2026, 9)).toBe("Październik 2026");
  });

  it("teksty: nagłówek dnia, zakres, liczba wydarzeń", () => {
    expect(dayHeading(oct(7))).toBe("Środa, 7 października");
    expect(spanLabel(oct(10), oct(11))).toBe("10–11 października");
    expect(spanLabel({ y: 2026, m: 8, d: 28 }, oct(4))).toBe("28 września – 4 października");
    expect([0, 1, 2, 4, 5, 12, 22, 25].map(eventsCountLabel)).toEqual(["brak wydarzeń", "1 wydarzenie", "2 wydarzenia", "4 wydarzenia", "5 wydarzeń", "12 wydarzeń", "22 wydarzenia", "25 wydarzeń"]);
  });
});

describe("Karta wydarzenia – tylko dane, które są w rekordzie", () => {
  it("pola do uzupełnienia w nawiasach nie są pokazywane", () => {
    expect(withoutPlaceholders("[Miejsce]")).toBe("");
    expect(withoutPlaceholders("Łąka, [adres boiska]")).toBe("Łąka");
    expect(withoutPlaceholders("Śr, 7 paź, [godzina]")).toBe("Śr, 7 paź");
    expect(eventPlace(seed("warsztaty"))).toBe("");
    expect(eventPlace(seed("orlik"))).toBe("Łąka");
  });

  it("godzina tylko wtedy, gdy jest podana w terminie – nie zgadujemy jej z pól technicznych", () => {
    expect(eventTime(seed("warsztaty"))).toBe("");
    expect(eventTime(msg({ id: "x", when: "Dziś, 8:00–14:00" }))).toBe("8:00–14:00");
    expect(eventTime(msg({ id: "y", when: "Sob, 10 paź, 17:00" }))).toBe("17:00");
  });

  it("organizator to założenie demonstracyjne z kategorii (DO SPRAWDZENIA, niepokazywane jako fakt)", () => {
    expect(organizerOf(msg({ id: "a", cat: "Sport i OSiR" }))).toBe("OSiR");
    expect(organizerOf(msg({ id: "b", cat: "Wydarzenia i kultura" }))).toBe("GCK");
    expect(organizerOf(msg({ id: "c", cat: "Edukacja" }))).toBe("Centrum Oświaty");
    expect(organizerOf(msg({ id: "d", cat: "Zdrowie" }))).toBe("Urząd");
  });
});

describe("Ulubione", () => {
  it("najnowsze dla Ciebie: obserwowane kategorie, aktualne, w moim zakresie miejscowości", () => {
    const s = run();
    expect(titles(favoriteFeed(s))).toEqual(["Warsztaty artystyczno-kreatywne", "Czas na relacje – warsztat robótek ręcznych"]);
    const local = msg({ id: "droga-laka", cat: "Wydarzenia i kultura", group: "Łąka", sentAt: "2026-10-06T09:30" });
    const withLocal = { ...s, published: [local] };
    expect(ids(favoriteFeed(withLocal))).not.toContain("droga-laka");
    expect(ids(favoriteFeed(apply(withLocal, { type: "selectLocality", value: "Łąka" })))[0]).toBe("droga-laka");
    expect(ids(favoriteFeed(apply(withLocal, { type: "selectLocality", value: "__all" })))).toContain("droga-laka");
  });

  it("usunięcie kategorii czyści jej treści; pusty stan bez kategorii", () => {
    const none = run({ type: "toggleFavorite", category: "Wydarzenia i kultura" });
    expect(none.favs).toEqual([]);
    expect(favoriteFeed(none)).toEqual([]);
    const sport = apply(none, { type: "toggleFavorite", category: "Sport i OSiR" });
    expect(titles(favoriteFeed(sport))).toEqual(["Otwarcie Orlika w Łące"]);
  });

  it("zakończone komunikaty nie trafiają do „Najnowsze dla Ciebie”", () => {
    const s = run({ type: "setNow", now: "2026-10-06T15:00" }, { type: "toggleFavorite", category: "Zdrowie" });
    const ended = { ...s, now: "2026-11-15T10:00" };
    expect(favoriteFeed(ended)).toEqual([]);
  });

  it("dodanie do Ulubionych nie włącza kanałów powiadomień", () => {
    const s = run({ type: "toggleFavorite", category: "Zdrowie" });
    expect(s.channels).toEqual(run().channels);
    expect(s.favNotify).toBe(false);
  });
});

describe("Link zewnętrzny w szczególe", () => {
  it("tylko potwierdzony adres https z pola officialUrl", () => {
    expect(confirmedExternalUrl(msg({ id: "a", officialUrl: "https://www.trzebownisko.pl/wydarzenie" }))).toBe("https://www.trzebownisko.pl/wydarzenie");
    expect(confirmedExternalUrl(msg({ id: "b" }))).toBe("");
    expect(confirmedExternalUrl(msg({ id: "c", officialUrl: "https://trzebownisko.pl/[adres-komunikatu]" }))).toBe("");
    expect(confirmedExternalUrl(msg({ id: "d", officialUrl: "http://example.com" }))).toBe("");
    expect(confirmedExternalUrl(msg({ id: "e", link: "https://trzebownisko.pl/[adres-komunikatu]" }))).toBe("");
  });

  it("w danych demo żaden komunikat nie ma potwierdzonego linku zewnętrznego", () => {
    expect(SEED_MESSAGES.filter((m) => confirmedExternalUrl(m))).toEqual([]);
  });
});
