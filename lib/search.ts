import { CATEGORY_ICON } from "../data/categories";
import { GROUP_EVERYONE } from "../data/localities";
import { STATUSES } from "../data/messageTypes";
import { SEARCH_STATIC_ENTRIES } from "../data/search";
import type { IconName, SearchFilter, SearchSource, SearchTarget } from "../types";
import { isLocal, sentMessages, statusOf } from "./messages";
import type { AppState } from "./state";
import { matchesAllWords, normalize } from "./text";

export type SearchResultTarget = { messageId: string } | SearchTarget;

export interface SearchResult {
  title: string;
  meta: string;
  icon: IconName;
  target: SearchResultTarget;
  /** Źródło treści (moduł) i jego etykieta w wyniku, np. „Powiadomienie”, „Usługa”. */
  source: SearchSource;
  kind: string;
  category: string;
  /** Miejscowość, jeśli wynik jej dotyczy. */
  locality: string;
  /** Termin i status – tylko dla komunikatów. */
  when: string;
  statusLabel: string;
  statusBg: string;
  statusFg: string;
  snippet: string;
}

export interface SearchView {
  hasQuery: boolean;
  context: string;
  results: SearchResult[];
  count: number;
  none: boolean;
}

interface IndexEntry extends SearchResult {
  hay: string;
  local: number;
  ended: number;
}

/** Jedna wyszukiwarka: komunikaty (ta sama lista co Powiadomienia) + usługi i szybki dostęp. */
function buildIndex(s: AppState): IndexEntry[] {
  const messages: IndexEntry[] = sentMessages(s).map((m) => {
    const st = statusOf(s, m);
    return {
      title: m.title,
      meta: "Powiadomienie · " + m.cat + (m.group !== GROUP_EVERYONE ? " · " + m.group : "") + (st === "ended" ? " · zakończone" : ""),
      icon: CATEGORY_ICON[m.cat] || "dots",
      hay: normalize(m.title + " " + m.cat + " " + m.place + " " + m.text),
      local: isLocal(s, m) ? 0 : (m.group === GROUP_EVERYONE ? 1 : 2),
      ended: st === "ended" ? 1 : 0,
      target: { messageId: m.id },
      source: "Powiadomienia", kind: "Powiadomienie", category: m.cat,
      locality: m.group === GROUP_EVERYONE ? "Cała gmina" : m.group,
      when: m.when, statusLabel: STATUSES[st].label, statusBg: STATUSES[st].bg, statusFg: STATUSES[st].fg,
      snippet: m.text,
    };
  });
  const fixed: IndexEntry[] = SEARCH_STATIC_ENTRIES.map((e) => ({
    title: e.title,
    meta: e.metaWithLocality ? e.meta + " · " + s.loc : e.meta,
    icon: e.icon,
    hay: normalize(e.keywords),
    local: e.local,
    ended: 0,
    target: e.target,
    source: e.source, kind: e.meta.split(" · ")[0], category: e.source === "Usługi" ? "" : e.source,
    locality: e.metaWithLocality ? s.loc : "",
    when: "", statusLabel: "", statusBg: "", statusFg: "",
    snippet: e.snippet,
  }));
  return messages.concat(fixed);
}

/** Filtr źródła. „Odpady” obejmuje moduł Odpady oraz komunikaty z kategorii Odpady. */
function matchesFilter(x: SearchResult, filter: SearchFilter): boolean {
  if (filter === "all") return true;
  if (filter === "Odpady") return x.source === "Odpady" || x.category === "Odpady";
  return x.source === filter;
}

/** Wyniki: najpierw aktualne, w nich najpierw moja miejscowość, potem cała gmina, potem pozostałe. */
export function searchView(s: AppState, filter: SearchFilter = "all"): SearchView {
  const q = normalize(s.sQuery).trim();
  const results = q
    ? buildIndex(s)
        .filter((x) => matchesAllWords(x.hay, q) && matchesFilter(x, filter))
        .sort((a, b) => (a.ended - b.ended) || (a.local - b.local))
        .map((x): SearchResult => {
          const { hay, local, ended, ...rest } = x;
          void hay; void local; void ended;
          return rest;
        })
    : [];
  return {
    hasQuery: !!q,
    context: s.locPriority ? "Najpierw wyniki dla: " + s.loc + ", potem cała gmina" : "Wyniki dla całej gminy",
    results,
    count: results.length,
    none: !!q && results.length === 0,
  };
}
