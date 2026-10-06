import type { MessageTypeDef, MessageTypeId, StatusDef, StatusId } from "../types";

/* Typ komunikatu (jak pilny) – osobne pojęcie niż kategoria (czego dotyczy).
   Alert jest zarezerwowany dla właściwych komunikatów RCB / najwyższego stopnia. */
export const MESSAGE_TYPES: Record<MessageTypeId, MessageTypeDef> = {
  "Informacja": {
    label: "Informacja", icon: "info", pillBg: "#E6F2EA", pillFg: "#1F6B3D", bigBg: "#F3F9F5", bigBorder: "#BFDCC9",
    circleBg: "#E6F2EA", circleFg: "#2F824F", cardBg: "#FFFFFF", cardBorder: "#DFE6E2", rank: 2,
    d: "Podstawowy, najczęstszy typ: bieżące sprawy, terminy, utrudnienia.",
  },
  "Ostrzeżenie": {
    label: "Ostrzeżenie", icon: "alertc", pillBg: "#FFEFC9", pillFg: "#6E4300", bigBg: "#FFF8EA", bigBorder: "#E5C27A",
    circleBg: "#FFEFC9", circleFg: "#8A5300", cardBg: "#FFFCF5", cardBorder: "#E5C27A", rank: 1,
    d: "Rzadziej: pogoda, smog, inne czasowe zagrożenia.",
  },
  "Alert": {
    label: "Alert RCB", icon: "warn", pillBg: "#B3261E", pillFg: "#FFFFFF", bigBg: "#FDF1F0", bigBorder: "#E8A39D",
    circleBg: "#FBE3E1", circleFg: "#B3261E", cardBg: "#FFF7F6", cardBorder: "#E8A39D", rank: 0,
    d: "Wyłącznie komunikaty RCB / najwyższego stopnia.",
  },
};

/* Wygląd karty „Ważne teraz” (zmiana po migracji): zieleń Gminy oznacza ekspozycję na pulpicie,
   niezależnie od typu Informacja / Ostrzeżenie – typ jest podany tekstem i ikoną na etykiecie.
   Wyjątek: Alert RCB zachowuje czerwone kolory typu. */
export const IMPORTANT_HIGHLIGHT = {
  border: "#2F824F",
  bg: "#EEF7F0",
  pillBg: "#DDEFE3",
  pillFg: "#1F6B3D",
  circleBg: "#DDEFE3",
  circleFg: "#2F824F",
} as const;

/* Kolejność typów w panelu administratora. */
export const MESSAGE_TYPE_ORDER: MessageTypeId[] = ["Informacja", "Ostrzeżenie", "Alert"];

/* Status zawsze ma tekst, nie tylko kolor. */
export const STATUSES: Record<StatusId, StatusDef> = {
  live: { label: "● TRWA", bg: "#2F824F", fg: "#FFFFFF" },
  current: { label: "● AKTUALNE", bg: "#E3F1F8", fg: "#0B5A80" },
  ended: { label: "✓ ZAKOŃCZONE", bg: "#EEF0EF", fg: "#4E5A63" },
};
