import type { AllLocalitiesValue, AudienceGroup, Locality } from "../types";

/* Miejscowości – w demonstratorze kluczem jest nazwa (VILLAGES). */
export const LOCALITIES: Locality[] = [
  "Jasionka",
  "Łąka",
  "Łukawiec",
  "Nowa Wieś",
  "Stobierna",
  "Tajęcina",
  "Terliczka",
  "Trzebownisko",
  "Wólka Podleśna",
  "Zaczernie",
];

/* „Cała gmina” = zakres widoku mieszkańca: treści ze wszystkich miejscowości + ogólnogminne.
   To nie jest administracyjna grupa odbiorców „Wszyscy”. */
export const ALL_LOCALITIES_VALUE: AllLocalitiesValue = "__all";
export const ALL_LOCALITIES_LABEL = "Cała gmina";

/* Grupa odbiorców dla treści ogólnogminnych. */
export const GROUP_EVERYONE: AudienceGroup = "Wszyscy";

/* Grupy odbiorców w panelu administratora (istniejące Grupy kampanii). */
export const AUDIENCE_GROUPS: AudienceGroup[] = ["Wszyscy", ...LOCALITIES, "Test Gmina"];
