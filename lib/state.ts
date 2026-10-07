import { CAMPAIGN_FORM_DEFAULTS } from "../data/campaignDefaults";
import { INITIAL_A11Y, INITIAL_CHANNELS, INITIAL_FAV_NOTIFY, INITIAL_FAVORITE_CATEGORIES, INITIAL_LOCALITY, INITIAL_NOW, INITIAL_UNREAD_IDS } from "../data/demo";
import { ALL_LOCALITIES_VALUE } from "../data/localities";
import { REPORT_DRAFT_DEFAULTS, REPORT_FORM_DEFAULTS } from "../data/reports";
import { SEED_MESSAGES } from "../data/notifications";
import type {
  A11yKey, AllLocalitiesValue, CampaignForm, Category, ChannelKey, Locality, Message, MessageTypeId,
  Report, ReportDraft, ReportFormState, ScreenId, ServiceTarget, StubKey, WasteFractionKey,
} from "../types";
import { ADMIN_HINT_TOAST, formToMessage, publishToast } from "./campaign";

/* Jeden wspólny stan demonstratora: aplikacja mieszkańca i panel administratora.
   Nawigacja jest częścią stanu (bez adresów URL), stan żyje w pamięci (bez localStorage). */

export interface NavEntry {
  screen: ScreenId;
  detailId: string | null;
  stubKey: StubKey | null;
}

export type NotifScope = "current" | "all";
export type NotifLocFilter = "mine" | "all" | Locality;

export interface AppState {
  /* nawigacja */
  screen: ScreenId;
  stack: NavEntry[];
  detailId: string | null;
  stubKey: StubKey | null;
  /* kontekst mieszkańca */
  loc: Locality;
  /** true = „Moja miejscowość”, false = zakres „Cała gmina”. */
  locPriority: boolean;
  /** Czas demo. */
  now: string;
  /* komunikaty */
  published: Message[];
  unread: Record<string, true>;
  /* Powiadomienia */
  nScope: NotifScope;
  nQuery: string;
  nLoc: NotifLocFilter;
  nCat: "all" | Category;
  nType: "all" | MessageTypeId;
  nFilters: boolean;
  /* Szukaj, Ulubione, Profil */
  sQuery: string;
  favs: Category[];
  channels: Record<ChannelKey, boolean>;
  favNotify: boolean;
  a11y: Record<A11yKey, boolean>;
  /* Zgłoszenia, Odpady */
  rep: ReportDraft;
  sortOpen: WasteFractionKey | null;
  /* panel administratora */
  form: CampaignForm;
  toast: string;
  adminFlash: boolean;
  /* moduł Zgłoszenia (dodany po migracji – tych pól nie ma w stanie demonstratora referencyjnego) */
  /** Zgłoszenia dodane przez mieszkańca w tej sesji demo (nigdzie nie są wysyłane). */
  submittedReports: Report[];
  /** Zgłoszenie otwarte na ekranie szczegółu. */
  reportId: string | null;
  reportForm: ReportFormState;
  /** Zgłoszenie, przy którym pokazujemy potwierdzenie dodania. */
  reportNoticeId: string | null;
}

/** Pola stanu dodane po migracji – pomijane przy porównaniu ze stanem demonstratora referencyjnego. */
export const ADDED_STATE_KEYS = ["submittedReports", "reportId", "reportForm", "reportNoticeId"] as const;

export function createInitialState(): AppState {
  const unread: Record<string, true> = {};
  INITIAL_UNREAD_IDS.forEach((id) => { unread[id] = true; });
  return {
    screen: "entry", stack: [], detailId: null, stubKey: null,
    loc: INITIAL_LOCALITY, locPriority: true, now: INITIAL_NOW,
    published: [], unread,
    nScope: "current", nQuery: "", nLoc: "mine", nCat: "all", nType: "all", nFilters: false,
    sQuery: "", favs: [...INITIAL_FAVORITE_CATEGORIES], channels: { ...INITIAL_CHANNELS }, favNotify: INITIAL_FAV_NOTIFY, a11y: { ...INITIAL_A11Y },
    rep: { ...REPORT_DRAFT_DEFAULTS },
    sortOpen: null, form: { ...CAMPAIGN_FORM_DEFAULTS }, toast: "", adminFlash: false,
    submittedReports: [], reportId: null, reportForm: { ...REPORT_FORM_DEFAULTS }, reportNoticeId: null,
  };
}

export type Action =
  /* odpowiednik prostego setState – zmiana pojedynczych pól (filtry, pola wyszukiwania itp.) */
  | { type: "patch"; patch: Partial<AppState> }
  /* nawigacja */
  | { type: "go"; screen: ScreenId; patch?: Partial<AppState> }
  | { type: "back" }
  | { type: "tab"; screen: ScreenId }
  | { type: "goTarget"; target: ServiceTarget }
  | { type: "openStub"; key: StubKey }
  | { type: "login" }
  | { type: "logout" }
  /* komunikaty */
  | { type: "openNotifications" }
  | { type: "openCategory"; category: Category }
  | { type: "openMessage"; id: string }
  | { type: "actOnMessage"; id: string }
  | { type: "clearNotificationFilters" }
  /* miejscowość i czas */
  | { type: "selectLocality"; value: Locality | AllLocalitiesValue }
  | { type: "showWholeGmina" }
  | { type: "setNow"; now: string }
  /* Ulubione, Profil */
  | { type: "toggleFavorite"; category: Category }
  | { type: "toggleChannel"; key: ChannelKey }
  | { type: "toggleA11y"; key: A11yKey }
  | { type: "toggleFavNotify" }
  /* Zgłoszenia, Odpady */
  | { type: "patchReport"; patch: Partial<ReportDraft> }
  | { type: "resetReport" }
  | { type: "toggleSortRule"; key: WasteFractionKey }
  | { type: "openReport"; id: string }
  | { type: "openReportForm" }
  | { type: "patchReportForm"; patch: Partial<ReportFormState> }
  | { type: "submitReport" }
  /* panel administratora */
  | { type: "patchForm"; patch: Partial<CampaignForm> }
  | { type: "publish" }
  | { type: "clearToast" }
  | { type: "showAdminHint" }
  | { type: "hideAdminHint" }
  | { type: "reset" };

/* Domyślny widok Powiadomień po wejściu z dzwonka, „Wszystkie” lub kafla. */
const NOTIFS_DEFAULT: Partial<AppState> = { nScope: "current", nCat: "all", nType: "all", nLoc: "mine", nQuery: "" };

function go(s: AppState, screen: ScreenId, patch?: Partial<AppState>): AppState {
  const stack = s.stack.concat([{ screen: s.screen, detailId: s.detailId, stubKey: s.stubKey }]);
  return { ...s, stack, screen, ...(patch || {}) };
}

function markRead(s: AppState, id: string): AppState {
  const unread = { ...s.unread };
  delete unread[id];
  return { ...s, unread };
}

function findMessage(s: AppState, id: string): Message | undefined {
  return s.published.concat(SEED_MESSAGES).find((m) => m.id === id);
}

export function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case "patch":
      return { ...s, ...a.patch };

    case "go":
      return go(s, a.screen, a.patch);
    case "back": {
      if (!s.stack.length) return { ...s, screen: "home" };
      const p = s.stack[s.stack.length - 1];
      return { ...s, stack: s.stack.slice(0, -1), screen: p.screen, detailId: p.detailId, stubKey: p.stubKey };
    }
    case "tab":
      return { ...s, screen: a.screen, stack: [] };
    case "goTarget":
      if (a.target.indexOf("stub:") === 0) return go(s, "stub", { stubKey: a.target.slice(5) as StubKey });
      if (a.target === "notifs") return go(s, "notifs", NOTIFS_DEFAULT);
      return go(s, a.target as ScreenId);
    case "openStub":
      return go(s, "stub", { stubKey: a.key });
    case "login":
      return { ...s, screen: "home", stack: [] };
    case "logout":
      return { ...s, screen: "entry", stack: [] };

    case "openNotifications":
      return go(s, "notifs", NOTIFS_DEFAULT);
    case "openCategory":
      return go(s, "notifs", { nCat: a.category, nScope: "current", nLoc: "mine", nType: "all", nQuery: "", nFilters: false });
    case "openMessage":
      return go(markRead(s, a.id), "detail", { detailId: a.id });
    case "actOnMessage": {
      const m = findMessage(s, a.id);
      if (!m) return s;
      const read = markRead(s, a.id);
      if (m.action === "waste") return go(read, "waste");
      if (m.action === "map") return go(read, "stub", { stubKey: "mapmsg" });
      return go(read, "detail", { detailId: m.id });
    }
    /* „Wyczyść filtry” przełącza też zakres na „Wszystkie” – tak działa demonstrator. */
    case "clearNotificationFilters":
      return { ...s, nLoc: "mine", nCat: "all", nType: "all", nQuery: "", nScope: "all" };

    /* „Cała gmina” zmienia tylko zakres widoku – miejscowość z profilu zostaje. */
    case "selectLocality":
      if (a.value === ALL_LOCALITIES_VALUE) return { ...s, locPriority: false };
      return { ...s, loc: a.value, locPriority: true };
    case "showWholeGmina":
      return { ...s, locPriority: false };
    case "setNow":
      return { ...s, now: a.now };

    case "toggleFavorite": {
      const on = s.favs.indexOf(a.category) >= 0;
      return { ...s, favs: on ? s.favs.filter((x) => x !== a.category) : s.favs.concat([a.category]) };
    }
    case "toggleChannel":
      return { ...s, channels: { ...s.channels, [a.key]: !s.channels[a.key] } };
    case "toggleA11y":
      return { ...s, a11y: { ...s.a11y, [a.key]: !s.a11y[a.key] } };
    case "toggleFavNotify":
      return { ...s, favNotify: !s.favNotify };

    case "patchReport":
      return { ...s, rep: { ...s.rep, ...a.patch } };
    case "resetReport":
      return { ...s, rep: { ...REPORT_DRAFT_DEFAULTS } };
    case "openReport":
      return go(s, "reportDetail", { reportId: a.id, reportNoticeId: s.reportNoticeId === a.id ? a.id : null });
    /* formularz podpowiada miejscowość ustawioną w aplikacji – bez drugiego, niezależnego wyboru */
    case "openReportForm":
      return go(s, "reportForm", { reportForm: { ...REPORT_FORM_DEFAULTS, locality: s.loc } });
    case "patchReportForm":
      return { ...s, reportForm: { ...s.reportForm, ...a.patch } };
    /* Symulacja: zgłoszenie trafia tylko do stanu demo, ze statusem „Nowe” i datą dnia demo. */
    case "submitReport": {
      const f = s.reportForm;
      if (!f.type || !f.locality || !f.desc.trim()) return s;
      const report: Report = {
        id: "moje-" + (s.submittedReports.length + 1), title: f.type, type: f.type, locality: f.locality, place: f.place.trim(),
        status: "new", date: s.now.slice(0, 10), desc: f.desc.trim(), mapX: 50, mapY: 50, mine: true, photo: f.photo,
      };
      /* zamiast formularza pokazujemy szczegół nowego zgłoszenia; „Wróć” prowadzi na listę */
      return { ...s, submittedReports: [report].concat(s.submittedReports), screen: "reportDetail", reportId: report.id, reportNoticeId: report.id, reportForm: { ...REPORT_FORM_DEFAULTS } };
    }
    case "toggleSortRule":
      return { ...s, sortOpen: s.sortOpen === a.key ? null : a.key };

    case "patchForm":
      return { ...s, form: { ...s.form, ...a.patch } };
    /* Publikacja zastępuje poprzednią wersję tej samej kampanii (edycja), nie tworzy kopii. */
    case "publish": {
      const m = formToMessage(s.form, s.now);
      return { ...s, published: [m], unread: { ...s.unread, [m.id]: true }, toast: publishToast(m, s.now), screen: "home", stack: [] };
    }
    case "clearToast":
      return { ...s, toast: "" };
    case "showAdminHint":
      return { ...s, adminFlash: true, toast: ADMIN_HINT_TOAST };
    case "hideAdminHint":
      return { ...s, adminFlash: false };

    case "reset":
      return createInitialState();
  }
}
