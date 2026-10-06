"use client";

import { Icon } from "@/components/ui/Icon";
import { IMPORTANT_HIGHLIGHT } from "@/data/messageTypes";
import { currentForMe, decorateMessage, importantNow, importantNowEmptyText } from "@/lib/messages";
import { useAppActions, useAppState } from "@/lib/store";

/* „Ważne teraz”: skrócony widok najwyżej 3 aktywnych, wyróżnionych komunikatów.
   Kliknięcie prowadzi do konkretnego działania lub szczegółu, nie do ogólnego modułu. */
export function ImportantNow() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const messages = importantNow(state);
  const [big, ...rest] = messages.map((m) => decorateMessage(state, m));
  /* Karta jest w zieleni Gminy: kolor oznacza ekspozycję w tej sekcji, a nie typ komunikatu
     (typ podaje etykieta z tekstem i ikoną). Czerwień jest zarezerwowana dla Alertu RCB –
     tylko alert zachowuje na karcie kolory swojego typu. */
  const isAlert = (i: number) => messages[i].type === "Alert";
  const card = big && isAlert(0)
    ? { border: big.bigBorder, bg: big.bigBg, pillBg: big.pillBg, pillFg: big.pillFg }
    : IMPORTANT_HIGHLIGHT;

  return (
    <section style={{ padding: "26px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 className="h2">Ważne teraz</h2>
        <button className="lnk" onClick={() => dispatch({ type: "openNotifications" })}>{`Wszystkie (${currentForMe(state).length})`}</button>
      </div>

      {big ? (
        <div style={{ marginTop: 12, border: `1.5px solid ${card.border}`, borderRadius: 18, overflow: "hidden", background: "#FFFFFF" }}>
          <div data-important-card style={{ position: "relative", background: card.bg, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "4px 8px", flexWrap: "wrap" }}>
                <span className="pill" style={{ background: card.pillBg, color: card.pillFg }}><Icon name={big.typeIcon} size={15} />{big.typeLabel}</span>
                <span style={{ fontSize: 13.5, color: "#4E5A63", fontWeight: 500 }}>{big.cat}</span>
              </div>
              <span className="st" style={{ flex: "none", marginTop: 2, background: big.stBg, color: big.stFg }}>{big.statusLabel}</span>
            </div>
            {/* tytuł jest przyciskiem rozciągniętym na całą kartę: tapnięcie w dowolne miejsce otwiera szczegół */}
            <h3 style={{ margin: "2px 0 0", fontSize: 20, lineHeight: 1.25, fontWeight: 700 }}><button className="stretched" style={{ fontWeight: 700 }} onClick={() => dispatch({ type: "openMessage", id: big.id })}>{big.title}</button></h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.45, color: "#3C474C" }}>{big.text}</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 4 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, fontSize: 14.5, minWidth: 0 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="pin" size={18} style={{ color: "#5A6670" }} />{big.place}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="clock" size={18} style={{ color: "#5A6670" }} />{big.when}</span>
              </div>
              <button className="btn above-stretched" style={{ padding: "12px 16px", fontSize: 15, flex: "none" }} onClick={() => dispatch({ type: "actOnMessage", id: big.id })}>{big.btn}<Icon name="chevR" size={18} /></button>
            </div>
          </div>
          {rest.map((r, i) => (
            <button key={r.id} className="row" onClick={() => dispatch({ type: "actOnMessage", id: r.id })} style={{ borderTop: "1px solid #E6ECE8", padding: "12px 14px 12px 16px" }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", background: isAlert(i + 1) ? r.circleBg : IMPORTANT_HIGHLIGHT.circleBg, color: isAlert(i + 1) ? r.circleFg : IMPORTANT_HIGHLIGHT.circleFg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={r.typeIcon} /></span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</span>
                <span style={{ fontSize: 13.5, color: "#5A6670" }}>{r.typeLabel} · {r.when}</span>
              </span>
              <Icon name="chevR" style={{ color: "#3C474C" }} />
            </button>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 12, border: "1.5px solid #DFE6E2", borderRadius: 18, padding: 18, background: "#F5F8F4", display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>{importantNowEmptyText(state)}</p>
          {state.locPriority && (
            <button className="lnk" style={{ alignSelf: "flex-start", color: "#23673D" }} onClick={() => dispatch({ type: "showWholeGmina" })}>Sprawdź, co ważnego w całej gminie<Icon name="arrowR" size={18} /></button>
          )}
        </div>
      )}
    </section>
  );
}
