"use client";

import { Icon } from "@/components/ui/Icon";
import { NAV_TABS } from "@/data/navigation";
import { useAppActions, useAppState } from "@/lib/store";

/* Stała dolna nawigacja. Start zawsze prowadzi na pulpit. */
export function BottomNav() {
  const { screen } = useAppState();
  const { dispatch } = useAppActions();
  const isTab = screen === "search" || screen === "fav" || screen === "profile";
  const current = isTab ? screen : "home";
  return (
    <nav aria-label="Nawigacja główna" style={{ flex: "none", display: "flex", borderTop: "1px solid #E6ECE8", background: "#FFFFFF", padding: "4px 6px 10px" }}>
      {NAV_TABS.map((t) => (
        <button key={t.id} className="navb" aria-current={current === t.id ? "page" : "false"} onClick={() => dispatch({ type: "tab", screen: t.id })}>
          <span className="navi"><Icon name={t.icon} size={24} /></span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
