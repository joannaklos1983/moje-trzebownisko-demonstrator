import { createInitialState, reducer } from "../../lib/state";
import type { Action, AppState } from "../../lib/state";
import type { Message } from "../../types";

export const T0730 = "2026-10-06T07:30";
export const T1030 = "2026-10-06T10:30";
export const T1500 = "2026-10-06T15:00";

export const WATER = "Przerwa w dostawie wody – Jasionka";

/** Stan po kolejnych akcjach, licząc od stanu początkowego. */
export function run(...actions: Action[]): AppState {
  return actions.reduce(reducer, createInitialState());
}

export function apply(s: AppState, ...actions: Action[]): AppState {
  return actions.reduce(reducer, s);
}

export const titles = (list: Message[]) => list.map((m) => m.title);
export const ids = (list: Message[]) => list.map((m) => m.id);

/** Komunikat testowy – tylko na potrzeby testów, nie trafia do danych demo. */
export function msg(over: Partial<Message> & Pick<Message, "id">): Message {
  return {
    type: "Informacja", cat: "Inne", group: "Wszyscy", title: over.id, place: "", when: "", text: "", todo: "",
    sentAt: "2026-10-06T06:00", od: "2026-10-06T06:00", do: "2026-10-06T20:00", evStart: null, evEnd: null,
    important: true, action: "detail", btn: "Szczegóły", ...over,
  };
}
