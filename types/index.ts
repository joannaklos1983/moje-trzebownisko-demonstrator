import type { IconName } from "../data/icons";

export type { IconName };

/* ---------- miejscowości i grupy odbiorców ---------- */

export type Locality =
  | "Jasionka"
  | "Łąka"
  | "Łukawiec"
  | "Nowa Wieś"
  | "Stobierna"
  | "Tajęcina"
  | "Terliczka"
  | "Trzebownisko"
  | "Wólka Podleśna"
  | "Zaczernie";

/** Wartość selektora „Cała gmina” – zakres widoku mieszkańca, nie grupa odbiorców. */
export type AllLocalitiesValue = "__all";

/** Istniejące Grupy kampanii z panelu: „Wszyscy”, grupy miejscowości i grupa testowa. */
export type AudienceGroup = "Wszyscy" | Locality | "Test Gmina";

/* ---------- kategorie, typy, statusy ---------- */

export type Category =
  | "Woda i awarie"
  | "Odpady"
  | "Drogi, transport i inwestycje"
  | "Wydarzenia i kultura"
  | "Sport i OSiR"
  | "Zdrowie"
  | "Edukacja"
  | "Urząd / dla mieszkańca"
  | "Pogoda i jakość powietrza"
  | "Inne";

export type MessageTypeId = "Informacja" | "Ostrzeżenie" | "Alert";

export interface MessageTypeDef {
  label: string;
  icon: IconName;
  pillBg: string;
  pillFg: string;
  bigBg: string;
  bigBorder: string;
  circleBg: string;
  circleFg: string;
  cardBg: string;
  cardBorder: string;
  /** Kolejność ważności: 0 = Alert RCB, 1 = Ostrzeżenie, 2 = Informacja. */
  rank: number;
  /** Opis typu w panelu administratora. */
  d: string;
}

export type StatusId = "live" | "current" | "ended";

export interface StatusDef {
  label: string;
  bg: string;
  fg: string;
}

/* ---------- komunikaty i kampania ---------- */

export type MessageAction = "detail" | "waste" | "map";

/** Jeden rekord kampanii zasila „Ważne teraz”, Powiadomienia, wyszukiwarkę i historię. */
export interface Message {
  id: string;
  type: MessageTypeId;
  cat: Category;
  group: AudienceGroup;
  title: string;
  place: string;
  when: string;
  text: string;
  todo: string;
  /** Daty w formacie lokalnym „RRRR-MM-DDTGG:MM”. */
  sentAt: string;
  od: string;
  do: string;
  evStart: string | null;
  evEnd: string | null;
  /** „Pokaż w Ważne teraz”. */
  important: boolean;
  action: MessageAction;
  btn: string;
  link?: string;
  /** Potwierdzony adres oficjalnej strony (Gmina, OSiR, GCK, Centrum Oświaty). Brak = nie pokazujemy linku. */
  officialUrl?: string;
  /** Podpis przycisku linku, np. „Sprawdź na stronie OSiR”. */
  officialUrlLabel?: string;
  fromAdmin?: boolean;
}

export type SendMode = "now" | "sched";

export type ChannelKey = "push" | "email" | "sms";

export interface CampaignForm {
  name: string;
  type: MessageTypeId;
  cat: Category;
  group: AudienceGroup;
  title: string;
  sendMode: SendMode;
  sendAt: string;
  od: string;
  do: string;
  important: boolean;
  text: string;
  link: string;
  btn: string;
  sms: boolean;
  push: boolean;
  email: boolean;
}

/* ---------- ekrany i nawigacja ---------- */

export type ScreenId =
  | "entry"
  | "home"
  | "notifs"
  | "detail"
  | "reports"
  | "waste"
  | "search"
  | "calendar"
  | "fav"
  | "profile"
  | "reportDetail"
  | "reportForm"
  | "partner"
  | "stub";

export type StubKey =
  | "evoting"
  | "card"
  | "contact"
  | "transport"
  | "map"
  | "mapmsg"
  | "calendar"
  | "register"
  | "about";

export type TabId = "home" | "search" | "calendar" | "fav" | "profile";

export interface NavTab {
  id: TabId;
  label: string;
  icon: IconName;
}

export interface StubItem {
  icon: IconName;
  t: string;
  d: string;
}

export interface StubDef {
  title: string;
  icon: IconName;
  badge: string;
  tagClass: "tag" | "tagn";
  text: string;
  loginCta?: boolean;
  items?: StubItem[];
}

export type QuickLinkTarget = { stub: StubKey } | { url: string };

export interface QuickLink {
  label: string;
  icon: IconName;
  end: IconName;
  target: QuickLinkTarget;
}

/* ---------- usługi ---------- */

export type ServiceTone = "green" | "blue" | "lime" | "sky" | "light";

export type TileStyle = "pastelowe" | "nasycone";

export type ServiceVariant = "A" | "B";

export type ServiceTarget = ScreenId | `stub:${StubKey}`;

export interface ServiceDef {
  id: string;
  label: string;
  icon: IconName;
  tone: ServiceTone;
  target: ServiceTarget;
  onlyVariantA?: boolean;
  badge?: string;
  /** Krótka informacja o dostępności, np. „Dostępna wkrótce”. */
  note?: string;
  /** Gdy podana, kafel jest samą grafiką (z naniesioną informacją `note`). */
  image?: ServiceImage;
}

export interface ServiceImage {
  src: string;
  width: number;
  height: number;
}

export interface ToneDef {
  bg: string;
  border: string;
  iconBg: string;
  iconFg: string;
  fg: string;
}

/* ---------- odpady ---------- */

export type WasteFractionKey = "zm" | "mt" | "pa" | "sz" | "bio";

export interface WasteFraction {
  l: string;
  c: string;
}

export interface WasteSortRule {
  k: WasteFractionKey;
  l: string;
  c: string;
  yes: string;
  no: string;
}

/* ---------- zgłoszenia ---------- */

export type ReportLocationMode = "current" | "pick";

export interface ReportDraft {
  type: string;
  date: string;
  desc: string;
  file: boolean;
  mode: ReportLocationMode;
  sent: boolean;
}

/* ---------- wyszukiwarka ---------- */

export type SearchTarget = { screen: ScreenId } | { stub: StubKey };

/** Źródło treści w wyszukiwarce (moduł, z którego pochodzi wynik). */
export type SearchSource = "Powiadomienia" | "Odpady" | "Zgłoszenia" | "Usługi";

/** Filtr wyników: wszystko albo jedno źródło. Jedna wyszukiwarka, nie osobne dla modułów. */
export type SearchFilter = "all" | "Powiadomienia" | "Odpady" | "Zgłoszenia";

export interface SearchStaticEntry {
  title: string;
  /** Moduł, do którego należy pozycja. */
  source: SearchSource;
  /** Krótki opis pokazywany w wyniku. */
  snippet: string;
  meta: string;
  /** Dopisuje do opisu „ · <moja miejscowość>”. */
  metaWithLocality?: boolean;
  icon: IconName;
  /** Słowa kluczowe (przed normalizacją). */
  keywords: string;
  /** 0 = moja miejscowość, 1 = cała gmina. */
  local: number;
  target: SearchTarget;
}

/* ---------- profil ---------- */

export type A11yKey = "big" | "motion";

export interface ToggleDef<K extends string> {
  key: K;
  label: string;
  icon: IconName;
}

/* ---------- panel administratora ---------- */

export interface AdminSideItem {
  label: string;
  icon: IconName | null;
  /** 0 = pozycja główna, 1 = podpozycja, 2 = podpozycja aktywna. */
  level: 0 | 1 | 2;
}

export interface AdminChannelDef {
  key: ChannelKey;
  label: string;
}

/* ---------- demo ---------- */

export interface DemoTime {
  value: string;
  label: string;
}

/* ---------- moduł Zgłoszenia (start-redesign) ---------- */

export type ReportStatus = "new" | "inProgress" | "done";

/** Jeden rekord zgłoszenia zasila listę, mapę poglądową i szczegół. */
export interface Report {
  id: string;
  title: string;
  /** Rodzaj zgłoszenia z listy REPORT_TYPES. */
  type: string;
  locality: Locality;
  /** Opis miejsca. */
  place: string;
  status: ReportStatus;
  /** Data zgłoszenia „RRRR-MM-DD”. */
  date: string;
  desc: string;
  /** Położenie na mapie poglądowej w procentach szerokości / wysokości – nie współrzędne geograficzne. */
  mapX: number;
  mapY: number;
  /** Zgłoszenie dodane przez mieszkańca w tej sesji demo. */
  mine?: boolean;
  /** Mieszkaniec dołączył zdjęcie (symulacja – plik nie jest przesyłany). */
  photo?: boolean;
}

export interface ReportFormState {
  type: string;
  locality: Locality | "";
  place: string;
  desc: string;
  photo: boolean;
}
