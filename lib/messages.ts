import { CATEGORY_ICON } from "../data/categories";
import { MONTHS_SHORT, WEEKDAYS_UPPER } from "../data/demo";
import { ALL_LOCALITIES_LABEL, ALL_LOCALITIES_VALUE, GROUP_EVERYONE } from "../data/localities";
import { MESSAGE_TYPES, STATUSES } from "../data/messageTypes";
import { SEED_MESSAGES } from "../data/notifications";
import type { AllLocalitiesValue, AudienceGroup, Category, IconName, Locality, Message, MessageAction, StatusId } from "../types";
import type { AppState } from "./state";
import { formatDateTime, ts } from "./time";

/* ---------- lista komunikatów ---------- */

/** Wszystkie komunikaty: opublikowane z panelu + przykładowe. Jedno źródło dla wszystkich widoków. */
export function allMessages(s: AppState): Message[] {
  return s.published.concat(SEED_MESSAGES);
}

/** Komunikat jest widoczny dla mieszkańca od daty wysłania. */
export function isSent(s: AppState, m: Message): boolean {
  return ts(s.now) >= ts(m.sentAt);
}

export function sentMessages(s: AppState): Message[] {
  return allMessages(s).filter((m) => isSent(s, m));
}

/* ---------- status i „Ważne teraz” ---------- */

/** Status liczony z „Ważne do” i czasu zdarzenia: po „Ważne do” – ZAKOŃCZONE; w trakcie – TRWA. */
export function statusOf(s: AppState, m: Message): StatusId {
  const n = ts(s.now);
  if (n > ts(m.do)) return "ended";
  if (m.evStart && n >= ts(m.evStart) && n <= ts(m.evEnd)) return "live";
  return "current";
}

/** Oznaczony „Pokaż w Ważne teraz” i aktywny między „Ważne od” a „Ważne do”. */
export function isImportantNow(s: AppState, m: Message): boolean {
  const n = ts(s.now);
  return m.important && n >= ts(m.od) && n <= ts(m.do);
}

/* ---------- zakres widoku i kolejność ---------- */

/** Zakres widoku mieszkańca:
    „Moja miejscowość” = treści dla mojej miejscowości + ogólnogminne (grupa „Wszyscy”);
    „Cała gmina” = treści ze WSZYSTKICH miejscowości + ogólnogminne. To nie jest grupa „Wszyscy”. */
export function isForMe(s: AppState, m: Message): boolean {
  if (!s.locPriority) return true;
  return m.group === GROUP_EVERYONE || m.group === s.loc;
}

/** Bliskość: 0 = moja miejscowość, 1 = cała gmina (grupa „Wszyscy”), 2 = pozostałe miejscowości.
    Miejscowość z profilu zachowuje pierwszeństwo także w widoku „Cała gmina”. */
export function tier(s: AppState, m: Message): number {
  return m.group === s.loc ? 0 : m.group === GROUP_EVERYONE ? 1 : 2;
}

export function isLocal(s: AppState, m: Message): boolean {
  return m.group === s.loc;
}

/** Kolejność: typ (Alert RCB → Ostrzeżenie → Informacja), potem bliskość, potem TRWA, potem najnowsze. */
export function compareRank(s: AppState, a: Message, b: Message): number {
  const ta = MESSAGE_TYPES[a.type].rank, tb = MESSAGE_TYPES[b.type].rank;
  if (ta !== tb) return ta - tb;
  const la = tier(s, a), lb = tier(s, b);
  if (la !== lb) return la - lb;
  const sa = statusOf(s, a) === "live" ? 0 : 1, sb = statusOf(s, b) === "live" ? 0 : 1;
  if (sa !== sb) return sa - sb;
  return ts(b.sentAt) - ts(a.sentAt);
}

/* ---------- pulpit ---------- */

/** Aktualne komunikaty w moim zakresie – licznik „Wszystkie (N)” i kropka przy dzwonku. */
export function currentForMe(s: AppState): Message[] {
  return sentMessages(s).filter((m) => isForMe(s, m) && statusOf(s, m) !== "ended");
}

export function hasUnreadBell(s: AppState): boolean {
  return currentForMe(s).some((m) => !!s.unread[m.id]);
}

export const IMPORTANT_NOW_LIMIT = 3;

/** „Ważne teraz”: najwyżej 3 aktywne, wyróżnione komunikaty w ustalonej kolejności. */
export function importantNow(s: AppState): Message[] {
  return sentMessages(s)
    .filter((m) => isImportantNow(s, m) && isForMe(s, m))
    .sort((a, b) => compareRank(s, a, b))
    .slice(0, IMPORTANT_NOW_LIMIT);
}

export function importantNowEmptyText(s: AppState): string {
  return s.locPriority
    ? "Obecnie w Twojej miejscowości nie ma aktualnych informacji."
    : "Obecnie w gminie nie ma aktualnych informacji wyróżnionych jako ważne.";
}

/** Wartość i etykieta selektora „Moja miejscowość”. */
export function localitySelectValue(s: AppState): Locality | AllLocalitiesValue {
  return s.locPriority ? s.loc : ALL_LOCALITIES_VALUE;
}

export function scopeLabel(s: AppState): string {
  return s.locPriority ? s.loc : ALL_LOCALITIES_LABEL;
}

export interface EventPreview {
  id: string;
  title: string;
  place: string;
  dow: string;
  day: number;
  mon: string;
}

/** Kalendarz na pulpicie: kolejny widok tych samych komunikatów, nie osobne treści. */
export function upcomingEvents(s: AppState): EventPreview[] {
  return sentMessages(s)
    .filter((m) => (m.cat === "Wydarzenia i kultura" || m.cat === "Sport i OSiR") && m.evStart && statusOf(s, m) !== "ended")
    .sort((a, b) => ts(a.evStart) - ts(b.evStart))
    .slice(0, 3)
    .map((m) => {
      const d = new Date(m.evStart as string);
      return { id: m.id, title: m.title, place: m.place, dow: WEEKDAYS_UPPER[d.getDay()], day: d.getDate(), mon: MONTHS_SHORT[d.getMonth()] };
    });
}

/* ---------- Ulubione ---------- */

/** Najnowsze aktualne treści z obserwowanych kategorii. */
export function favoriteItems(s: AppState): Message[] {
  return sentMessages(s)
    .filter((m) => s.favs.indexOf(m.cat) >= 0 && statusOf(s, m) !== "ended")
    .sort((a, b) => ts(b.sentAt) - ts(a.sentAt))
    .slice(0, 5);
}

export function favoritesEmptyText(s: AppState): string {
  return s.favs.length ? "Brak aktualnych treści w obserwowanych kategoriach." : "Nie obserwujesz jeszcze żadnej kategorii.";
}

export function favoritesSummary(s: AppState): string {
  return s.favs.length ? s.favs.join(", ") : "Brak – wybierz w Ulubionych";
}

/** Ekran Ulubione (dodane po migracji): najnowsze aktualne treści z obserwowanych kategorii
    w moim zakresie miejscowości. Te same rekordy co w Powiadomieniach. */
export function favoriteFeed(s: AppState): Message[] {
  return sentMessages(s)
    .filter((m) => s.favs.indexOf(m.cat) >= 0 && isForMe(s, m) && statusOf(s, m) !== "ended")
    .sort((a, b) => ts(b.sentAt) - ts(a.sentAt))
    .slice(0, 5);
}

/** Oficjalny link zewnętrzny – tylko gdy rekord ma POTWIERDZONY, prawdziwy adres (pole officialUrl).
    Adresy z polami do uzupełnienia w nawiasach kwadratowych nie są linkami. Nie zgadujemy adresów. */
export function confirmedExternalUrl(m: Message): string {
  const url = (m.officialUrl || "").trim();
  return /^https:\/\/[^\s[\]]+$/.test(url) ? url : "";
}

/* ---------- szczegół i karta komunikatu ---------- */

/** Komunikat pokazywany na ekranie szczegółu (gdy brak – pierwszy przykładowy, jak w demonstratorze). */
export function detailMessage(s: AppState): Message {
  return allMessages(s).filter((m) => m.id === s.detailId)[0] || SEED_MESSAGES[0];
}

export interface MessageView {
  id: string;
  title: string;
  place: string;
  when: string;
  text: string;
  todo: string;
  hasTodo: boolean;
  cat: Category;
  group: AudienceGroup;
  whom: string;
  typeLabel: string;
  typeIcon: IconName;
  pillBg: string;
  pillFg: string;
  bigBg: string;
  bigBorder: string;
  circleBg: string;
  circleFg: string;
  borderC: string;
  bgC: string;
  titleC: string;
  status: StatusId;
  statusLabel: string;
  stBg: string;
  stFg: string;
  unread: boolean;
  btn: string;
  catIcon: IconName;
  validity: string;
  sentLabel: string;
  hasLink: boolean;
  link: string;
  hasAction: boolean;
  action: MessageAction;
}

/** Komunikat przygotowany do wyświetlenia: etykiety, kolory typu i statusu, teksty pomocnicze. */
export function decorateMessage(s: AppState, m: Message): MessageView {
  const T = MESSAGE_TYPES[m.type] || MESSAGE_TYPES.Informacja;
  const st = statusOf(s, m);
  const S = STATUSES[st];
  return {
    id: m.id, title: m.title || "[Tytuł komunikatu]", place: m.place, when: m.when, text: m.text || "[Treść komunikatu]",
    todo: m.todo || "", hasTodo: !!m.todo, cat: m.cat, group: m.group,
    whom: m.group === GROUP_EVERYONE ? "Wszyscy mieszkańcy gminy" : "Mieszkańcy: " + m.group,
    typeLabel: T.label, typeIcon: T.icon, pillBg: T.pillBg, pillFg: T.pillFg, bigBg: T.bigBg, bigBorder: T.bigBorder, circleBg: T.circleBg, circleFg: T.circleFg,
    borderC: st === "ended" ? "#DFE6E2" : T.cardBorder, bgC: st === "ended" ? "#F7F8F7" : T.cardBg, titleC: st === "ended" ? "#3C474C" : "#1F2A2E",
    status: st, statusLabel: S.label, stBg: S.bg, stFg: S.fg, unread: !!s.unread[m.id], btn: m.btn || "Szczegóły", catIcon: CATEGORY_ICON[m.cat] || "dots",
    validity: formatDateTime(m.od) + " – " + formatDateTime(m.do), sentLabel: formatDateTime(m.sentAt), hasLink: !!m.link, link: m.link || "",
    hasAction: m.action === "waste" || m.action === "map", action: m.action,
  };
}
