"use client";

import { Icon } from "@/components/ui/Icon";
import { REPORT_STATUSES } from "@/data/reports";
import type { Report, ReportStatus } from "@/types";

/* Status zawsze z tekstem, nie tylko kolorem. */
export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const s = REPORT_STATUSES[status];
  return <span className="st" data-report-status style={{ background: s.bg, color: s.fg, flex: "none" }}>{s.label.toUpperCase()}</span>;
}

/* Mapa POGLĄDOWA: schematyczne tło i znaczniki z pól mapX / mapY rekordu zgłoszenia.
   To nie jest integracja z mapą ani systemem GIS – położenie jest przykładowe. */
export function ReportMap({ reports, height, onPick, activeId }: { reports: Report[]; height: number; onPick?: (id: string) => void; activeId?: string }) {
  return (
    <div data-report-map style={{ position: "relative", height, borderRadius: 16, border: "1px solid #DFE6E2", overflow: "hidden", background: "#EEF4EF", backgroundImage: "linear-gradient(#DCE7DF 1px, transparent 1px), linear-gradient(90deg, #DCE7DF 1px, transparent 1px), linear-gradient(115deg, transparent 46%, #FFFFFF 46%, #FFFFFF 51%, transparent 51%), linear-gradient(20deg, transparent 58%, #FFFFFF 58%, #FFFFFF 62%, transparent 62%)", backgroundSize: "36px 36px, 36px 36px, 100% 100%, 100% 100%" }}>
      {reports.map((r, i) => {
        const pin = (
          <span style={{ width: 36, height: 36, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: r.id === activeId || !onPick ? "#2F824F" : "#FFFFFF", border: "2px solid #2F824F", color: r.id === activeId || !onPick ? "#FFFFFF" : "#1F6B3D", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(31,42,46,.25)" }}>
            <span style={{ transform: "rotate(45deg)", fontSize: 14, fontWeight: 700 }}>{onPick ? i + 1 : <Icon name="pin" size={16} />}</span>
          </span>
        );
        const pos = { position: "absolute", left: `${r.mapX}%`, top: `${r.mapY}%`, transform: "translate(-50%, -100%)" } as const;
        return onPick
          ? <button key={r.id} data-pin={r.id} aria-label={`${i + 1}. ${r.title}, ${r.locality}`} onClick={() => onPick(r.id)} style={{ ...pos, width: 44, height: 44, border: 0, background: "none", padding: 0, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{pin}</button>
          : <span key={r.id} data-pin={r.id} style={pos}>{pin}</span>;
      })}
      <span style={{ position: "absolute", left: 8, bottom: 8, fontSize: 11.5, fontWeight: 600, background: "rgba(255,255,255,.92)", color: "#3C474C", borderRadius: 6, padding: "3px 8px" }}>Widok poglądowy – położenie przykładowe</span>
    </div>
  );
}
