import { describe, expect, it } from "vitest";
import { NAV_TABS } from "../../data/navigation";
import { calendarView, organizerOf, rangeBounds } from "../../lib/calendar";
import { filterNotifications } from "../../lib/notifications";
import { apply, ids, msg, run, titles } from "./helpers";

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

  it("organizator wynika z kategorii (założenie demonstracyjne, DO SPRAWDZENIA)", () => {
    expect(organizerOf(msg({ id: "a", cat: "Sport i OSiR" }))).toBe("OSiR");
    expect(organizerOf(msg({ id: "b", cat: "Wydarzenia i kultura" }))).toBe("GCK");
    expect(organizerOf(msg({ id: "c", cat: "Edukacja" }))).toBe("Centrum Oświaty");
    expect(organizerOf(msg({ id: "d", cat: "Zdrowie" }))).toBe("Urząd");
  });

  it("komunikaty bez terminu i spoza kategorii wydarzeń nie trafiają do kalendarza", () => {
    const s = run();
    const all = titles(calendarView(s, "week").events);
    expect(all).not.toContain("Fizjoterapia 60+");
    expect(all).not.toContain("Silny wiatr – cała gmina");
  });
});
