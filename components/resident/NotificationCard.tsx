"use client";

import { Icon } from "@/components/ui/Icon";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import type { MessageView } from "@/lib/messages";
import { useAppActions } from "@/lib/store";

/* Karta powiadomienia: typ i kategoria → tytuł → miejscowość → termin → status → jedno działanie.
   Status i stan nieprzeczytany są opisane tekstem, nie tylko kolorem. */
export function NotificationCard({ m }: { m: MessageView }) {
  const { dispatch } = useAppActions();
  return (
    <article style={{ border: `1.5px solid ${m.borderC}`, background: m.bgC, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, position: "relative" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "4px 8px", flexWrap: "wrap" }}>
          {m.unread && (
            <>
              <span title="Nieprzeczytane" style={{ width: 10, height: 10, borderRadius: "50%", background: "#2F824F", display: "inline-block" }} />
              <span style={visuallyHidden}>Nieprzeczytane</span>
            </>
          )}
          <span className="pill" style={{ background: m.pillBg, color: m.pillFg }}><Icon name={m.typeIcon} size={14} />{m.typeLabel}</span>
          <span style={{ fontSize: 13, color: "#4E5A63", fontWeight: 500 }}>· {m.cat}</span>
        </div>
        <span className="st" style={{ flex: "none", marginTop: 2, background: m.stBg, color: m.stFg }}>{m.statusLabel}</span>
      </div>
      <button className="plain" onClick={() => dispatch({ type: "openMessage", id: m.id })} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: m.titleC }}>{m.title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 500 }}><Icon name="pin" size={18} style={{ color: "#5A6670" }} />{m.place}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5 }}><Icon name="clock" size={18} style={{ color: "#5A6670" }} />{m.when}</span>
        <span style={{ fontSize: 14.5, color: "#3C474C", lineHeight: 1.45 }}>{m.text}</span>
      </button>
      <div style={{ borderTop: "1px solid #E6ECE8", paddingTop: 2 }}>
        <button className="lnk" onClick={() => dispatch({ type: "actOnMessage", id: m.id })}>{m.btn}<Icon name="arrowR" size={18} /></button>
      </div>
    </article>
  );
}
