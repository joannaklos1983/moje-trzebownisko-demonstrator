/* eslint-disable @typescript-eslint/no-explicit-any */
/* Test różnicowy: ta sama sekwencja działań na oryginalnej klasie Component z zamrożonego
   demonstratora i na nowym reducerze – stan i wyliczone widoki muszą być identyczne.
   Plik referencyjny jest tylko czytany. Gdy go nie ma (np. w samym repozytorium aplikacji),
   test jest pomijany. */
import fs from "node:fs";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { ICONS } from "../../data/icons";
import { LOCALITIES } from "../../data/localities";
import { campaignLabels, campaignSummary, formToMessage, visibilityNote } from "../../lib/campaign";
import {
  currentForMe, decorateMessage, detailMessage, favoriteItems, favoritesEmptyText, favoritesSummary, hasUnreadBell,
  importantNow, importantNowEmptyText, localitySelectValue, upcomingEvents,
} from "../../lib/messages";
import type { MessageView } from "../../lib/messages";
import { notificationsView } from "../../lib/notifications";
import { searchView } from "../../lib/search";
import { createInitialState, reducer } from "../../lib/state";
import type { Action, AppState } from "../../lib/state";
import { wasteView } from "../../lib/waste";
import type { Category, MessageTypeId } from "../../types";

const REF_FILE = path.resolve(process.cwd(), "..", "moje-trzebownisko-demonstrator", "uruchom-lokalnie", "Main.dc.html");
const hasReference = fs.existsSync(REF_FILE);

/* Minimalny odpowiednik klasy bazowej runtime Claude Design: synchroniczny setState. */
class DCLogic {
  props: any;
  state: any;
  constructor(props: any) { this.props = props || {}; }
  setState(u: any) { this.state = Object.assign({}, this.state, typeof u === "function" ? u(this.state) : u); }
}

function loadReference(): any {
  const html = fs.readFileSync(REF_FILE, "utf8");
  const src = html.slice(html.indexOf("var IC = {"), html.lastIndexOf("</script>"));
  const Component = new Function("DCLogic", src + "\nreturn Component;")(DCLogic);
  return new Component({});
}

/* ---- ta sama akcja po obu stronach ---- */
function refApply(ref: any, a: Action): void {
  const rv = ref.renderVals();
  const find = (id: string) => ref.all().find((m: any) => m.id === id);
  switch (a.type) {
    case "patch": ref.setState(a.patch); break;
    case "go": ref.go(a.screen, a.patch); break;
    case "back": ref.back(); break;
    case "tab": ref.tab(a.screen); break;
    case "goTarget": ref.goTarget(a.target); break;
    case "openStub": ref.go("stub", { stubKey: a.key }); break;
    case "login": rv.act.login(); break;
    case "logout": rv.act.logout(); break;
    case "openNotifications": rv.act.bell(); break;
    case "openCategory": rv.cats.find((c: any) => c.label === a.category).go(); break;
    case "openMessage": ref.openMsg(find(a.id)); break;
    case "actOnMessage": ref.actMsg(find(a.id)); break;
    case "clearNotificationFilters": rv.n.clear(); break;
    case "selectLocality": rv.act.setLoc({ target: { value: a.value } }); break;
    case "showWholeGmina": rv.act.wholeGmina(); break;
    case "setNow": rv.shell.times.find((t: any) => a.now.endsWith("T" + t.l.padStart(5, "0"))).pick(); break;
    case "toggleFavorite": rv.fv.cats.find((c: any) => c.label === a.category).toggle(); break;
    case "toggleChannel": rv.p.channels[["push", "email", "sms"].indexOf(a.key)].toggle(); break;
    case "toggleA11y": rv.p.a11y[["big", "motion"].indexOf(a.key)].toggle(); break;
    case "toggleFavNotify": rv.p.toggleFavNotify(); break;
    case "patchReport": ref.setState({ rep: Object.assign({}, ref.state.rep, a.patch) }); break;
    case "resetReport": rv.r.again(); break;
    case "toggleSortRule": rv.ws.sort.find((x: any) => x.k === a.key).toggle(); break;
    case "patchForm": ref.setState({ form: Object.assign({}, ref.state.form, a.patch) }); break;
    case "publish": ref.publish(); break;
    case "clearToast": ref.setState({ toast: "" }); break;
    case "showAdminHint": rv.act.showAdmin(); break;
    case "hideAdminHint": ref.setState({ adminFlash: false }); break;
    case "reset": rv.shell.reset(); break;
  }
}

/* ---- porównanie wyliczonych widoków ---- */
const plain = (o: any) => JSON.parse(JSON.stringify(o));

function refCard(d: any) {
  const o = plain(d); /* JSON pomija funkcje open / act */
  return o;
}
function myCard(v: MessageView) {
  const { status, action, ...rest } = v;
  void status; void action;
  return plain({ ...rest, typeIcon: ICONS[v.typeIcon], catIcon: ICONS[v.catIcon] });
}

function compareViews(ref: any, s: AppState): void {
  const rv = ref.renderVals();
  const card = (m: Parameters<typeof decorateMessage>[1]) => myCard(decorateMessage(s, m));

  /* Ważne teraz */
  const imp = importantNow(s);
  expect(imp.length > 0).toBe(rv.w.has);
  if (rv.w.has) expect(imp.map(card)).toEqual([rv.w.big].concat(rv.w.rest).map(refCard));
  expect("Wszystkie (" + currentForMe(s).length + ")").toBe(rv.w.allLabel);
  expect(importantNowEmptyText(s)).toBe(rv.w.emptyText);
  expect(s.locPriority).toBe(rv.w.canWiden);
  expect(hasUnreadBell(s)).toBe(rv.g.bellDot);
  expect(localitySelectValue(s)).toBe(rv.g.locSel);

  /* kalendarz na pulpicie */
  expect(upcomingEvents(s).map(({ title, place, dow, day, mon }) => ({ title, place, dow, day, mon }))).toEqual(plain(rv.events));

  /* Powiadomienia */
  const n = notificationsView(s);
  expect(n.items.map(card)).toEqual(rv.n.items.map(refCard));
  expect({ heading: n.heading, sub: n.sub, empty: n.empty, emptyText: n.emptyText }).toEqual({ heading: rv.n.heading, sub: rv.n.sub, empty: rv.n.empty, emptyText: rv.n.emptyText });
  expect(n.chips.map((c) => c.label)).toEqual(rv.n.chips.map((c: any) => c.label));
  expect([n.locOptions, n.catOptions, n.typeOptions]).toEqual(plain([rv.n.locOpts, rv.n.catOpts, rv.n.typeOpts]));

  /* szczegół */
  expect(card(detailMessage(s))).toEqual(refCard(rv.d));

  /* Szukaj */
  const sr = searchView(s);
  expect(sr.results.map((r) => ({ title: r.title, meta: r.meta, icon: ICONS[r.icon] }))).toEqual(rv.sr.results.map((r: any) => ({ title: r.title, meta: r.meta, icon: r.icon })));
  expect({ context: sr.context, count: sr.count, none: sr.none, hasQuery: sr.hasQuery }).toEqual({ context: rv.sr.context, count: rv.sr.count, none: rv.sr.none, hasQuery: rv.sr.hasQuery });

  /* Ulubione */
  expect(favoriteItems(s).map(card)).toEqual(rv.fv.items.map(refCard));
  expect(favoritesEmptyText(s)).toBe(rv.fv.emptyText);
  expect(favoritesSummary(s)).toBe(rv.p.favSummary);

  /* Odpady */
  const ws = wasteView(s);
  expect({ loc: ws.loc, locNote: ws.locNote, next: ws.next, list: ws.list }).toEqual(plain({ loc: rv.ws.loc, locNote: rv.ws.locNote, next: rv.ws.next, list: rv.ws.list }));

  /* panel administratora */
  const labels = campaignLabels(s.published.length > 0);
  expect(labels).toEqual({ heading: rv.adm.heading, publishLabel: rv.adm.publishLabel });
  expect(campaignSummary(s.form)).toEqual(plain(rv.adm.summary));
  expect(visibilityNote(s.form)).toBe(rv.adm.visNote);
  expect(card(formToMessage(s.form, s.now))).toEqual(refCard(rv.pv));
}

function runBoth(actions: Action[], check: (ref: any, s: AppState, i: number) => void = () => {}): { ref: any; s: AppState } {
  const ref = loadReference();
  let s = createInitialState();
  expect(s).toEqual(plain(ref.state));
  actions.forEach((a, i) => {
    refApply(ref, a);
    s = reducer(s, a);
    expect(s, "stan po akcji #" + i + " " + a.type).toEqual(plain(ref.state));
    check(ref, s, i);
  });
  return { ref, s };
}

const TIMES = ["2026-10-06T07:30", "2026-10-06T10:30", "2026-10-06T15:00"];

describe.skipIf(!hasReference)("zgodność z zamrożonym demonstratorem", () => {
  beforeAll(() => { vi.useFakeTimers(); });
  afterAll(() => { vi.useRealTimers(); });

  it("stan początkowy i widoki bez żadnych działań", () => {
    const { ref, s } = runBoth([]);
    compareViews(ref, s);
  });

  it("scenariusz 9 kroków: stan i widoki po każdym kroku", () => {
    const steps: Action[] = [
      { type: "login" },
      { type: "selectLocality", value: "Łąka" }, { type: "selectLocality", value: "Jasionka" },
      { type: "openNotifications" }, { type: "openMessage", id: "wind" }, { type: "back" }, { type: "tab", screen: "home" },
      { type: "publish" },
      { type: "openNotifications" }, { type: "openMessage", id: "admin-1" }, { type: "tab", screen: "home" },
      { type: "selectLocality", value: "Łąka" }, { type: "selectLocality", value: "__all" }, { type: "openNotifications" }, { type: "tab", screen: "home" },
      { type: "selectLocality", value: "Jasionka" }, { type: "goTarget", target: "waste" }, { type: "tab", screen: "home" },
      { type: "selectLocality", value: "Łąka" }, { type: "goTarget", target: "waste" }, { type: "tab", screen: "home" }, { type: "selectLocality", value: "Jasionka" },
      { type: "setNow", now: TIMES[0] }, { type: "setNow", now: TIMES[1] }, { type: "setNow", now: TIMES[2] },
      { type: "openNotifications" }, { type: "patch", patch: { nScope: "all" } },
      { type: "reset" },
    ];
    runBoth(steps, (ref, s) => compareViews(ref, s));
  });

  it("pozostałe działania: nawigacja, filtry, ulubione, profil, zgłoszenia, odpady, panel", () => {
    const steps: Action[] = [
      { type: "openStub", key: "about" }, { type: "login" },
      { type: "goTarget", target: "notifs" }, { type: "back" },
      { type: "goTarget", target: "stub:evoting" }, { type: "back" }, { type: "goTarget", target: "stub:card" }, { type: "back" },
      { type: "goTarget", target: "reports" }, { type: "patchReport", patch: { type: "Inne", desc: "test", file: true, mode: "pick" } }, { type: "patchReport", patch: { sent: true } }, { type: "resetReport" }, { type: "back" },
      { type: "openCategory", category: "Sport i OSiR" }, { type: "patch", patch: { nFilters: true } }, { type: "patch", patch: { nType: "Alert" } }, { type: "clearNotificationFilters" }, { type: "back" },
      { type: "actOnMessage", id: "waste-jas" }, { type: "toggleSortRule", key: "pa" }, { type: "toggleSortRule", key: "sz" }, { type: "toggleSortRule", key: "sz" }, { type: "back" },
      { type: "actOnMessage", id: "road-laka" }, { type: "back" }, { type: "actOnMessage", id: "fizjo" }, { type: "back" }, { type: "back" }, { type: "back" },
      { type: "tab", screen: "fav" }, { type: "toggleFavorite", category: "Zdrowie" }, { type: "toggleFavorite", category: "Wydarzenia i kultura" }, { type: "toggleFavorite", category: "Zdrowie" },
      { type: "tab", screen: "profile" }, { type: "toggleChannel", key: "email" }, { type: "toggleChannel", key: "push" }, { type: "toggleA11y", key: "big" }, { type: "toggleFavNotify" },
      { type: "selectLocality", value: "Zaczernie" }, { type: "showWholeGmina" }, { type: "showAdminHint" }, { type: "hideAdminHint" },
      { type: "tab", screen: "search" }, { type: "patch", patch: { sQuery: "odpady" } },
      { type: "patchForm", patch: { type: "Alert", group: "Wszyscy", sendMode: "now", important: false, btn: "Zobacz", push: true, email: true, sms: true } }, { type: "publish" }, { type: "clearToast" },
      { type: "patchForm", patch: { important: true, od: "2026-10-06T12:00", do: "2026-10-07T09:00" } }, { type: "publish" },
      { type: "patchForm", patch: { title: "", text: "", link: "", od: "", do: "" } }, { type: "publish" },
      { type: "logout" }, { type: "reset" },
    ];
    runBoth(steps, (ref, s) => compareViews(ref, s));
  });

  it("macierz: miejscowość × czas × kampania × filtry Powiadomień × zapytania", () => {
    const campaigns: (Action[] | null)[] = [
      null,
      [{ type: "publish" }],
      [{ type: "patchForm", patch: { type: "Alert", group: "Wszyscy" } }, { type: "publish" }],
      [{ type: "patchForm", patch: { type: "Ostrzeżenie", group: "Łąka", important: false, sendMode: "now" } }, { type: "publish" }],
    ];
    const locs = [...LOCALITIES, "__all" as const];
    const scopes = ["current", "all"] as const;
    const nLocs = ["mine", "all", "Łąka"] as const;
    const cats: ("all" | Category)[] = ["all", "Odpady"];
    const types: ("all" | MessageTypeId)[] = ["all", "Ostrzeżenie", "Alert"];
    const queries = ["", "woda", "Łąka", "odpadów jasionka", "brak-takiego"];
    let combos = 0;

    for (const campaign of campaigns) {
      for (const loc of locs) {
        for (const now of TIMES) {
          const base: Action[] = [{ type: "login" }, ...(campaign || []), { type: "selectLocality", value: loc }, { type: "setNow", now }];
          const { ref, s: s0 } = runBoth(base);
          let s = s0;
          for (const nScope of scopes) for (const nLoc of nLocs) for (const nCat of cats) for (const nType of types) {
            const q = queries[combos % queries.length];
            const a: Action = { type: "patch", patch: { nScope, nLoc, nCat, nType, nQuery: q, sQuery: q, detailId: combos % 2 ? "admin-1" : "water-nw" } };
            refApply(ref, a);
            s = reducer(s, a);
            compareViews(ref, s);
            combos++;
          }
        }
      }
    }
    expect(combos).toBe(4 * 11 * 3 * 36);
  }, 120_000);
});
