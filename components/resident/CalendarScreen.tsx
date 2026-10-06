"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import { CALENDAR_RANGES, WEEKDAY_HEADERS } from "@/data/calendar";
import type { CalendarRange } from "@/data/calendar";
import { CATEGORY_ICON } from "@/data/categories";
import {
  calendarContext, calendarEvents, calendarView, dayHeading, dayLabel, demoToday, eventCountsByDay, eventPlace, eventTime,
  eventsCountLabel, isInRange, monthGrid, monthTitle, rangeDays, sameDay, shiftMonth, spanLabel,
} from "@/lib/calendar";
import type { DayRef } from "@/lib/calendar";
import { useAppActions, useAppState } from "@/lib/store";

type Selection = { kind: "range"; range: CalendarRange } | { kind: "day"; day: DayRef };

const RANGE_TITLE: Record<CalendarRange, string> = { today: "Dziś", weekend: "Weekend", week: "Ten tydzień" };

/* Kalendarz: szybkie zakresy + widok miesiąca + lista wydarzeń wybranego dnia.
   Wspólny widok tych samych komunikatów-wydarzeń co w Powiadomieniach; miejscowość z aplikacji,
   bez drugiego selektora. Działa po tapnięciu (bez hover); podpowiedź po najechaniu jest tylko dodatkiem.
   DO SPRAWDZENIA (oznaczenie projektowe, poza interfejsem mieszkańca): źródła wydarzeń –
   Urząd, Centrum Oświaty, OSiR, GCK – i integracja z ich kalendarzami; organizator wydarzenia. */
export function CalendarScreen() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const today = demoToday(state);
  const [sel, setSel] = useState<Selection>({ kind: "range", range: "today" });
  const [view, setView] = useState({ y: today.y, m: today.m });

  const [from, to] = sel.kind === "range" ? rangeDays(state.now, sel.range) : [sel.day, sel.day];
  const events = calendarEvents(state, from, to);
  const counts = eventCountsByDay(state, view.y, view.m);
  const single = sameDay(from, to);
  const heading = single ? dayHeading(from) : RANGE_TITLE[(sel as { range: CalendarRange }).range] + ", " + spanLabel(from, to);
  const emptyText = sel.kind === "range" ? calendarView(state, sel.range).emptyText : "Tego dnia nie ma wydarzeń w kalendarzu.";

  const pickRange = (range: CalendarRange) => {
    const [start] = rangeDays(state.now, range);
    setSel({ kind: "range", range });
    setView({ y: start.y, m: start.m });
  };

  return (
    <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div role="group" aria-label="Zakres dat" style={{ display: "flex", gap: 4, background: "#EEF2EF", borderRadius: 12, padding: 4 }}>
        {CALENDAR_RANGES.map((r) => (
          <button key={r.value} className="seg" aria-pressed={sel.kind === "range" && sel.range === r.value} onClick={() => pickRange(r.value)}>{r.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#3C474C" }}>
        <Icon name="pin" size={17} style={{ color: "#2F824F" }} />
        <span style={{ flex: 1, minWidth: 0 }}>{calendarContext(state)}</span>
      </div>

      {/* widok miesiąca */}
      <section aria-label="Kalendarz miesięczny" style={{ border: "1px solid #DFE6E2", borderRadius: 16, padding: "8px 4px 10px", background: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button aria-label="Poprzedni miesiąc" onClick={() => setView(shiftMonth(view.y, view.m, -1))} style={{ width: 44, height: 44, border: 0, background: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#1F2A2E", borderRadius: 12 }}><Icon name="chevR" size={22} style={{ transform: "rotate(180deg)" }} /></button>
          <h2 aria-live="polite" style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{monthTitle(view.y, view.m)}</h2>
          <button aria-label="Następny miesiąc" onClick={() => setView(shiftMonth(view.y, view.m, 1))} style={{ width: 44, height: 44, border: 0, background: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#1F2A2E", borderRadius: 12 }}><Icon name="chevR" size={22} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", marginTop: 2 }}>
          {WEEKDAY_HEADERS.map((d) => (
            <span key={d.short} style={{ textAlign: "center", fontSize: 12.5, fontWeight: 600, color: "#5A6670", padding: "4px 0 6px" }}><span aria-hidden="true">{d.short}</span><span style={visuallyHidden}>{d.full}</span></span>
          ))}
          {monthGrid(view.y, view.m).flat().map((d, i) => {
            if (d === null) return <span key={"e" + i} />;
            const day: DayRef = { y: view.y, m: view.m, d };
            const n = counts[d] || 0;
            const isToday = sameDay(day, today);
            const selected = single && sameDay(day, from);
            const inRange = !single && isInRange(day, from, to);
            const label = dayLabel(day) + ", " + eventsCountLabel(n) + (isToday ? ", dziś" : "") + (selected ? ", wybrany dzień" : "");
            return (
              <button key={d} className="cal-day" data-day={d} data-events={n} data-today={isToday || undefined} data-inrange={inRange || undefined} aria-pressed={selected} aria-label={label} title={n ? eventsCountLabel(n) : undefined} onClick={() => setSel({ kind: "day", day })}>
                <span className="cal-num">{d}</span>
                <span className="cal-dot" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>

      {/* wydarzenia wybranego dnia lub zakresu */}
      <div>
        <h2 data-heading style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>{heading}</h2>
        <p data-count style={{ margin: "2px 0 0", fontSize: 14, color: "#5A6670" }}>{eventsCountLabel(events.length).replace(/^b/, "B")}</p>
      </div>

      {events.map((m) => {
        const time = eventTime(m);
        const place = eventPlace(m);
        return (
          /* cała karta jest przyciskiem: tapnięcie w dowolne miejsce otwiera szczegół w aplikacji */
          <button key={m.id} className="plain" data-event onClick={() => dispatch({ type: "openMessage", id: m.id })} style={{ border: "1px solid #DFE6E2", borderLeft: "4px solid #2F824F", borderRadius: 14, padding: "14px 16px 6px", background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 8 }}>
            {time && <span data-time style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 700, color: "#1F6B3D" }}><Icon name="clock" size={17} />{time}</span>}
            <span data-title style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: "#1F2A2E" }}>{m.title}</span>
            {!single && <span data-date style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5 }}><Icon name="cal" size={17} style={{ color: "#5A6670" }} />{dayHeading(toRef(m.evStart as string))}</span>}
            {place && <span data-place style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5 }}><Icon name="pin" size={17} style={{ color: "#5A6670" }} />{place}</span>}
            <span data-category style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5 }}><Icon name={CATEGORY_ICON[m.cat]} size={17} style={{ color: "#5A6670" }} />{m.cat}</span>
            <span style={{ borderTop: "1px solid #E6ECE8", marginTop: 2, minHeight: 44, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700, color: "#2F824F" }}>Szczegóły<Icon name="arrowR" size={18} /></span>
          </button>
        );
      })}

      {events.length === 0 && (
        <div role="status" style={{ border: "1.5px dashed #CFD8D3", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>{emptyText}</p>
        </div>
      )}
    </div>
  );
}

function toRef(iso: string): DayRef {
  const d = new Date(iso);
  return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() };
}
