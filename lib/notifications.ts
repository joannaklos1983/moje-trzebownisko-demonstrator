import { CATEGORIES } from "../data/categories";
import { GROUP_EVERYONE, LOCALITIES } from "../data/localities";
import type { Message } from "../types";
import { compareRank, isForMe, sentMessages, statusOf } from "./messages";
import type { AppState } from "./state";
import { matchesAllWords, normalize } from "./text";

export interface Option {
  v: string;
  l: string;
}

export interface FilterChip {
  /** Który filtr usuwa kliknięcie w etykietę. */
  key: "nLoc" | "nCat" | "nType";
  label: string;
}

export interface NotificationsView {
  heading: string;
  sub: string;
  items: Message[];
  empty: boolean;
  emptyText: string;
  chips: FilterChip[];
  locOptions: Option[];
  catOptions: Option[];
  typeOptions: Option[];
}

/** Wartość, do której wraca filtr po usunięciu etykiety. */
export const FILTER_RESET: Pick<AppState, "nLoc" | "nCat" | "nType"> = { nLoc: "mine", nCat: "all", nType: "all" };

/** Lista Powiadomień po filtrach: aktualność, miejscowość, kategoria, typ, wyszukiwanie. */
export function filterNotifications(s: AppState): Message[] {
  const q = normalize(s.nQuery).trim();
  return sentMessages(s)
    .filter((m) => {
      if (s.nScope === "current" && statusOf(s, m) === "ended") return false;
      if (s.nLoc === "mine") { if (!isForMe(s, m)) return false; }
      else if (s.nLoc !== "all") { if (!(m.group === s.nLoc || m.group === GROUP_EVERYONE)) return false; }
      if (s.nCat !== "all" && m.cat !== s.nCat) return false;
      if (s.nType !== "all" && m.type !== s.nType) return false;
      if (q) {
        const hay = normalize(m.title + " " + m.cat + " " + m.place + " " + m.text + " " + m.group);
        if (!matchesAllWords(hay, q)) return false;
      }
      return true;
    })
    /* zakończone na końcu, w obu grupach kolejność ważności */
    .sort((a, b) => {
      const ea = statusOf(s, a) === "ended" ? 1 : 0, eb = statusOf(s, b) === "ended" ? 1 : 0;
      if (ea !== eb) return ea - eb;
      return compareRank(s, a, b);
    });
}

export function notificationsView(s: AppState): NotificationsView {
  const q = normalize(s.nQuery).trim();
  const items = filterNotifications(s);

  const chips: FilterChip[] = [];
  if (s.nLoc !== "mine") chips.push({ key: "nLoc", label: s.nLoc === "all" ? "Cała gmina" : s.nLoc });
  if (s.nCat !== "all") chips.push({ key: "nCat", label: s.nCat });
  if (s.nType !== "all") chips.push({ key: "nType", label: s.nType === "Alert" ? "Alert RCB" : s.nType });

  const defaultView = s.nScope === "current" && s.nLoc === "mine" && !chips.length && !q;
  const scope =
    s.nLoc === "mine"
      ? (s.locPriority ? s.loc + " + treści ogólnogminne" : "Cała gmina – wszystkie miejscowości")
      : (s.nLoc === "all" ? "Cała gmina – wszystkie miejscowości" : s.nLoc + " + treści ogólnogminne");

  return {
    heading: defaultView ? "Aktualne dla Ciebie" : (s.nCat !== "all" ? s.nCat : (s.nScope === "current" ? "Aktualne" : "Wszystkie powiadomienia")),
    sub: scope + (s.nScope === "current" ? " · tylko aktualne" : " · aktualne i zakończone"),
    items,
    empty: items.length === 0,
    emptyText: s.nType === "Alert"
      ? "Brak alertów RCB. Alert stosujemy wyłącznie dla komunikatów RCB."
      : (s.nScope === "current" ? "Brak aktualnych komunikatów dla wybranych filtrów." : "Brak komunikatów dla wybranych filtrów."),
    chips,
    locOptions: [
      { v: "mine", l: s.locPriority ? "Moja miejscowość: " + s.loc : "Zakres widoku: Cała gmina" },
      { v: "all", l: "Cała gmina – wszystkie miejscowości" },
    ].concat(LOCALITIES.map((x) => ({ v: x, l: x }))),
    catOptions: [{ v: "all", l: "Wszystkie kategorie" }].concat(CATEGORIES.map((x) => ({ v: x, l: x }))),
    typeOptions: [
      { v: "all", l: "Wszystkie typy" },
      { v: "Informacja", l: "Informacja" },
      { v: "Ostrzeżenie", l: "Ostrzeżenie" },
      { v: "Alert", l: "Alert RCB" },
    ],
  };
}
