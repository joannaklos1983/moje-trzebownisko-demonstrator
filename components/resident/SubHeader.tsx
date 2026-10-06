"use client";

import { Icon } from "@/components/ui/Icon";
import { SCREEN_TITLES, STUBS } from "@/data/navigation";
import { hasUnreadBell } from "@/lib/messages";
import { useAppActions, useAppState } from "@/lib/store";

/* Nagłówek podstron: „Wróć” (poza zakładkami dolnej nawigacji), tytuł, opcjonalnie dzwonek. */
export function SubHeader() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const { screen, stubKey } = state;
  const isTab = screen === "search" || screen === "fav" || screen === "profile";
  const showBell = isTab || screen === "waste" || screen === "reports";
  const title = screen === "stub" ? STUBS[stubKey || "about"].title : SCREEN_TITLES[screen] || "";

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 3, background: "#FFFFFF", borderBottom: "1px solid #E6ECE8", padding: "12px 12px 12px 8px", display: "flex", alignItems: "center", gap: 4, minHeight: 72 }}>
      {isTab ? (
        <span style={{ width: 12 }} />
      ) : (
        <button aria-label="Wróć" onClick={() => dispatch({ type: "back" })} style={{ width: 48, height: 48, border: 0, background: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#1F2A2E" }}><Icon name="arrowL" size={24} /></button>
      )}
      <h1 style={{ margin: 0, fontSize: 21, fontWeight: 700, flex: 1 }}>{title}</h1>
      {showBell && (
        <button aria-label="Powiadomienia" onClick={() => dispatch({ type: "openNotifications" })} style={{ width: 48, height: 48, border: 0, background: "none", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="bell" size={26} />
          {hasUnreadBell(state) && <span style={{ position: "absolute", top: 10, right: 10, width: 10, height: 10, borderRadius: "50%", background: "#C62828", border: "2px solid #FFFFFF" }} />}
        </button>
      )}
    </div>
  );
}
