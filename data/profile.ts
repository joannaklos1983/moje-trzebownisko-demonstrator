import type { A11yKey, ChannelKey, ToggleDef } from "../types";

/* Kanały powiadomień w Profilu – w demo wyłącznie symulowane przełączniki. */
export const PROFILE_CHANNELS: ToggleDef<ChannelKey>[] = [
  { key: "push", label: "Powiadomienia push", icon: "bell" },
  { key: "email", label: "E-mail", icon: "mail" },
  { key: "sms", label: "SMS", icon: "sms" },
];

/* Ustawienia dostępności (DO SPRAWDZENIA) – w demo nie zmieniają widoku. */
export const PROFILE_A11Y: ToggleDef<A11yKey>[] = [
  { key: "big", label: "Większy tekst", icon: "type" },
  { key: "motion", label: "Ograniczenie animacji", icon: "eye" },
];
