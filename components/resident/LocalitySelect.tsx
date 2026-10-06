"use client";

import { Icon } from "@/components/ui/Icon";
import { ALL_LOCALITIES_LABEL, ALL_LOCALITIES_VALUE, LOCALITIES } from "@/data/localities";
import { localitySelectValue } from "@/lib/messages";
import { useAppActions, useAppState } from "@/lib/store";
import type { AllLocalitiesValue, Locality } from "@/types";

/* „Moja miejscowość” – jeden kontekst lokalizacji dla całej aplikacji (także dla Odpadów). */
export function LocalitySelect() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  return (
    <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name="pin" size={24} style={{ color: "#2F824F" }} />
      <label htmlFor="locsel" style={{ fontSize: 15.5, color: "#3C474C", whiteSpace: "nowrap" }}>Moja miejscowość:</label>
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <select
          id="locsel"
          value={localitySelectValue(state)}
          onChange={(e) => dispatch({ type: "selectLocality", value: e.target.value as Locality | AllLocalitiesValue })}
          style={{ appearance: "none", WebkitAppearance: "none", border: 0, background: "transparent", fontSize: 19, fontWeight: 700, padding: "8px 28px 8px 2px", minHeight: 44, width: "100%" }}
        >
          {LOCALITIES.map((l) => <option key={l} value={l}>{l}</option>)}
          <option value={ALL_LOCALITIES_VALUE}>{ALL_LOCALITIES_LABEL}</option>
        </select>
        <Icon name="chevD" style={{ position: "absolute", right: 4, top: 12, pointerEvents: "none", color: "#3C474C" }} />
      </div>
    </div>
  );
}
