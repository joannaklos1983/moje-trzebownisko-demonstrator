"use client";

import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { hasUnreadBell } from "@/lib/messages";
import { useAppActions, useAppState } from "@/lib/store";

/* Nagłówek pulpitu: logo + dzwonek. Dzwonek prowadzi do pełnych Powiadomień. */
export function HomeHeader() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 3, background: "#FFFFFF", borderBottom: "1px solid #E6ECE8", padding: "14px 16px 12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Logo height={48} />
      <button aria-label="Powiadomienia" onClick={() => dispatch({ type: "openNotifications" })} style={{ width: 48, height: 48, border: 0, background: "none", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", color: "#1F2A2E" }}>
        <Icon name="bell" size={28} />
        {hasUnreadBell(state) && <span style={{ position: "absolute", top: 9, right: 9, width: 11, height: 11, borderRadius: "50%", background: "#C62828", border: "2px solid #FFFFFF" }} />}
      </button>
    </div>
  );
}
