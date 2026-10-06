"use client";

import { NotificationCard } from "@/components/resident/NotificationCard";
import { Icon } from "@/components/ui/Icon";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import { decorateMessage } from "@/lib/messages";
import { FILTER_RESET, notificationsView } from "@/lib/notifications";
import type { Option } from "@/lib/notifications";
import type { AppState } from "@/lib/state";
import { useAppActions, useAppState } from "@/lib/store";

function FilterSelect({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: Option[]; onChange: (v: string) => void }) {
  return (
    <>
      <label className="lbl" htmlFor={id}>{label}</label>
      <div style={{ position: "relative" }}>
        <select id={id} className="sel" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        <Icon name="chevD" style={{ position: "absolute", right: 12, top: 14, pointerEvents: "none" }} />
      </div>
    </>
  );
}

/* Powiadomienia: pełne centrum komunikatów. Domyślnie „Aktualne dla Ciebie”. */
export function NotificationsScreen() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const n = notificationsView(state);
  const patch = (p: Partial<AppState>) => dispatch({ type: "patch", patch: p });

  return (
    <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{n.heading}</h2>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: "#5A6670" }}>{n.sub}</p>
      </div>

      <div role="group" aria-label="Zakres" style={{ display: "flex", gap: 4, background: "#EEF2EF", borderRadius: 12, padding: 4 }}>
        <button className="seg" aria-pressed={state.nScope === "current"} onClick={() => patch({ nScope: "current" })}>Aktualne</button>
        <button className="seg" aria-pressed={state.nScope === "all"} onClick={() => patch({ nScope: "all" })}>Wszystkie</button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <label htmlFor="nq" style={visuallyHidden}>Szukaj w powiadomieniach</label>
          <Icon name="search" style={{ position: "absolute", left: 14, top: 14, color: "#5A6670" }} />
          <input id="nq" className="inp" style={{ paddingLeft: 44 }} placeholder="Szukaj w powiadomieniach…" value={state.nQuery} onChange={(e) => patch({ nQuery: e.target.value })} />
        </div>
        <button aria-label="Filtry" aria-expanded={state.nFilters} onClick={() => patch({ nFilters: !state.nFilters })} style={{ width: 52, height: 48, border: `1.5px solid ${state.nFilters ? "#2F824F" : "#CFD8D3"}`, background: state.nFilters ? "#EEF6F1" : "#FFFFFF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flex: "none" }}>
          <Icon name="sliders" />
          {n.chips.length > 0 && <span style={{ position: "absolute", top: -6, right: -6, minWidth: 20, height: 20, borderRadius: 10, background: "#2F824F", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{n.chips.length}</span>}
        </button>
      </div>

      {state.nFilters && (
        <div style={{ border: "1.5px solid #DFE6E2", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 12, background: "#F9FBF9" }}>
          <p style={{ margin: 0, fontSize: 12.5, color: "#3C474C", lineHeight: 1.45 }}><span className="tag">DO SPRAWDZENIA</span> Filtry miejscowości i kategorii – audyt potwierdził obecnie filtry daty i typu.</p>
          <div>
            <FilterSelect id="nf-loc" label="Miejscowość" value={state.nLoc} options={n.locOptions} onChange={(v) => patch({ nLoc: v as AppState["nLoc"] })} />
          </div>
          <div>
            <FilterSelect id="nf-cat" label="Kategoria" value={state.nCat} options={n.catOptions} onChange={(v) => patch({ nCat: v as AppState["nCat"] })} />
          </div>
          <div>
            <FilterSelect id="nf-typ" label="Typ komunikatu" value={state.nType} options={n.typeOptions} onChange={(v) => patch({ nType: v as AppState["nType"] })} />
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#5A6670", lineHeight: 1.4 }}>Alert stosujemy wyłącznie dla komunikatów RCB.</p>
          </div>
          <button className="lnk" style={{ alignSelf: "flex-start" }} onClick={() => dispatch({ type: "clearNotificationFilters" })}>Wyczyść filtry</button>
        </div>
      )}

      {n.chips.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {n.chips.map((ch) => (
            <button key={ch.key} onClick={() => patch({ [ch.key]: FILTER_RESET[ch.key] })} aria-label={`Usuń filtr ${ch.label}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #9CC8AC", background: "#EEF6F1", borderRadius: 999, padding: "6px 10px 6px 12px", fontSize: 13.5, fontWeight: 600, minHeight: 36 }}>{ch.label}<Icon name="x" size={15} /></button>
          ))}
        </div>
      )}

      {n.items.map((m) => <NotificationCard key={m.id} m={decorateMessage(state, m)} />)}

      {n.empty && (
        <div style={{ border: "1.5px dashed #CFD8D3", borderRadius: 16, padding: 20, textAlign: "center", display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>{n.emptyText}</p>
          <button className="lnk" onClick={() => dispatch({ type: "clearNotificationFilters" })}>Pokaż wszystkie powiadomienia</button>
        </div>
      )}

      <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#3C474C", lineHeight: 1.45 }}><span className="tag">DO SPRAWDZENIA</span> Stan przeczytane / nieprzeczytane (kropka na karcie i przy dzwonku).</p>
    </div>
  );
}
