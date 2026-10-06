import type { AdminChannelDef, AdminSideItem } from "../types";

/* Menu boczne panelu – odwzorowanie obecnego panelu administratora. */
export const ADMIN_SIDE_MENU: AdminSideItem[] = [
  { label: "Dashboard", icon: "dash", level: 0 },
  { label: "Zgłoszenia", icon: "report", level: 0 },
  { label: "Powiadomienia", icon: "bell", level: 0 },
  { label: "Dashboard", icon: null, level: 1 },
  { label: "Grupy kampanii", icon: null, level: 1 },
  { label: "Kampanie", icon: null, level: 2 },
  { label: "E-voting", icon: "vote", level: 0 },
  { label: "Odpady", icon: "trash", level: 0 },
  { label: "Ankiety", icon: "clip", level: 0 },
  { label: "Weryfikacja karty", icon: "idcard", level: 0 },
  { label: "Ustawienia", icon: "gear", level: 0 },
];

/* Kanały kampanii – w demo wyłącznie symulowane (push i e-mail: DO SPRAWDZENIA). */
export const ADMIN_CHANNELS: AdminChannelDef[] = [
  { key: "sms", label: "Kampania SMS" },
  { key: "push", label: "Push" },
  { key: "email", label: "E-mail" },
];

/* Nazwa przycisku w aplikacji (sekcja „Szczegóły / działanie”). */
export const ACTION_BUTTON_LABELS: string[] = ["Szczegóły", "Sprawdź", "Zobacz", "Pokaż na mapie", "Sprawdź harmonogram"];
