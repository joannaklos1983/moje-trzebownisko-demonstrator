"use client";

import { Icon } from "@/components/ui/Icon";
import { formToMessage, visibilityNote } from "@/lib/campaign";
import { decorateMessage } from "@/lib/messages";
import { useAppState } from "@/lib/store";

/* Podgląd w aplikacji, legenda oznaczeń i komunikat potwierdzenia.
   Podgląd powstaje z tego samego rekordu, który po publikacji zobaczy mieszkaniec. */
export function CampaignPreview() {
  const state = useAppState();
  const pv = decorateMessage(state, formToMessage(state.form, state.now));

  return (
    <div style={{ width: 236, flex: "none", position: "sticky", top: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ border: "1.5px dashed #D9A441", background: "#FFFBF0", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Podgląd w aplikacji</div>
        <span className="tagn" style={{ alignSelf: "flex-start" }}>DO DODANIA W SYSTEMIE</span>
        <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Ważne teraz</div>
          <div style={{ border: `1px solid ${pv.borderC}`, background: pv.bgC, borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span className="pill" style={{ fontSize: 10.5, padding: "3px 7px", background: pv.pillBg, color: pv.pillFg }}>{pv.typeLabel}</span>
              <span style={{ fontSize: 10.5, color: "#5A6670" }}>· {pv.cat}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{pv.title}</div>
            <div style={{ fontSize: 11, color: "#3C474C", lineHeight: 1.4 }}>{pv.text}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}><Icon name="pin" size={13} style={{ color: "#5A6670" }} />{pv.place}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}><Icon name="clock" size={13} style={{ color: "#5A6670" }} />{pv.when}</div>
            <span style={{ alignSelf: "flex-start", background: "#2F824F", color: "#FFFFFF", fontSize: 11, fontWeight: 700, borderRadius: 8, padding: "6px 10px" }}>{pv.btn} ›</span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 11.5, color: "#3C474C", lineHeight: 1.45 }}>{visibilityNote(state.form)}</p>
      </div>

      <div style={{ border: "1px solid #E6ECE8", borderRadius: 14, padding: "12px 14px", fontSize: 11.5, lineHeight: 1.5, color: "#3C474C", display: "flex", flexDirection: "column", gap: 6 }}>
        <strong style={{ fontSize: 12.5, color: "#1F2A2E" }}>Oznaczenia</strong>
        <span>Elementy w <strong>przerywanej bursztynowej ramce</strong> to nowe pola względem obecnego formularza.</span>
        <span><span className="tagn" style={{ fontSize: 10 }}>DO DODANIA W SYSTEMIE</span> – funkcja do zlecenia dostawcy.</span>
        <span><span className="tag" style={{ fontSize: 10 }}>DO SPRAWDZENIA</span> – wymaga potwierdzenia u dostawcy.</span>
      </div>

      {state.toast && (
        <div role="status" style={{ borderRadius: 14, background: "#1F2A2E", color: "#FFFFFF", padding: "12px 14px", fontSize: 12.5, lineHeight: 1.5, display: "flex", gap: 10 }}>
          <Icon name="check" size={18} style={{ color: "#BADC60" }} /><span>{state.toast}</span>
        </div>
      )}
    </div>
  );
}
