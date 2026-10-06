import { ADMIN_MESSAGE_ID } from "../data/campaignDefaults";
import { MESSAGE_TYPES } from "../data/messageTypes";
import type { CampaignForm, Message } from "../types";
import { formatDateTime, ts, whenLabel } from "./time";

/* Jedna kampania = jedno źródło informacji: ten sam rekord zasila „Ważne teraz”,
   Powiadomienia, wyszukiwarkę i historię. */

/** Formularz kampanii → komunikat po stronie mieszkańca. Lokalizację wyznacza Grupa odbiorców. */
export function formToMessage(form: CampaignForm, now: string): Message {
  return {
    id: ADMIN_MESSAGE_ID, type: form.type, cat: form.cat, group: form.group, title: form.title,
    place: form.group === "Wszyscy" ? "Cała gmina" : form.group, when: whenLabel(form.od, form.do),
    text: form.text, todo: "", sentAt: form.sendMode === "now" ? now : form.sendAt, od: form.od, do: form.do,
    evStart: form.od, evEnd: form.do, important: form.important,
    action: "detail", btn: form.btn, link: form.link, fromAdmin: true,
  };
}

/** Komunikat potwierdzenia po „Wyślij kampanię (demo)”. */
export function publishToast(m: Message, now: string): string {
  const n = ts(now);
  if (ts(m.sentAt) > n) return "Kampania zaplanowana na " + formatDateTime(m.sentAt) + ". Zmień godzinę w demo, aby zobaczyć ją u mieszkańca.";
  if (n > ts(m.do)) return "Kampania zapisana. Termin „Ważne do” minął – komunikat jest w historii jako ZAKOŃCZONE.";
  if (m.important && n >= ts(m.od)) return "Kampania wysłana. Mieszkańcy z grupy " + m.group + " widzą ją w „Ważne teraz”.";
  if (m.important) return "Kampania wysłana do Powiadomień. W „Ważne teraz” pojawi się od " + formatDateTime(m.od) + ".";
  return "Kampania wysłana. Widoczna w Powiadomieniach (bez wyróżnienia w „Ważne teraz”).";
}

export const ADMIN_HINT_TOAST = "Panel administratora jest obok aplikacji – po prawej.";

export interface SummaryRow {
  k: string;
  v: string;
}

/** Sekcja „Podsumowanie” formularza. */
export function campaignSummary(f: CampaignForm): SummaryRow[] {
  return [
    { k: "Typ", v: MESSAGE_TYPES[f.type].label },
    { k: "Kategoria", v: f.cat },
    { k: "Grupa odbiorców", v: f.group },
    { k: "Wysyłka", v: f.sendMode === "now" ? "Natychmiast" : "Zaplanowana: " + formatDateTime(f.sendAt) },
    { k: "Ważne", v: formatDateTime(f.od) + " – " + formatDateTime(f.do) },
    { k: "„Ważne teraz”", v: f.important ? "Tak – " + formatDateTime(f.od) + " do " + formatDateTime(f.do) : "Nie" },
    { k: "Kanały", v: ["Web"].concat(f.push ? ["Push"] : []).concat(f.email ? ["E-mail"] : []).concat(f.sms ? ["SMS"] : []).join(", ") },
  ];
}

/** Notatka pod podglądem w aplikacji. */
export function visibilityNote(f: CampaignForm): string {
  return f.important
    ? "Widoczny w „Ważne teraz” od " + formatDateTime(f.od) + " do " + formatDateTime(f.do) + ". Potem znika z tej sekcji i zostaje w historii Powiadomień."
    : "Nie pojawi się w „Ważne teraz” – tylko w Powiadomieniach.";
}

/** Po pierwszej publikacji panel przechodzi w tryb edycji tej samej kampanii. */
export function campaignLabels(hasPublished: boolean): { heading: string; publishLabel: string } {
  return {
    heading: hasPublished ? "Edycja kampanii" : "Dodaj kampanię",
    publishLabel: hasPublished ? "Zapisz zmiany (demo)" : "Wyślij kampanię (demo)",
  };
}
