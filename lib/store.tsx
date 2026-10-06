"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type { Dispatch, ReactNode } from "react";
import { createInitialState, reducer } from "./state";
import type { Action, AppState } from "./state";

/* Czas widoczności komunikatu potwierdzenia i podświetlenia panelu – jak w demonstratorze. */
const TOAST_MS = 7000;
const ADMIN_FLASH_MS = 2200;

export interface AppActions {
  dispatch: Dispatch<Action>;
  /** „Wyślij kampanię (demo)”: publikacja + komunikat potwierdzenia znikający po 7 s. */
  publish: () => void;
  /** „Panel administratora (demo)” w Profilu: podświetlenie panelu na 2,2 s. */
  showAdminHint: () => void;
  /** „Resetuj demo”: stan początkowy i wyczyszczone liczniki czasu. */
  reset: () => void;
}

const StateContext = createContext<AppState | null>(null);
const ActionsContext = createContext<AppActions | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(flashTimer.current); }, []);

  const publish = useCallback(() => {
    clearTimeout(toastTimer.current);
    dispatch({ type: "publish" });
    toastTimer.current = setTimeout(() => dispatch({ type: "clearToast" }), TOAST_MS);
  }, []);

  const showAdminHint = useCallback(() => {
    clearTimeout(flashTimer.current);
    dispatch({ type: "showAdminHint" });
    flashTimer.current = setTimeout(() => dispatch({ type: "hideAdminHint" }), ADMIN_FLASH_MS);
  }, []);

  const reset = useCallback(() => {
    clearTimeout(toastTimer.current);
    clearTimeout(flashTimer.current);
    dispatch({ type: "reset" });
  }, []);

  const actions = useMemo<AppActions>(() => ({ dispatch, publish, showAdminHint, reset }), [publish, showAdminHint, reset]);

  return (
    <StateContext.Provider value={state}>
      <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppState {
  const s = useContext(StateContext);
  if (!s) throw new Error("useAppState: brak AppStoreProvider");
  return s;
}

export function useAppActions(): AppActions {
  const a = useContext(ActionsContext);
  if (!a) throw new Error("useAppActions: brak AppStoreProvider");
  return a;
}
