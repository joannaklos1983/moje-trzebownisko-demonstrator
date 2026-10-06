import { afterEach, describe, expect, it, vi } from "vitest";
import { SEED_MESSAGES } from "../../data/notifications";
import { campaignLabels, formToMessage } from "../../lib/campaign";
import {
  allMessages, compareRank, currentForMe, decorateMessage, hasUnreadBell, importantNow, isForMe, isImportantNow,
  isSent, statusOf, tier,
} from "../../lib/messages";
import { filterNotifications, notificationsView } from "../../lib/notifications";
import { searchView } from "../../lib/search";
import { createInitialState } from "../../lib/state";
import { normalize, stem } from "../../lib/text";
import { wasteView } from "../../lib/waste";
import { T0730, T1030, T1500, WATER, apply, ids, msg, run, titles } from "./helpers";

const seed = (id: string) => SEED_MESSAGES.find((m) => m.id === id)!;

describe("kolejność ważności", () => {
  it("Alert RCB → Ostrzeżenie → Informacja", () => {
    const s = { ...createInitialState(), published: [msg({ id: "info" }), msg({ id: "alert", type: "Alert" }), msg({ id: "warn", type: "Ostrzeżenie" })] };
    const sorted = [...s.published].sort((a, b) => compareRank(s, a, b));
    expect(ids(sorted)).toEqual(["alert", "warn", "info"]);
  });

  it("typ jest ważniejszy niż bliskość: ogólnogminne Ostrzeżenie przed lokalną Informacją", () => {
    const s = run({ type: "login" });
    expect(titles(importantNow(s))).toEqual(["Silny wiatr – cała gmina", "Odbiór odpadów – Jasionka"]);
  });

  it("w ramach typu: moja miejscowość → cała gmina (grupa „Wszyscy”) → pozostałe", () => {
    const s = { ...createInitialState(), locPriority: false, published: [msg({ id: "inna", group: "Łąka" }), msg({ id: "gmina", group: "Wszyscy" }), msg({ id: "moja", group: "Jasionka" })] };
    const sorted = [...s.published].sort((a, b) => compareRank(s, a, b));
    expect(ids(sorted)).toEqual(["moja", "gmina", "inna"]);
  });

  it("przy tym samym typie i bliskości: TRWA przed AKTUALNE, potem najnowsze", () => {
    const s = { ...createInitialState(), published: [
      msg({ id: "starszy", sentAt: "2026-10-06T06:00" }),
      msg({ id: "nowszy", sentAt: "2026-10-06T09:00" }),
      msg({ id: "trwa", sentAt: "2026-10-05T06:00", evStart: "2026-10-06T08:00", evEnd: "2026-10-06T14:00" }),
    ] };
    const sorted = [...s.published].sort((a, b) => compareRank(s, a, b));
    expect(ids(sorted)).toEqual(["trwa", "nowszy", "starszy"]);
  });
});

describe("„Ważne teraz”", () => {
  it("pokazuje najwyżej 3 komunikaty, choć w zakresie jest ich więcej", () => {
    const s = run({ type: "publish" }, { type: "selectLocality", value: "__all" });
    const candidates = allMessages(s).filter((m) => isSent(s, m) && isImportantNow(s, m));
    expect(candidates.length).toBe(5);
    expect(importantNow(s).length).toBe(3);
  });

  it("nie pokazuje komunikatów bez oznaczenia „Pokaż w Ważne teraz”", () => {
    const s = run({ type: "patchForm", patch: { important: false } }, { type: "publish" });
    expect(titles(importantNow(s))).not.toContain(WATER);
    expect(titles(filterNotifications(s))).toContain(WATER);
  });

  it("„Ważne od / do”: granice włącznie, przed i po – poza sekcją", () => {
    const m = msg({ id: "x", od: "2026-10-06T08:00", do: "2026-10-06T14:00" });
    const at = (now: string) => isImportantNow({ ...createInitialState(), now }, m);
    expect(at("2026-10-06T07:59")).toBe(false);
    expect(at("2026-10-06T08:00")).toBe(true);
    expect(at("2026-10-06T14:00")).toBe(true);
    expect(at("2026-10-06T14:01")).toBe(false);
  });
});

describe("Cała gmina a grupa „Wszyscy”", () => {
  it("moja miejscowość: treści mojej miejscowości + ogólnogminne, bez innych miejscowości", () => {
    const s = createInitialState();
    expect(isForMe(s, seed("waste-jas"))).toBe(true);
    expect(isForMe(s, seed("wind"))).toBe(true);
    expect(isForMe(s, seed("waste-laka"))).toBe(false);
  });

  it("Cała gmina: treści ze wszystkich miejscowości + ogólnogminne", () => {
    const s = run({ type: "publish" }, { type: "selectLocality", value: "__all" });
    const list = titles(filterNotifications(s));
    expect(list).toEqual(expect.arrayContaining([WATER, "Ruch wahadłowy – Łąka", "Odbiór odpadów – Łąka", "Silny wiatr – cała gmina"]));
    expect(notificationsView(s).sub).toBe("Cała gmina – wszystkie miejscowości · tylko aktualne");
  });

  it("Cała gmina to zakres widoku, a nie grupa odbiorców „Wszyscy”", () => {
    const s = run({ type: "selectLocality", value: "__all" });
    /* komunikat dla Łąki nie należy do grupy „Wszyscy”, a mimo to jest w widoku „Cała gmina” */
    expect(seed("waste-laka").group).not.toBe("Wszyscy");
    expect(isForMe(s, seed("waste-laka"))).toBe(true);
    /* grupa „Wszyscy” i inna miejscowość to różne poziomy bliskości */
    expect(tier(s, seed("wind"))).toBe(1);
    expect(tier(s, seed("waste-laka"))).toBe(2);
    /* przełączenie zakresu nie zmienia miejscowości z profilu */
    expect(s.loc).toBe("Jasionka");
    expect(s.locPriority).toBe(false);
  });

  it("moja miejscowość zachowuje pierwszeństwo także w widoku „Cała gmina”", () => {
    const s = run({ type: "publish" }, { type: "selectLocality", value: "__all" });
    expect(titles(importantNow(s))).toEqual(["Silny wiatr – cała gmina", WATER, "Odbiór odpadów – Jasionka"]);
  });

  it("filtr konkretnej miejscowości w Powiadomieniach: ta miejscowość + ogólnogminne", () => {
    const s = run({ type: "patch", patch: { nLoc: "Łąka" } });
    const groups = new Set(filterNotifications(s).map((m) => m.group));
    expect([...groups].sort()).toEqual(["Wszyscy", "Łąka"]);
  });
});

describe("kampania wody dla Jasionki i czas demo", () => {
  const published = run({ type: "login" }, { type: "publish" });

  it("formularz → komunikat: lokalizacja z Grupy odbiorców, termin z „Ważne od / do”", () => {
    const m = formToMessage(createInitialState().form, T1030);
    expect(m).toMatchObject({ id: "admin-1", title: WATER, group: "Jasionka", place: "Jasionka", cat: "Woda i awarie", type: "Informacja", when: "Dziś, 8:00–14:00", sentAt: "2026-10-06T07:00", important: true });
  });

  it("publikacja: jeden rekord, potwierdzenie, powrót na Start, kropka przy dzwonku", () => {
    expect(published.published.length).toBe(1);
    expect(published.toast).toBe("Kampania wysłana. Mieszkańcy z grupy Jasionka widzą ją w „Ważne teraz”.");
    expect(published.screen).toBe("home");
    expect(published.unread["admin-1"]).toBe(true);
    expect(hasUnreadBell(published)).toBe(true);
    expect(campaignLabels(published.published.length > 0)).toEqual({ heading: "Edycja kampanii", publishLabel: "Zapisz zmiany (demo)" });
  });

  it("ta sama kampania zasila „Ważne teraz”, Powiadomienia, wyszukiwarkę i szczegół", () => {
    expect(titles(importantNow(published))).toEqual(["Silny wiatr – cała gmina", WATER, "Odbiór odpadów – Jasionka"]);
    expect(titles(filterNotifications(published))).toContain(WATER);
    expect(searchView({ ...published, sQuery: "woda" }).results[0].title).toBe(WATER);
    const detail = decorateMessage(published, published.published[0]);
    expect(detail).toMatchObject({ statusLabel: "● TRWA", whom: "Mieszkańcy: Jasionka", hasLink: true });
  });

  it("edycja zastępuje kampanię zamiast tworzyć kopię", () => {
    const edited = apply(published, { type: "patchForm", patch: { title: "Przerwa w dostawie wody – Jasionka (zmiana)" } }, { type: "publish" });
    expect(edited.published.length).toBe(1);
    expect(titles(filterNotifications(edited)).filter((t) => t.startsWith("Przerwa w dostawie wody – Jasionka"))).toEqual(["Przerwa w dostawie wody – Jasionka (zmiana)"]);
  });

  it("7:30 – wysłana, ale jeszcze nie w „Ważne teraz”", () => {
    const s = apply(published, { type: "setNow", now: T0730 });
    expect(isSent(s, s.published[0])).toBe(true);
    expect(titles(importantNow(s))).not.toContain(WATER);
    expect(titles(filterNotifications(s))).toContain(WATER);
    expect(statusOf(s, s.published[0])).toBe("current");
  });

  it("10:30 – w „Ważne teraz” ze statusem TRWA", () => {
    const s = apply(published, { type: "setNow", now: T1030 });
    expect(titles(importantNow(s))).toContain(WATER);
    expect(statusOf(s, s.published[0])).toBe("live");
  });

  it("15:00 – znika z „Ważne teraz” i z Aktualnych, zostaje w historii jako ZAKOŃCZONE", () => {
    const s = apply(published, { type: "setNow", now: T1500 });
    expect(titles(importantNow(s))).not.toContain(WATER);
    expect(titles(currentForMe(s))).not.toContain(WATER);
    expect(titles(filterNotifications(s))).not.toContain(WATER);
    const all = apply(s, { type: "patch", patch: { nScope: "all" } });
    expect(titles(filterNotifications(all))).toContain(WATER);
    expect(decorateMessage(all, all.published[0]).statusLabel).toBe("✓ ZAKOŃCZONE");
    /* zakończone są na końcu listy */
    const statuses = filterNotifications(all).map((m) => statusOf(all, m));
    expect(statuses.indexOf("ended")).toBeGreaterThan(statuses.lastIndexOf("live"));
  });

  it("kampania zaplanowana na później nie jest widoczna przed datą wysłania", () => {
    const s = run({ type: "setNow", now: "2026-10-06T06:30" }, { type: "publish" });
    expect(s.toast).toBe("Kampania zaplanowana na 6.10.2026, 7:00. Zmień godzinę w demo, aby zobaczyć ją u mieszkańca.");
    expect(titles(filterNotifications(s))).not.toContain(WATER);
  });
});

describe("zmiana miejscowości", () => {
  it("Jasionka → Łąka: lokalny komunikat Jasionki znika, pojawiają się treści Łąki", () => {
    const s = run({ type: "publish" }, { type: "selectLocality", value: "Łąka" });
    expect(titles(importantNow(s))).toEqual(["Silny wiatr – cała gmina", "Ruch wahadłowy – Łąka", "Odbiór odpadów – Łąka"]);
    expect(titles(filterNotifications(s)).some((t) => t.includes("Jasionka"))).toBe(false);
  });

  it("powrót do Jasionki przywraca jej treści", () => {
    const s = run({ type: "selectLocality", value: "Łąka" }, { type: "selectLocality", value: "Jasionka" });
    expect(titles(importantNow(s))).toEqual(["Silny wiatr – cała gmina", "Odbiór odpadów – Jasionka"]);
  });
});

describe("Odpady", () => {
  it("dziedziczą aktualną miejscowość aplikacji", () => {
    expect(wasteView(run()).loc).toBe("Jasionka");
    expect(wasteView(run({ type: "selectLocality", value: "Łąka" })).loc).toBe("Łąka");
  });

  it("harmonogram zależy od miejscowości", () => {
    expect(wasteView(run()).next).toMatchObject({ date: "Czw, 8 paź", rel: "za 2 dni" });
    expect(wasteView(run({ type: "selectLocality", value: "Łąka" })).next).toMatchObject({ date: "Pt, 9 paź", rel: "za 3 dni" });
  });

  it("w widoku „Cała gmina” pokazują miejscowość z Profilu", () => {
    const v = wasteView(run({ type: "selectLocality", value: "Łąka" }, { type: "selectLocality", value: "__all" }));
    expect(v.loc).toBe("Łąka");
    expect(v.locNote).toContain("Cała gmina");
  });
});

describe("wyszukiwanie z polskimi znakami", () => {
  const find = (sQuery: string, extra = {}) => searchView({ ...run({ type: "publish" }), sQuery, ...extra }).results.map((r) => r.title);

  it("normalizacja: ą, ę, ó, ś, ż, ź, ć, ń oraz ł", () => {
    expect(normalize("Zażółć GĘŚLĄ jaźń – Łąka")).toBe("zazolc gesla jazn – laka");
    expect(stem("odpady")).toBe("odpad");
    expect(stem("woda")).toBe("wod");
  });

  it("ten sam wynik z ogonkami i bez", () => {
    expect(find("Łąka")).toEqual(find("laka"));
    expect(find("Łąka")).toContain("Ruch wahadłowy – Łąka");
    expect(find("zgłoszenie")).toEqual(["Dodaj zgłoszenie"]);
    expect(find("zgloszenie")).toEqual(["Dodaj zgłoszenie"]);
  });

  it("odmiana wyrazu: „wodą”, „odpadów”", () => {
    expect(find("wodą")).toContain(WATER);
    expect(find("odpadów")).toContain("Odbiór odpadów – Jasionka");
    expect(find("odpady")).toContain("Harmonogram odbioru odpadów");
  });

  it("najpierw moja miejscowość, potem cała gmina, potem pozostałe; zakończone na końcu", () => {
    expect(find("odpady").slice(0, 2)).toEqual(["Odbiór odpadów – Jasionka", "Harmonogram odbioru odpadów"]);
    expect(find("woda").at(-1)).toBe("Przerwa w dostawie wody – Nowa Wieś");
  });

  it("brak wyników dla nieznanego hasła, brak listy bez zapytania", () => {
    expect(searchView({ ...run(), sQuery: "xyzxyz" })).toMatchObject({ none: true, count: 0 });
    expect(searchView(run())).toMatchObject({ hasQuery: false, count: 0, none: false });
  });
});

describe("Powiadomienia – filtry", () => {
  it("widok domyślny: „Aktualne dla Ciebie”", () => {
    const v = notificationsView(run({ type: "openNotifications" }));
    expect(v.heading).toBe("Aktualne dla Ciebie");
    expect(v.sub).toBe("Jasionka + treści ogólnogminne · tylko aktualne");
  });

  it("kategoria i typ to osobne filtry", () => {
    const cat = run({ type: "openCategory", category: "Wydarzenia i kultura" });
    expect(new Set(filterNotifications(cat).map((m) => m.cat))).toEqual(new Set(["Wydarzenia i kultura"]));
    const typ = run({ type: "patch", patch: { nType: "Ostrzeżenie" } });
    expect(titles(filterNotifications(typ))).toEqual(["Silny wiatr – cała gmina"]);
  });

  it("Alert RCB: brak wyników ma własny komunikat", () => {
    const v = notificationsView(run({ type: "patch", patch: { nType: "Alert" } }));
    expect(v.empty).toBe(true);
    expect(v.emptyText).toBe("Brak alertów RCB. Alert stosujemy wyłącznie dla komunikatów RCB.");
    expect(v.chips).toEqual([{ key: "nType", label: "Alert RCB" }]);
  });

  it("„Wyczyść filtry” przełącza zakres na „Wszystkie”", () => {
    const s = run({ type: "patch", patch: { nCat: "Odpady", nType: "Informacja", nQuery: "x" } }, { type: "clearNotificationFilters" });
    expect(s).toMatchObject({ nLoc: "mine", nCat: "all", nType: "all", nQuery: "", nScope: "all" });
  });
});

describe("nawigacja jako stan i reset", () => {
  it("wejście → Start → Powiadomienia → szczegół → Wróć", () => {
    let s = run({ type: "login" });
    expect(s.screen).toBe("home");
    s = apply(s, { type: "openNotifications" }, { type: "openMessage", id: "wind" });
    expect(s).toMatchObject({ screen: "detail", detailId: "wind" });
    expect(s.unread.wind).toBeUndefined();
    s = apply(s, { type: "back" });
    expect(s.screen).toBe("notifs");
    s = apply(s, { type: "back" }, { type: "back" });
    expect(s).toMatchObject({ screen: "home", stack: [] });
  });

  it("zakładka dolnej nawigacji czyści historię przejść", () => {
    const s = run({ type: "login" }, { type: "goTarget", target: "waste" }, { type: "tab", screen: "search" });
    expect(s).toMatchObject({ screen: "search", stack: [] });
  });

  it("działanie komunikatu prowadzi do konkretnego miejsca", () => {
    expect(run({ type: "actOnMessage", id: "waste-jas" }).screen).toBe("waste");
    expect(run({ type: "actOnMessage", id: "road-laka" })).toMatchObject({ screen: "stub", stubKey: "mapmsg" });
    expect(run({ type: "actOnMessage", id: "wind" })).toMatchObject({ screen: "detail", detailId: "wind" });
  });

  it("usługi niepotwierdzone otwierają zaślepkę", () => {
    expect(run({ type: "goTarget", target: "stub:card" })).toMatchObject({ screen: "stub", stubKey: "card" });
  });

  it("reset przywraca stan początkowy", () => {
    const s = run({ type: "login" }, { type: "publish" }, { type: "selectLocality", value: "Łąka" }, { type: "setNow", now: T1500 }, { type: "toggleFavorite", category: "Zdrowie" }, { type: "reset" });
    expect(s).toEqual(createInitialState());
  });
});

describe("czas demo", () => {
  afterEach(() => { vi.useRealTimers(); });

  it("wyniki nie zależą od zegara systemowego", () => {
    const snapshot = () => {
      const s = run({ type: "publish" });
      return { imp: titles(importantNow(s)), list: filterNotifications(s).map((m) => [m.id, statusOf(s, m)]), waste: wasteView(s) };
    };
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2020, 0, 1, 3, 0));
    const past = snapshot();
    vi.setSystemTime(new Date(2031, 11, 31, 23, 0));
    const future = snapshot();
    expect(past).toEqual(future);
    expect(past.imp).toContain(WATER);
  });
});
