"use client";

import { Icon } from "@/components/ui/Icon";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import { confirmedExternalUrl, decorateMessage, detailMessage } from "@/lib/messages";
import { useAppActions, useAppState } from "@/lib/store";
import type { IconName } from "@/types";

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

/* Szczegół komunikatu: co się dzieje, gdzie, kiedy, kogo dotyczy, co można zrobić. */
export function MessageDetail() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  const message = detailMessage(state);
  const d = decorateMessage(state, message);
  /* Link do oficjalnej strony pokazujemy tylko dla potwierdzonego adresu w rekordzie – nie tworzymy adresów. */
  const externalUrl = confirmedExternalUrl(message);

  return (
    <div style={{ padding: "18px 20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "4px 8px", flexWrap: "wrap" }}>
          <span className="pill" style={{ background: d.pillBg, color: d.pillFg }}><Icon name={d.typeIcon} size={14} />{d.typeLabel}</span>
          <span style={{ fontSize: 13.5, color: "#4E5A63", fontWeight: 500 }}>· {d.cat}</span>
        </div>
        <span className="st" style={{ flex: "none", marginTop: 2, background: d.stBg, color: d.stFg }}>{d.statusLabel}</span>
      </div>
      <h2 style={{ margin: 0, fontSize: 25, lineHeight: 1.25, fontWeight: 700 }}>{d.title}</h2>
      <div style={{ background: "#F5F8F4", border: "1px solid #DFE6E2", borderRadius: 16, padding: "4px 16px" }}>
        <Fact icon="pin" label="Gdzie" value={d.place} />
        <Fact icon="clock" label="Kiedy" value={d.when} />
        <Fact icon="users" label="Kogo dotyczy" value={d.whom} last />
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Co się dzieje</h3>
        <p style={{ margin: "6px 0 0", fontSize: 15.5, lineHeight: 1.55, color: "#2B3639" }}>{d.text}</p>
      </div>
      {d.hasTodo && (
        <div style={{ borderRadius: 14, background: "#EEF6F1", padding: "14px 16px" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Co możesz zrobić</h3>
          <p style={{ margin: "6px 0 0", fontSize: 15.5, lineHeight: 1.5 }}>{d.todo}</p>
        </div>
      )}
      {d.hasAction && (
        <button className="btn" style={{ width: "100%", minHeight: 54 }} onClick={() => dispatch({ type: "actOnMessage", id: d.id })}>{d.btn}<Icon name="arrowR" size={18} /></button>
      )}
      {externalUrl && (
        <a className="btn2" data-external href={externalUrl} target="_blank" rel="noopener noreferrer" style={{ width: "100%", minHeight: 54, textDecoration: "none" }}>
          {message.officialUrlLabel || "Przejdź do strony wydarzenia"}<Icon name="ext" size={18} /><span style={visuallyHidden}>(strona zewnętrzna, otwiera się w nowej karcie)</span>
        </a>
      )}
      {d.hasLink && (
        <div style={{ border: "1.5px dashed #D9A441", background: "#FFFBF0", borderRadius: 14, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="tag" style={{ alignSelf: "flex-start" }}>DO SPRAWDZENIA</span>
          <span style={{ fontSize: 14, lineHeight: 1.45 }}>Przycisk „{d.btn}” prowadzi do strony z pełnym komunikatem: <strong style={{ wordBreak: "break-all" }}>{d.link}</strong></span>
        </div>
      )}
      <div style={{ fontSize: 12.5, color: "#5A6670", lineHeight: 1.6, borderTop: "1px solid #E6ECE8", paddingTop: 12 }}>
        Wysłano: {d.sentLabel}<br />Ważne: {d.validity}<br />Grupa odbiorców: {d.group}
      </div>
    </div>
  );
}
