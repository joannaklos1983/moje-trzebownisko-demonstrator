"use client";

import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import { ALL_LOCALITIES_LABEL, ALL_LOCALITIES_VALUE, LOCALITIES } from "@/data/localities";
import { hasUnreadBell, localitySelectValue, scopeLabel } from "@/lib/messages";
import { useAppActions, useAppState } from "@/lib/store";
import type { AllLocalitiesValue, Locality } from "@/types";

/* Nagłówek Startu: logo, wybór miejscowości (jeden kontekst lokalizacji dla całej aplikacji), dzwonek.
   Widoczna jest nazwa wybranej miejscowości; prawdziwe pole wyboru leży niewidoczne na całej pastylce,
   dzięki czemu pastylka ma dokładnie szerokość nazwy, a obsługa (dotyk, klawiatura) jest natywna.
   Gdy brakuje miejsca, najpierw zmniejsza się logo (do 96 px); nazwa skraca się dopiero potem
   (pastylka nie kurczy się sama – ma tylko górny limit szerokości: wiersz minus logo, dzwonek i odstępy). */
export function StartHeader() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 3, background: "#FFFFFF", borderBottom: "1px solid #E6ECE8", padding: "10px 10px 10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: "0 1 138px", minWidth: 96 }}><Logo height={40} fluid /></div>
      <div className="loc-wrap" style={{ marginLeft: "auto", position: "relative", display: "flex", alignItems: "center", gap: 6, border: "1.5px solid #DFE6E2", borderRadius: 999, padding: "0 10px 0 12px", minHeight: 44, flex: "0 0 auto", maxWidth: "calc(100% - 156px)", minWidth: 0, background: "#FFFFFF" }}>
        <Icon name="pin" size={18} style={{ color: "#2F824F" }} />
        <span data-loc-label aria-hidden="true" style={{ fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{scopeLabel(state)}</span>
        <Icon name="chevD" size={18} style={{ color: "#3C474C" }} />
        <label htmlFor="locsel" style={visuallyHidden}>Moja miejscowość</label>
        <select
          id="locsel"
          className="loc-select"
          value={localitySelectValue(state)}
          onChange={(e) => dispatch({ type: "selectLocality", value: e.target.value as Locality | AllLocalitiesValue })}
        >
          {LOCALITIES.map((l) => <option key={l} value={l}>{l}</option>)}
          <option value={ALL_LOCALITIES_VALUE}>{ALL_LOCALITIES_LABEL}</option>
        </select>
      </div>
      <button aria-label="Powiadomienia" onClick={() => dispatch({ type: "openNotifications" })} style={{ width: 44, height: 44, border: 0, background: "none", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", color: "#1F2A2E", flex: "none" }}>
        <Icon name="bell" size={26} />
        {hasUnreadBell(state) && <span style={{ position: "absolute", top: 8, right: 8, width: 11, height: 11, borderRadius: "50%", background: "#C62828", border: "2px solid #FFFFFF" }} />}
      </button>
    </div>
  );
}
