"use client";

import { ReportMap, ReportStatusBadge } from "@/components/resident/reports/ReportBits";
import { Icon } from "@/components/ui/Icon";
import { LOCALITIES } from "@/data/localities";
import { REPORT_DEMO_PHOTO_NAME, REPORT_STATUSES, REPORT_TYPES } from "@/data/reports";
import { findReport, reportDateLabel, reportFormErrors } from "@/lib/reports";
import { useAppActions, useAppState } from "@/lib/store";
import type { IconName, Locality } from "@/types";
import { useState } from "react";

function Fact({ icon, label, value, last }: { icon: IconName; label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: last ? undefined : "1px solid #E6ECE8" }}>
      <Icon name={icon} style={{ color: "#2F824F", marginTop: 2 }} />
      <div>
        <div style={{ fontSize: 12.5, color: "#5A6670", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

/* Szczegół zgłoszenia – ten sam rekord, który widać na liście i na mapie poglądowej. */
export function ReportDetail() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const r = findReport(state, state.reportId);

  if (!r) {
    return (
      <div style={{ padding: "24px 20px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
        <p role="status" style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>Nie znaleziono zgłoszenia.</p>
        <button className="btn2" onClick={() => dispatch({ type: "back" })}>Wróć do listy</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "18px 20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
      {state.reportNoticeId === r.id && (
        <div role="status" style={{ borderRadius: 14, background: "#EEF7F0", border: "1px solid #9CC8AC", padding: "12px 14px", display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.45 }}>
          <Icon name="check" style={{ color: "#2F824F", marginTop: 1 }} />
          <span><strong>Zgłoszenie dodane.</strong> To wersja demonstracyjna – zgłoszenie nie jest nigdzie wysyłane.</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: "#4E5A63", fontWeight: 500 }}>{r.type}</span>
        <ReportStatusBadge status={r.status} />
      </div>
      <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.25, fontWeight: 700 }}>{r.title}</h2>

      {r.photo && (
        <div data-report-photo style={{ display: "flex", alignItems: "center", gap: 10, border: "1.5px solid #DFE6E2", borderRadius: 12, padding: "10px 14px", fontSize: 14.5 }}>
          <Icon name="file" style={{ color: "#2F824F" }} /><span style={{ fontWeight: 600 }}>{REPORT_DEMO_PHOTO_NAME}</span><span style={{ color: "#5A6670" }}>– zdjęcie dołączone</span>
        </div>
      )}

      <div style={{ background: "#F5F8F4", border: "1px solid #DFE6E2", borderRadius: 16, padding: "4px 16px" }}>
        <Fact icon="pin" label="Miejscowość" value={r.locality} />
        {r.place && <Fact icon="map" label="Lokalizacja" value={r.place} />}
        <Fact icon="cal" label="Data zgłoszenia" value={reportDateLabel(r.date)} last />
      </div>

      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Opis</h3>
        <p style={{ margin: "6px 0 0", fontSize: 15.5, lineHeight: 1.55, color: "#2B3639" }}>{r.desc}</p>
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Położenie</h3>
        <ReportMap reports={[r]} height={170} />
      </div>

      <div style={{ borderRadius: 14, background: "#EEF6F1", padding: "14px 16px" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Ważne dla mieszkańca</h3>
        <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.5 }}>{REPORT_STATUSES[r.status].info} Status sprawy mieszkaniec widzi w module Zgłoszenia.</p>
      </div>
    </div>
  );
}

/* Formularz „Zgłoś problem” – symulacja: nic nie jest wysyłane, zdjęcie nie jest przesyłane. */
export function ReportForm() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const [tried, setTried] = useState(false);
  const f = state.reportForm;
  const set = (patch: Partial<typeof f>) => dispatch({ type: "patchReportForm", patch });
  const errors = reportFormErrors(state);
  const submit = () => { if (errors.length) setTried(true); else dispatch({ type: "submitReport" }); };

  return (
    <div style={{ padding: "18px 20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ margin: 0, fontSize: 15, color: "#3C474C", lineHeight: 1.5 }}>Opisz problem w przestrzeni publicznej. Zgłoszenie trafi do Urzędu Gminy.</p>
      <div>
        <label className="lbl" htmlFor="nr-type">Rodzaj zgłoszenia</label>
        <div style={{ position: "relative" }}>
          <select id="nr-type" className="sel" value={f.type} onChange={(e) => set({ type: e.target.value })}>
            <option value="">Wybierz rodzaj zgłoszenia</option>
            {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <Icon name="chevD" style={{ position: "absolute", right: 12, top: 14, pointerEvents: "none" }} />
        </div>
      </div>
      <div>
        <label className="lbl" htmlFor="nr-loc">Miejscowość</label>
        <div style={{ position: "relative" }}>
          <select id="nr-loc" className="sel" value={f.locality} onChange={(e) => set({ locality: e.target.value as Locality })}>
            {LOCALITIES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <Icon name="chevD" style={{ position: "absolute", right: 12, top: 14, pointerEvents: "none" }} />
        </div>
      </div>
      <div>
        <label className="lbl" htmlFor="nr-place">Lokalizacja</label>
        <input id="nr-place" className="inp" placeholder="np. ulica, numer, charakterystyczne miejsce" value={f.place} onChange={(e) => set({ place: e.target.value })} />
      </div>
      <div>
        <label className="lbl" htmlFor="nr-desc">Opis</label>
        <textarea id="nr-desc" className="inp" rows={4} style={{ resize: "vertical", lineHeight: 1.45 }} placeholder="Co się stało?" value={f.desc} onChange={(e) => set({ desc: e.target.value })} />
      </div>
      <div>
        <span className="lbl">Zdjęcie</span>
        {f.photo ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1.5px solid #DFE6E2", borderRadius: 12, padding: "8px 8px 8px 14px" }}>
            <Icon name="file" style={{ color: "#2F824F" }} />
            <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600 }}>{REPORT_DEMO_PHOTO_NAME}</span>
            <button aria-label="Usuń zdjęcie" onClick={() => set({ photo: false })} style={{ width: 44, height: 44, border: 0, background: "none", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="x" /></button>
          </div>
        ) : (
          <button className="btn2" style={{ width: "100%" }} onClick={() => set({ photo: true })}><Icon name="upload" />Dodaj zdjęcie</button>
        )}
      </div>
      {tried && errors.length > 0 && (
        <div role="alert" style={{ borderRadius: 12, border: "1.5px solid #B3261E", background: "#FFF7F6", padding: "10px 14px", fontSize: 14.5, lineHeight: 1.5, color: "#1F2A2E" }}>
          <strong>Uzupełnij formularz:</strong>
          <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}
      <button className="btn" style={{ width: "100%", minHeight: 54 }} onClick={submit}>Wyślij zgłoszenie</button>
    </div>
  );
}
