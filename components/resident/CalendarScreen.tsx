"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CALENDAR_RANGES } from "@/data/calendar";
import type { CalendarRange } from "@/data/calendar";
import { CATEGORY_ICON } from "@/data/categories";
import { calendarView, organizerOf } from "@/lib/calendar";
import { useAppActions, useAppState } from "@/lib/store";

/* Kalendarz: wspólny widok wydarzeń. Korzysta z tych samych komunikatów, kategorii i miejscowości
   co Powiadomienia – nie jest osobnym systemem treści i nie ma własnego wyboru miejscowości.
   Źródła wydarzeń i integracja z kalendarzami jednostek: DO SPRAWDZENIA. */
export function CalendarScreen() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const [range, setRange] = useState<CalendarRange>("today");
  const cal = calendarView(state, range);

  return (
    <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div role="group" aria-label="Zakres dat" style={{ display: "flex", gap: 4, background: "#EEF2EF", borderRadius: 12, padding: 4 }}>
        {CALENDAR_RANGES.map((r) => (
          <button key={r.value} className="seg" aria-pressed={range === r.value} onClick={() => setRange(r.value)}>{r.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#3C474C" }}>
        <Icon name="pin" size={17} style={{ color: "#2F824F" }} />
        <span style={{ flex: 1, minWidth: 0 }}>{cal.context}</span>
      </div>

      {cal.events.map((m) => (
        <article key={m.id} style={{ border: "1.5px solid #DFE6E2", borderRadius: 16, padding: 16, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 700, color: "#1F6B3D" }}><Icon name="cal" size={18} />{m.when}</span>
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.3, fontWeight: 700 }}>{m.title}</h2>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5 }}><Icon name="pin" size={18} style={{ color: "#5A6670" }} />{m.place}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5 }}><Icon name={CATEGORY_ICON[m.cat]} size={18} style={{ color: "#5A6670" }} />{m.cat}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 14.5 }}>
            <Icon name="office" size={18} style={{ color: "#5A6670" }} />
            <span>Organizator: <strong>{organizerOf(m)}</strong></span>
            <span className="tag">DO SPRAWDZENIA</span>
          </span>
          <div style={{ borderTop: "1px solid #E6ECE8", paddingTop: 2 }}>
            <button className="lnk" onClick={() => dispatch({ type: "openMessage", id: m.id })}>Szczegóły<Icon name="arrowR" size={18} /></button>
          </div>
        </article>
      ))}

      {cal.events.length === 0 && (
        <div role="status" style={{ border: "1.5px dashed #CFD8D3", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>{cal.emptyText}</p>
        </div>
      )}

      <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#3C474C", lineHeight: 1.45 }}><span className="tag">DO SPRAWDZENIA</span> Źródła wydarzeń (Urząd, Centrum Oświaty, OSiR, GCK) i integracja z ich kalendarzami.</p>
    </div>
  );
}
