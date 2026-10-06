import type { CampaignForm } from "../types";

/* Domyślnie wypełniona kampania „Przerwa w dostawie wody – Jasionka” – 1:1 z demonstratora (FORM0). */
export const CAMPAIGN_FORM_DEFAULTS: CampaignForm = {
  name: "Przerwa w dostawie wody – Jasionka 6.10", type: "Informacja", cat: "Woda i awarie", group: "Jasionka", title: "Przerwa w dostawie wody – Jasionka",
  sendMode: "sched", sendAt: "2026-10-06T07:00", od: "2026-10-06T08:00", do: "2026-10-06T14:00", important: true,
  text: "W godz. 8:00–14:00 nastąpi przerwa w dostawie wody.", link: "https://trzebownisko.pl/[adres-komunikatu]", btn: "Szczegóły", sms: false, push: false, email: false,
};

/* Stały identyfikator komunikatu publikowanego z panelu (jedna kampania w demo). */
export const ADMIN_MESSAGE_ID = "admin-1";
