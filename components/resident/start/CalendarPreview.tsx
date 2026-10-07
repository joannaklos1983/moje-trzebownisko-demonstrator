"use client";

import { useState } from "react";
import { MONTHS_SHORT, WEEKDAYS_UPPER } from "@/data/demo";
import { calendarEvents, demoToday, eventPlace, eventTime, rangeDays } from "@/lib/calendar";
import type { DayRef } from "@/lib/calendar";
import { useAppActions, useAppState } from "@/lib/store";

type Range = "today" | "weekend" | "month";
const RANGES: { value: Range; label: string }[] = [
  { value: "today", label: "Dziś" },
  { value: "weekend", label: "Weekend" },
  { value: "month", label: "Miesiąc" },
];
const EMPTY: Record<Range, string> = {
  today: "Dziś nie ma wydarzeń w kalendarzu.",
  weekend: "W ten weekend nie ma wydarzeń w kalendarzu.",
  month: "W tym miesiącu nie ma wydarzeń w kalendarzu.",
};

/* Kalendarz gminny na Starcie: skrót do tych samych wydarzeń co ekran Kalendarz i Powiadomienia.
   Miejscowość z aplikacji; pokazujemy tylko dane, które są w rekordzie (bez pól w nawiasach). */
export function CalendarPreview() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const [range, setRange] = useState<Range>("today");
  const today = demoToday(state);
  const [from, to]: [DayRef, DayRef] = range === "month"
    ? [{ y: today.y, m: today.m, d: 1 }, { y: today.y, m: today.m, d: new Date(today.y, today.m + 1, 0).getDate() }]
    : rangeDays(state.now, range);
  const events = calendarEvents(state, from, to).slice(0, 3);

  return (
    <section aria-labelledby="kalendarz-gminny" style={{ padding: "26px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
        <h2 id="kalendarz-gminny" className="h2" style={{ fontSize: 20 }}>Kalendarz gminny</h2>
      </div>
      <div role="group" aria-label="Zakres kalendarza" style={{ marginTop: 12, display: "flex", gap: 4, background: "#EEF2EF", borderRadius: 12, padding: 4 }}>
        {RANGES.map((r) => <button key={r.value} className="seg" aria-pressed={range === r.value} onClick={() => setRange(r.value)}>{r.label}</button>)}
      </div>
      <div style={{ marginTop: 4 }}>
        {events.map((m) => {
          const d = new Date(m.evStart as string);
          const time = eventTime(m);
          const place = eventPlace(m);
          return (
            <div key={m.id} data-preview-event style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #E6ECE8" }}>
              <span style={{ width: 52, flex: "none", border: "1.5px solid #DFE6E2", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 0 6px", lineHeight: 1.1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#2F824F" }}>{WEEKDAYS_UPPER[d.getDay()]}</span>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{d.getDate()}</span>
                <span style={{ fontSize: 11, color: "#5A6670" }}>{MONTHS_SHORT[d.getMonth()]}</span>
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                {time && <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1F6B3D" }}>{time}</span>}
                <span style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{m.title}</span>
                {place && <span style={{ fontSize: 13.5, color: "#5A6670" }}>{place}</span>}
              </span>
              <button aria-label={`Szczegóły: ${m.title}`} onClick={() => dispatch({ type: "openMessage", id: m.id })} style={{ flex: "none", border: "1.5px solid #CFD8D3", background: "#FFFFFF", borderRadius: 12, fontSize: 13.5, fontWeight: 700, color: "#1F6B3D", padding: "0 12px", minHeight: 44 }}>Szczegóły</button>
            </div>
          );
        })}
        {events.length === 0 && <p role="status" style={{ margin: "14px 0 6px", fontSize: 14.5, color: "#3C474C" }}>{EMPTY[range]}</p>}
      </div>
      <button className="btn2" style={{ width: "100%", marginTop: 14 }} onClick={() => dispatch({ type: "tab", screen: "calendar" })}>Zobacz cały kalendarz</button>
    </section>
  );
}
