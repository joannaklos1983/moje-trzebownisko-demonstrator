"use client";

import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { DEMO_TIMES } from "@/data/demo";
import { useAppActions, useAppState } from "@/lib/store";

/* Pasek demonstratora: opis, przełącznik czasu demo (symulacja, bez zegara systemowego) i reset. */
export function DemoBar() {
  const { now } = useAppState();
  const { dispatch, reset } = useAppActions();
  return (
    <header style={{ display: "flex", alignItems: "center", gap: 20, background: "#FFFFFF", borderRadius: 16, padding: "14px 20px", border: "1px solid #DFE6E2" }}>
      <Logo height={40} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden" }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Moje Trzebownisko · demonstrator klikalny</div>
        <div style={{ fontSize: 12.5, color: "#5A6670" }}>Aplikacja mieszkańca + panel administratora · dane przykładowe</div>
      </div>
      <span className="tag" style={{ marginLeft: 6, flex: "none" }}>PROTOTYP / KONCEPCJA</span>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", flex: "none" }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#3C474C" }}>Czas demo, wt 6 paź:</span>
        <div style={{ display: "flex", gap: 6 }}>
          {DEMO_TIMES.map((t) => (
            <button key={t.value} className="tbtn" aria-pressed={now === t.value} onClick={() => dispatch({ type: "setNow", now: t.value })}>{t.label}</button>
          ))}
        </div>
        <button className="tbtn" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={reset}><Icon name="reset" size={15} />Resetuj demo</button>
      </div>
    </header>
  );
}

/* Podpowiedź scenariusza pokazowego. */
export function ScenarioStrip() {
  const arrow = <span style={{ color: "#5A6670" }}>→</span>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#3C474C", whiteSpace: "nowrap", overflow: "hidden" }}>
      <span style={{ fontWeight: 700, color: "#1F2A2E" }}>Scenariusz:</span>
      <span>1. Panel: wyślij kampanię „Przerwa w dostawie wody – Jasionka”</span>{arrow}
      <span>2. Start: „Ważne teraz”</span>{arrow}
      <span>3. Dzwonek → Powiadomienia → szczegół</span>{arrow}
      <span>4. Zmień miejscowość na Łąka</span>{arrow}
      <span>5. Godz. 15:00: historia</span>
    </div>
  );
}
