import { describe, expect, it } from "vitest";
import { DEMO_REPORTS, REPORT_STATUSES, REPORT_TYPES } from "../../data/reports";
import { CATEGORIES } from "../../data/categories";
import { CARD_PARTNERS, CATEGORY_HERO, DEFAULT_HERO } from "../../data/startV4";
import { REPORT_FILTERS_DEFAULT, activeReportFilters, allReports, filterReports, findReport, reportDateLabel, reportFormErrors, reportLocation } from "../../lib/reports";
import { createInitialState } from "../../lib/state";
import { apply, run } from "./helpers";

const titles = (list: { title: string }[]) => list.map((r) => r.title);
const f = (patch: Partial<typeof REPORT_FILTERS_DEFAULT>) => ({ ...REPORT_FILTERS_DEFAULT, ...patch });

describe("Zgłoszenia – dane demonstracyjne", () => {
  it("trzy przykładowe zgłoszenia z dokumentu danych demo; typy z istniejącej listy", () => {
    expect(DEMO_REPORTS.map((r) => [r.title, r.locality, r.place, REPORT_STATUSES[r.status].label])).toEqual([
      ["Awaria infrastruktury wodociągowej", "Jasionka", "ul. przykładowa / punkt na mapie", "Nowe"],
      ["Uszkodzona latarnia", "Łąka", "okolice drogi gminnej", "W realizacji"],
      ["Ubytek w nawierzchni drogi", "Zaczernie", "punkt wskazany na mapie", "Zakończone"],
    ]);
    expect(DEMO_REPORTS.every((r) => REPORT_TYPES.includes(r.type))).toBe(true);
  });

  it("jeden rekord zasila listę, mapę i szczegół", () => {
    const s = run({ type: "openReport", id: "zgl-2" });
    const fromList = filterReports(s, REPORT_FILTERS_DEFAULT).find((r) => r.id === "zgl-2");
    expect(findReport(s, s.reportId)).toBe(fromList);
    expect(fromList).toMatchObject({ mapX: 30, mapY: 58 });
    expect(s).toMatchObject({ screen: "reportDetail", reportId: "zgl-2" });
  });
});

describe("Zgłoszenia – lista i filtry", () => {
  it("domyślnie: najpierw moja miejscowość, potem najnowsze", () => {
    expect(titles(filterReports(run(), REPORT_FILTERS_DEFAULT))).toEqual(["Awaria infrastruktury wodociągowej", "Uszkodzona latarnia", "Ubytek w nawierzchni drogi"]);
    expect(titles(filterReports(run({ type: "selectLocality", value: "Zaczernie" }), REPORT_FILTERS_DEFAULT))[0]).toBe("Ubytek w nawierzchni drogi");
    expect(titles(filterReports(run({ type: "selectLocality", value: "__all" }), REPORT_FILTERS_DEFAULT))).toEqual(["Awaria infrastruktury wodociągowej", "Uszkodzona latarnia", "Ubytek w nawierzchni drogi"]);
  });

  it("rodzaj, miejscowość, status, data", () => {
    const s = run();
    expect(titles(filterReports(s, f({ type: "Awaria oświetlenia ulicznego" })))).toEqual(["Uszkodzona latarnia"]);
    expect(titles(filterReports(s, f({ locality: "Zaczernie" })))).toEqual(["Ubytek w nawierzchni drogi"]);
    expect(titles(filterReports(s, f({ status: "new" })))).toEqual(["Awaria infrastruktury wodociągowej"]);
    expect(titles(filterReports(s, f({ days: "7" })))).toEqual(["Awaria infrastruktury wodociągowej", "Uszkodzona latarnia"]);
    expect(titles(filterReports(s, f({ days: "30" }))).length).toBe(3);
    expect(filterReports(s, f({ locality: "Stobierna" }))).toEqual([]);
    expect(activeReportFilters(f({ type: "Inne", status: "done" }))).toBe(2);
  });

  it("wyszukiwanie z polskimi znakami", () => {
    const s = run();
    expect(titles(filterReports(s, f({ query: "latarnia" })))).toEqual(["Uszkodzona latarnia"]);
    expect(titles(filterReports(s, f({ query: "łąka" })))).toEqual(titles(filterReports(s, f({ query: "laka" }))));
    expect(filterReports(s, f({ query: "qwerty" }))).toEqual([]);
  });

  it("teksty: data i lokalizacja", () => {
    expect(reportDateLabel("2026-10-05")).toBe("5 paź 2026");
    expect(reportLocation(DEMO_REPORTS[1])).toBe("Łąka, okolice drogi gminnej");
  });
});

describe("Zgłoś problem – symulacja", () => {
  it("formularz podpowiada miejscowość z aplikacji", () => {
    expect(run({ type: "selectLocality", value: "Łąka" }, { type: "openReportForm" })).toMatchObject({ screen: "reportForm", reportForm: { locality: "Łąka", type: "", desc: "" } });
  });

  it("niepełny formularz nie dodaje zgłoszenia", () => {
    const s = run({ type: "goTarget", target: "reports" }, { type: "openReportForm" });
    expect(reportFormErrors(s)).toEqual(["Wybierz rodzaj zgłoszenia.", "Opisz krótko, co się stało."]);
    expect(apply(s, { type: "submitReport" })).toBe(s);
  });

  it("wysłanie: nowe zgłoszenie „Nowe” z datą dnia demo, na górze listy, bez kopii", () => {
    let s = run({ type: "goTarget", target: "reports" }, { type: "openReportForm" });
    s = apply(s, { type: "patchReportForm", patch: { type: "Uszkodzony znak drogowy", place: "przy szkole", desc: "Przewrócony znak.", photo: true } }, { type: "submitReport" });
    expect(reportFormErrors({ ...s, reportForm: { ...s.reportForm, type: "x", locality: "Jasionka", desc: "y" } })).toEqual([]);
    expect(s).toMatchObject({ screen: "reportDetail", reportId: "moje-1", reportNoticeId: "moje-1" });
    expect(findReport(s, "moje-1")).toMatchObject({ title: "Uszkodzony znak drogowy", locality: "Jasionka", place: "przy szkole", status: "new", date: "2026-10-06", mine: true, photo: true });
    expect(allReports(s).length).toBe(4);
    expect(filterReports(s, REPORT_FILTERS_DEFAULT)[0].id).toBe("moje-1");
    /* „Wróć” ze szczegółu prowadzi na listę, formularz jest wyczyszczony */
    const back = apply(s, { type: "back" });
    expect(back.screen).toBe("reports");
    expect(back.reportForm).toMatchObject({ type: "", desc: "", photo: false });
  });

  it("reset demo usuwa zgłoszenia mieszkańca", () => {
    const s = run({ type: "openReportForm" }, { type: "patchReportForm", patch: { type: "Inne", desc: "x" } }, { type: "submitReport" }, { type: "reset" });
    expect(s).toEqual(createInitialState());
    expect(allReports(s).length).toBe(3);
  });
});

describe("Karta Mieszkańca – ekran koncepcyjny", () => {
  it("usługa i „Poznaj Kartę” prowadzą do ekranu Karty", () => {
    expect(run({ type: "goTarget", target: "stub:card" })).toMatchObject({ screen: "stub", stubKey: "card" });
  });

  it("partnerzy z grafik: nazwa i przykładowa korzyść", () => {
    expect(CARD_PARTNERS.map((p) => [p.name, p.benefit])).toEqual([
      ["Basen", "15% zniżki z Kartą Mieszkańca"],
      ["Salon kosmetyczny Agnieszka", "10% zniżki z Kartą Mieszkańca"],
      ["Restauracja Szamka", "15% zniżki z Kartą Mieszkańca"],
    ]);
  });

  it("karta partnera otwiera szczegół partnera; Wróć wraca na poprzedni ekran; reset czyści wybór", () => {
    const s = run({ type: "goTarget", target: "stub:card" }, { type: "openPartner", id: "salon" });
    expect(s).toMatchObject({ screen: "partner", partnerId: "salon" });
    expect(apply(s, { type: "back" })).toMatchObject({ screen: "stub", stubKey: "card" });
    expect(apply(s, { type: "reset" }).partnerId).toBeNull();
  });

  it("grafika hero: każda kategoria ma grafikę (własną albo neutralną) z katalogu start-v4", () => {
    for (const cat of CATEGORIES) expect((CATEGORY_HERO[cat] || DEFAULT_HERO).src).toMatch(/^\/assets\/start-v4\//);
    expect(CATEGORY_HERO["Sport i OSiR"]?.src).toContain("slider-sport");
    expect(CATEGORY_HERO["Zdrowie"]?.src).toContain("slider-mammografia");
    expect(CATEGORY_HERO["Edukacja"]?.src).toContain("slider-aed");
  });
});
