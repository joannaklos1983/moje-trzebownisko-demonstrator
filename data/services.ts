import type { ServiceDef, ServiceTone, ServiceVariant, TileStyle, ToneDef } from "../types";

/* Usługa = „co mogę zrobić?”. Zestaw do zmiany tutaj – SERVICES.
   W etykiecie „Powiadomienia” jest miękki łącznik (U+00AD), jak w demonstratorze. */
export const SERVICES: ServiceDef[] = [
  { id: "reports", label: "Zgłoszenia", icon: "report", tone: "green", target: "reports" },
  { id: "notifs", label: "Powiado­mienia", icon: "bell", tone: "blue", target: "notifs", onlyVariantA: true },
  { id: "waste", label: "Odpady", icon: "trash", tone: "lime", target: "waste" },
  { id: "evoting", label: "E-voting", icon: "vote", tone: "sky", target: "stub:evoting" },
  /* DODANE PO MIGRACJI (nie ma w demonstratorze referencyjnym): kafel jest samą grafiką karty
     z napisem „Dostępna wkrótce”. Etykieta, ikona i „DO SPRAWDZENIA” nie są wtedy pokazywane na kaflu
     (zostają w danych; ekran Karty Mieszkańca nadal informuje, że funkcja nie jest potwierdzona). */
  {
    id: "card", label: "Karta Mieszkańca", icon: "idcard", tone: "light", target: "stub:card", badge: "DO SPRAWDZENIA",
    note: "Dostępna wkrótce",
    image: { src: "/assets/karta-mieszkanca.jpg", width: 716, height: 432 },
  },
];

export const TONES: Record<TileStyle, Record<ServiceTone, ToneDef>> = {
  pastelowe: {
    green: { bg: "#E8F3EC", border: "#9CC8AC", iconBg: "#2F824F", iconFg: "#FFFFFF", fg: "#1F2A2E" },
    blue: { bg: "#E3F1F8", border: "#8EC3DD", iconBg: "#137FB0", iconFg: "#FFFFFF", fg: "#1F2A2E" },
    lime: { bg: "#F3F8E3", border: "#C5DD8A", iconBg: "#BADC60", iconFg: "#1F2A2E", fg: "#1F2A2E" },
    sky: { bg: "#DCEEF7", border: "#8EC3DD", iconBg: "#137FB0", iconFg: "#FFFFFF", fg: "#1F2A2E" },
    light: { bg: "#F5F8F4", border: "#CFD8D3", iconBg: "#75A137", iconFg: "#FFFFFF", fg: "#1F2A2E" },
  },
  nasycone: {
    green: { bg: "#2F824F", border: "#2F824F", iconBg: "rgba(255,255,255,.18)", iconFg: "#FFFFFF", fg: "#FFFFFF" },
    blue: { bg: "#137FB0", border: "#137FB0", iconBg: "rgba(255,255,255,.18)", iconFg: "#FFFFFF", fg: "#FFFFFF" },
    /* Zmiana po migracji: tło ikony przyciemnione (było rgba(255,255,255,.2)), żeby biała ikona
       miała kontrast co najmniej 3:1; kolor kafla bez zmian. */
    lime: { bg: "#75A137", border: "#75A137", iconBg: "rgba(31,42,46,.18)", iconFg: "#FFFFFF", fg: "#FFFFFF" },
    sky: { bg: "#0F6F9C", border: "#0F6F9C", iconBg: "rgba(255,255,255,.18)", iconFg: "#FFFFFF", fg: "#FFFFFF" },
    light: { bg: "#BADC60", border: "#BADC60", iconBg: "rgba(255,255,255,.45)", iconFg: "#1F2A2E", fg: "#1F2A2E" },
  },
};

/* Domyślne ustawienia pulpitu (w Claude Design były to właściwości edytora):
   A – Powiadomienia jako kafel, B – bez kafla Powiadomienia. */
export const DEFAULT_SERVICE_VARIANT: ServiceVariant = "A";
/* Zmiana po migracji (5B.1): domyślnie kafle nasycone; demonstrator referencyjny ma pastelowe. */
export const DEFAULT_TILE_STYLE: TileStyle = "nasycone";
