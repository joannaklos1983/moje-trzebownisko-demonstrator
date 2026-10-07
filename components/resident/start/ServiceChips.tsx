"use client";

import { Icon } from "@/components/ui/Icon";
import { visuallyHidden } from "@/components/ui/VisuallyHidden";
import { SERVICES } from "@/data/services";
import { START_SERVICE_ORDER } from "@/data/startV4";
import { useAppActions } from "@/lib/store";

/* Usługi = „co mogę zrobić?”. Przewijany poziomo rząd przycisków; zestaw i cele z data/services.ts,
   kolejność na Starcie z data/startV4.ts. */
export function ServiceChips() {
  const { dispatch } = useAppActions();
  const services = START_SERVICE_ORDER.map((id) => SERVICES.find((s) => s.id === id)).filter((s) => !!s);
  return (
    <section aria-labelledby="uslugi" style={{ padding: "12px 0 0" }}>
      <h2 id="uslugi" style={visuallyHidden}>Usługi</h2>
      <div className="hscroll" style={{ gap: 8, padding: "0 16px 4px" }}>
        {services.map((x) => (
          <button key={x.id} onClick={() => dispatch({ type: "goTarget", target: x.target })} style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 8, border: 0, borderRadius: 14, background: "#2F824F", color: "#FFFFFF", fontSize: 16, fontWeight: 700, padding: "0 16px", minHeight: 48, whiteSpace: "nowrap" }}>
            <Icon name={x.icon} size={20} />{x.label.replace("­", "")}
          </button>
        ))}
      </div>
    </section>
  );
}
