"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CATEGORY_ICON } from "@/data/categories";
import { SEARCH_FILTERS, SEARCH_SUGGESTIONS } from "@/data/search";
import { SEARCH_RESULTS_MIN_LENGTH, searchSuggestions, searchView } from "@/lib/search";
import type { SearchResult } from "@/lib/search";
import { useAppActions, useAppState } from "@/lib/store";
import type { IconName, SearchFilter } from "@/types";

function SuggestionRow({ icon, label, hint, onClick }: { icon: IconName; label: string; hint?: string; onClick: () => void }) {
  return (
    <button className="row" data-suggestion onClick={onClick} style={{ borderTop: "1px solid #E6ECE8", padding: "8px 14px", minHeight: 52 }}>
      <Icon name={icon} size={20} style={{ color: "#2F824F" }} />
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.3, color: "#1F2A2E" }}>{label}</span>
        {hint && <span style={{ fontSize: 13, color: "#5A6670" }}>{hint}</span>}
      </span>
    </button>
  );
}

/* Szukaj: jedna wyszukiwarka dla treści mieszkańca (komunikaty, usługi, szybki dostęp).
   Przed wpisaniem – popularne wyszukiwania; przy krótkim haśle – podpowiedzi; dalej – wyniki.
   Filtry tylko zawężają te same wyniki – nie ma osobnych wyszukiwarek dla modułów.
   DO SPRAWDZENIA (oznaczenie projektowe, celowo niewidoczne dla mieszkańca): globalna wyszukiwarka
   i zakres indeksowanych modułów nie są potwierdzone w obecnym systemie. */
export function SearchScreen() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const [filter, setFilter] = useState<SearchFilter>("all");
  /* hasło, dla którego mieszkaniec wybrał „Pokaż wszystkie wyniki” mimo krótkiego tekstu */
  const [showAllFor, setShowAllFor] = useState<string | null>(null);
  const sr = searchView(state, filter);
  const query = state.sQuery.trim();
  const suggesting = sr.hasQuery && query.length < SEARCH_RESULTS_MIN_LENGTH && showAllFor !== state.sQuery;
  const sg = suggesting ? searchSuggestions(state) : null;
  /* każda zmiana hasła wraca do podpowiedzi (dla krótkiego tekstu) */
  const setQuery = (q: string) => { setShowAllFor(null); dispatch({ type: "patch", patch: { sQuery: q } }); };

  const open = (r: SearchResult) => {
    if ("messageId" in r.target) dispatch({ type: "openMessage", id: r.target.messageId });
    else if ("stub" in r.target) dispatch({ type: "openStub", key: r.target.stub });
    else dispatch({ type: "go", screen: r.target.screen });
  };

  return (
    <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        {/* widoczna etykieta pola – sam tekst zastępczy nie jest etykietą */}
        <label className="lbl" htmlFor="sq">Szukaj informacji, usług i miejsc</label>
        <div style={{ position: "relative" }}>
          <Icon name="search" size={22} style={{ position: "absolute", left: 16, top: 17 }} />
          <input id="sq" className="inp" autoComplete="off" style={{ paddingLeft: 50, minHeight: 56, fontSize: 16, borderRadius: 16, background: "#F5F8F4" }} placeholder="Wpisz hasło, np. woda" value={state.sQuery} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setShowAllFor(state.sQuery); }} />
        </div>
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
              <button key={x} className="chip" onClick={() => setQuery(x)} style={{ border: "1.5px solid #CFD8D3", background: "#FFFFFF", minHeight: 44, padding: "7px 14px" }}>{x}</button>
            ))}
          </div>
        </div>
      )}

      {sg && (
        <div data-suggestions style={{ border: "1px solid #DFE6E2", borderRadius: 14, overflow: "hidden", background: "#FFFFFF" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "2px 14px" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Podpowiedzi</span>
            <button className="lnk" style={{ fontSize: 14 }} onClick={() => setShowAllFor(state.sQuery)}>Pokaż wszystkie wyniki</button>
          </div>
          {sg.terms.map((t) => <SuggestionRow key={"t" + t} icon="search" label={t} onClick={() => setQuery(t)} />)}
          {sg.items.map((r, i) => <SuggestionRow key={"i" + i} icon={r.icon} label={r.title} hint={[r.kind, r.locality].filter(Boolean).join(" · ")} onClick={() => open(r)} />)}
          {sg.categories.map((c) => <SuggestionRow key={"c" + c} icon={CATEGORY_ICON[c]} label={c} hint="Kategoria" onClick={() => setQuery(c)} />)}
          {!sg.any && <p style={{ margin: 0, padding: "12px 14px", borderTop: "1px solid #E6ECE8", fontSize: 14.5, color: "#3C474C" }}>Brak podpowiedzi. Wpisz dłuższe hasło.</p>}
        </div>
      )}

      {sr.hasQuery && !suggesting && !sr.none && (
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

      {sr.none && !suggesting && (
        <div role="status" style={{ border: "1.5px dashed #CFD8D3", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>Nie znaleziono wyników. Spróbuj innego hasła.</p>
        </div>
      )}
    </div>
  );
}
