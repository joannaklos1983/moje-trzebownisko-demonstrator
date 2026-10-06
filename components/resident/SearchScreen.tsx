"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import { SEARCH_FILTERS, SEARCH_SUGGESTIONS } from "@/data/search";
import { searchView } from "@/lib/search";
import type { SearchResult } from "@/lib/search";
import { useAppActions, useAppState } from "@/lib/store";
import type { SearchFilter } from "@/types";

/* Szukaj: jedna wyszukiwarka dla treści mieszkańca (komunikaty, usługi, szybki dostęp).
   Filtry tylko zawężają te same wyniki – nie ma osobnych wyszukiwarek dla modułów.
   DO SPRAWDZENIA (oznaczenie projektowe, celowo niewidoczne dla mieszkańca): globalna wyszukiwarka
   i zakres indeksowanych modułów nie są potwierdzone w obecnym systemie. */
export function SearchScreen() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const [filter, setFilter] = useState<SearchFilter>("all");
  const sr = searchView(state, filter);

  const open = (r: SearchResult) => {
    if ("messageId" in r.target) dispatch({ type: "openMessage", id: r.target.messageId });
    else if ("stub" in r.target) dispatch({ type: "openStub", key: r.target.stub });
    else dispatch({ type: "go", screen: r.target.screen });
  };

  return (
    <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ position: "relative" }}>
        <label htmlFor="sq" style={visuallyHidden}>Szukaj informacji, usług i miejsc</label>
        <Icon name="search" size={22} style={{ position: "absolute", left: 16, top: 17 }} />
        <input id="sq" className="inp" style={{ paddingLeft: 50, minHeight: 56, fontSize: 16, borderRadius: 16, background: "#F5F8F4" }} placeholder="Szukaj informacji, usług i miejsc" value={state.sQuery} onChange={(e) => dispatch({ type: "patch", patch: { sQuery: e.target.value } })} />
      </div>

      <div data-context style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#3C474C" }}>
        <Icon name="pin" size={17} style={{ color: "#2F824F" }} />
        <span style={{ flex: 1, minWidth: 0 }}>{sr.contextLabel}</span>
      </div>

      <div role="group" aria-label="Filtr wyników" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {SEARCH_FILTERS.map((f) => {
          const on = filter === f.value;
          return (
            <button key={f.value} className="chip" aria-pressed={on} onClick={() => setFilter(f.value)} style={{ border: `1.5px solid ${on ? "#2F824F" : "#CFD8D3"}`, background: on ? "#2F824F" : "#FFFFFF", color: on ? "#FFFFFF" : "#1F2A2E", minHeight: 44, padding: "8px 14px", fontSize: 14 }}>{f.label}</button>
          );
        })}
      </div>

      {!sr.hasQuery && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Popularne wyszukiwania</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SEARCH_SUGGESTIONS.map((x) => (
              <button key={x} className="chip" onClick={() => dispatch({ type: "patch", patch: { sQuery: x } })} style={{ border: "1.5px solid #CFD8D3", background: "#FFFFFF", minHeight: 44, padding: "7px 14px" }}>{x}</button>
            ))}
          </div>
        </div>
      )}

      {sr.hasQuery && !sr.none && (
        <>
          <div style={{ fontSize: 13.5, color: "#5A6670" }}>Wyniki: {sr.count}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sr.results.map((r, i) => (
              /* karta: co (typ, kategoria, status, tytuł) → gdzie → kiedy → treść → działanie */
              <button key={i} className="plain" data-result onClick={() => open(r)} style={{ border: "1px solid #DFE6E2", borderLeft: "4px solid #2F824F", borderRadius: 14, padding: "14px 16px 6px", background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px 8px", flexWrap: "wrap" }}>
                  <span data-kind style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#1F6B3D", background: "#E6F2EA", borderRadius: 999, padding: "4px 10px", lineHeight: 1.2 }}><Icon name={r.icon} size={14} />{r.kind}</span>
                  {r.category && <span data-category style={{ fontSize: 13, color: "#4E5A63", fontWeight: 500 }}>{r.category}</span>}
                  {r.statusLabel && <span className="st" data-status style={{ marginLeft: "auto", background: r.statusBg, color: r.statusFg }}>{r.statusLabel}</span>}
                </span>
                <span data-title style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: "#1F2A2E" }}>{r.title}</span>
                {(r.locality || r.when) && (
                  <span style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14.5, color: "#1F2A2E" }}>
                    {r.locality && <span data-locality style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}><Icon name="pin" size={17} style={{ color: "#5A6670" }} />{r.locality}</span>}
                    {r.when && <span data-when style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="clock" size={17} style={{ color: "#5A6670" }} />{r.when}</span>}
                  </span>
                )}
                {r.snippet && <span data-snippet style={{ fontSize: 14.5, color: "#3C474C", lineHeight: 1.45 }}>{r.snippet}</span>}
                <span style={{ borderTop: "1px solid #E6ECE8", marginTop: 2, minHeight: 44, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700, color: "#2F824F" }}>Szczegóły<Icon name="arrowR" size={18} /></span>
              </button>
            ))}
          </div>
        </>
      )}

      {sr.none && (
        <div role="status" style={{ border: "1.5px dashed #CFD8D3", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>Nie znaleziono wyników. Spróbuj innego hasła.</p>
        </div>
      )}
    </div>
  );
}
