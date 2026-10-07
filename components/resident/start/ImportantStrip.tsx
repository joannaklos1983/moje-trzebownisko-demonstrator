"use client";

import { Icon } from "@/components/ui/Icon";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import { IMPORTANT_HIGHLIGHT } from "@/data/messageTypes";
import { currentForMe, decorateMessage, importantNow, importantNowEmptyText } from "@/lib/messages";
import { useAppActions, useAppState } from "@/lib/store";

/* „Ważne teraz” w zwartej formie: najważniejszy komunikat jako pasek, kolejne (łącznie najwyżej 3)
   jako krótsze wiersze w tej samej karcie. Kolejność i limit pochodzą z lib/messages.
   Zieleń oznacza ekspozycję na pulpicie; czerwień tylko dla Alertu RCB. Cały wiersz jest klikalny. */
export function ImportantStrip() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const messages = importantNow(state);
  const items = messages.map((m) => decorateMessage(state, m));
  const alert = messages[0]?.type === "Alert";
  const total = currentForMe(state).length;

  return (
    <section aria-labelledby="wazne-teraz" style={{ padding: "12px 16px 0" }}>
      <h2 id="wazne-teraz" style={visuallyHidden}>Ważne teraz</h2>
      {items.length > 0 ? (
        <div data-important style={{ border: `1.5px solid ${alert ? items[0].bigBorder : "#9CC8AC"}`, background: alert ? items[0].bigBg : IMPORTANT_HIGHLIGHT.bg, borderRadius: 18, overflow: "hidden" }}>
          {items.map((m, i) => {
            const isAlert = messages[i].type === "Alert";
            return (
              <button key={m.id} className="row" data-important-row onClick={() => dispatch({ type: "actOnMessage", id: m.id })} style={{ padding: i ? "8px 12px 8px 14px" : "12px 12px 12px 14px", borderTop: i ? "1px solid #CFE3D6" : undefined, minHeight: i ? 48 : 64, gap: 10 }}>
                <span style={{ width: i ? 28 : 36, height: i ? 28 : 36, borderRadius: "50%", background: isAlert ? "#B3261E" : "#2F824F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={m.typeIcon} size={i ? 16 : 20} /></span>
                <span style={{ flex: 1, minWidth: 0, fontSize: i ? 14 : 15, lineHeight: 1.35, color: "#1F2A2E" }}>
                  <strong style={{ color: isAlert ? "#B3261E" : "#1F6B3D" }}>{m.typeLabel}</strong> · <strong>{m.title}</strong> · {m.when}
                </span>
                <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 2, fontSize: 14, fontWeight: 700, color: "#1F6B3D" }}>{i === 0 && m.btn === "Szczegóły" ? "Szczegóły" : ""}<Icon name="chevR" size={18} /></span>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ border: "1.5px solid #DFE6E2", borderRadius: 18, padding: 14, background: "#F5F8F4", display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>{importantNowEmptyText(state)}</p>
          {state.locPriority && (
            <button className="lnk" style={{ alignSelf: "flex-start", color: "#23673D", fontSize: 14 }} onClick={() => dispatch({ type: "showWholeGmina" })}>Sprawdź, co ważnego w całej gminie<Icon name="arrowR" size={18} /></button>
          )}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="lnk" style={{ fontSize: 13.5, minHeight: 36 }} onClick={() => dispatch({ type: "openNotifications" })}>{`Wszystkie (${total})`}</button>
      </div>
    </section>
  );
}
