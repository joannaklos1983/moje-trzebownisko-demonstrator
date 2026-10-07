"use client";

import { useState } from "react";
import { ReportMap, ReportStatusBadge } from "@/components/resident/reports/ReportBits";
import { Icon } from "@/components/ui/Icon";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import { LOCALITIES } from "@/data/localities";
import { REPORT_DATE_FILTERS, REPORT_STATUSES, REPORT_STATUS_ORDER, REPORT_TYPES } from "@/data/reports";
import { REPORT_FILTERS_DEFAULT, activeReportFilters, filterReports, reportDateLabel, reportLocation } from "@/lib/reports";
import type { ReportFilters } from "@/lib/reports";
import { useAppActions, useAppState } from "@/lib/store";

function FilterSelect({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div>
      <label className="lbl" htmlFor={id}>{label}</label>
      <div style={{ position: "relative" }}>
        <select id={id} className="sel" value={value} onChange={(e) => onChange(e.target.value)}>{children}</select>
        <Icon name="chevD" style={{ position: "absolute", right: 12, top: 14, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

/* Zgłoszenia: lista i mapa poglądowa tych samych rekordów, filtry, wejście do formularza.
   Wersja demonstracyjna – bez backendu; zgłoszenia mieszkańca żyją tylko w stanie demo. */
export function ReportsScreen() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const [filters, setFilters] = useState<ReportFilters>(REPORT_FILTERS_DEFAULT);
  const [view, setView] = useState<"list" | "map">("list");
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<ReportFilters>) => setFilters({ ...filters, ...patch });
  const reports = filterReports(state, filters);
  const active = activeReportFilters(filters);
  const openReport = (id: string) => dispatch({ type: "openReport", id });

  return (
    <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 15, color: "#3C474C", lineHeight: 1.5 }}>Zgłoś usterkę lub problem w przestrzeni publicznej i sprawdź status zgłoszeń.</p>
      <button className="btn" style={{ width: "100%", minHeight: 52 }} onClick={() => dispatch({ type: "openReportForm" })}><Icon name="report" />Zgłoś problem</button>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <label htmlFor="rq" style={visuallyHidden}>Szukaj w zgłoszeniach</label>
          <Icon name="search" style={{ position: "absolute", left: 14, top: 14, color: "#5A6670" }} />
          <input id="rq" className="inp" style={{ paddingLeft: 44 }} placeholder="Szukaj w zgłoszeniach…" value={filters.query} onChange={(e) => set({ query: e.target.value })} />
        </div>
        <button aria-label="Filtry" aria-expanded={open} onClick={() => setOpen(!open)} style={{ width: 52, height: 48, border: `1.5px solid ${open ? "#2F824F" : "#CFD8D3"}`, background: open ? "#EEF6F1" : "#FFFFFF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flex: "none" }}>
          <Icon name="sliders" />
          {active > 0 && <span style={{ position: "absolute", top: -6, right: -6, minWidth: 20, height: 20, borderRadius: 10, background: "#2F824F", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{active}</span>}
        </button>
      </div>

      {open && (
        <div data-report-filters style={{ border: "1.5px solid #DFE6E2", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 12, background: "#F9FBF9" }}>
          <FilterSelect id="rf-type" label="Rodzaj zgłoszenia" value={filters.type} onChange={(v) => set({ type: v })}>
            <option value="all">Wszystkie rodzaje</option>
            {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </FilterSelect>
          <FilterSelect id="rf-loc" label="Miejscowość" value={filters.locality} onChange={(v) => set({ locality: v as ReportFilters["locality"] })}>
            <option value="all">Wszystkie miejscowości</option>
            {LOCALITIES.map((l) => <option key={l} value={l}>{l}</option>)}
          </FilterSelect>
          <FilterSelect id="rf-status" label="Status" value={filters.status} onChange={(v) => set({ status: v as ReportFilters["status"] })}>
            <option value="all">Wszystkie statusy</option>
            {REPORT_STATUS_ORDER.map((st) => <option key={st} value={st}>{REPORT_STATUSES[st].label}</option>)}
          </FilterSelect>
          <FilterSelect id="rf-date" label="Data zgłoszenia" value={filters.days} onChange={(v) => set({ days: v as ReportFilters["days"] })}>
            {REPORT_DATE_FILTERS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </FilterSelect>
          <button className="lnk" style={{ alignSelf: "flex-start" }} onClick={() => setFilters(REPORT_FILTERS_DEFAULT)}>Wyczyść filtry</button>
        </div>
      )}

      <div role="group" aria-label="Widok zgłoszeń" style={{ display: "flex", gap: 4, background: "#EEF2EF", borderRadius: 12, padding: 4 }}>
        <button className="seg" aria-pressed={view === "list"} onClick={() => setView("list")}>Lista</button>
        <button className="seg" aria-pressed={view === "map"} onClick={() => setView("map")}>Mapa</button>
      </div>

      <div data-report-count style={{ fontSize: 13.5, color: "#5A6670" }}>Zgłoszenia: {reports.length}</div>

      {view === "map" && reports.length > 0 && (
        <>
          <ReportMap reports={reports} height={300} onPick={openReport} />
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
            {reports.map((r, i) => (
              <li key={r.id}>
                <button className="row" data-map-row onClick={() => openReport(r.id)} style={{ borderBottom: "1px solid #E6ECE8", padding: "8px 0", minHeight: 52 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#2F824F", color: "#FFFFFF", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{i + 1}</span>
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</span>
                    <span style={{ fontSize: 13, color: "#5A6670" }}>{reportLocation(r)}</span>
                  </span>
                  <Icon name="chevR" style={{ color: "#3C474C" }} />
                </button>
              </li>
            ))}
          </ol>
        </>
      )}

      {view === "list" && reports.map((r) => (
        /* cała karta jest przyciskiem i otwiera szczegół zgłoszenia */
        <button key={r.id} className="plain" data-report={r.id} onClick={() => openReport(r.id)} style={{ border: "1px solid #DFE6E2", borderLeft: "4px solid #2F824F", borderRadius: 14, padding: "14px 16px 6px", background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px 8px", flexWrap: "wrap" }}>
            <span data-report-type style={{ fontSize: 13, color: "#4E5A63", fontWeight: 500, flex: 1, minWidth: 0 }}>{r.type}</span>
            <ReportStatusBadge status={r.status} />
          </span>
          <span data-report-title style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: "#1F2A2E" }}>{r.title}</span>
          <span style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14.5 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}><Icon name="pin" size={17} style={{ color: "#5A6670" }} />{reportLocation(r)}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="cal" size={17} style={{ color: "#5A6670" }} />{reportDateLabel(r.date)}</span>
          </span>
          <span style={{ fontSize: 14.5, color: "#3C474C", lineHeight: 1.45 }}>{r.desc}</span>
          <span style={{ borderTop: "1px solid #E6ECE8", marginTop: 2, minHeight: 44, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700, color: "#2F824F" }}>Szczegóły<Icon name="arrowR" size={18} /></span>
        </button>
      ))}

      {reports.length === 0 && (
        <div role="status" style={{ border: "1.5px dashed #CFD8D3", borderRadius: 16, padding: 20, textAlign: "center", display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>Brak zgłoszeń dla wybranych filtrów.</p>
          <button className="lnk" onClick={() => setFilters(REPORT_FILTERS_DEFAULT)}>Pokaż wszystkie zgłoszenia</button>
        </div>
      )}
    </div>
  );
}
