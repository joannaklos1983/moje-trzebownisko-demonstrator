"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { DEFAULT_SERVICE_VARIANT, DEFAULT_TILE_STYLE, SERVICES, TONES } from "@/data/services";
import { useAppActions } from "@/lib/store";

/* Usługi = „co mogę zrobić?”. Zestaw kafli pochodzi z data/services.ts. */
export function ServicesGrid() {
  const { dispatch } = useAppActions();
  const tones = TONES[DEFAULT_TILE_STYLE];
  const services = SERVICES.filter((x) => DEFAULT_SERVICE_VARIANT === "A" || !x.onlyVariantA);

  return (
    <section style={{ padding: "30px 20px 0" }}>
      <h2 className="h2">Usługi</h2>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        {services.map((x, i) => {
          const t = tones[x.tone];
          /* ostatni kafel przy nieparzystej liczbie zajmuje całą szerokość */
          const last = i === services.length - 1 && services.length % 2 === 1;
          if (x.image) {
            /* kafel-grafika: sama grafika, informacja o dostępności naniesiona na grafikę */
            return (
              <button key={x.id} aria-label={x.note ? `${x.label} – ${x.note}` : x.label} onClick={() => dispatch({ type: "goTarget", target: x.target })} style={{ gridColumn: last ? "span 2" : "span 1", position: "relative", display: "block", padding: 0, border: `1.5px solid ${t.border}`, borderRadius: 16, overflow: "hidden", background: t.bg }}>
                <Image src={x.image.src} alt="" width={x.image.width} height={x.image.height} style={{ width: "100%", height: "auto", display: "block" }} />
                {x.note && <span style={{ position: "absolute", right: 10, bottom: 10, fontSize: 13.5, fontWeight: 700, background: "#FFFFFF", color: "#1F2A2E", borderRadius: 999, padding: "6px 12px", lineHeight: 1.2 }}>{x.note}</span>}
              </button>
            );
          }
          return (
            <button key={x.id} onClick={() => dispatch({ type: "goTarget", target: x.target })} style={{ gridColumn: last ? "span 2" : "span 1", background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 16, padding: 14, minHeight: 112, display: "flex", flexDirection: last ? "row" : "column", alignItems: last ? "center" : "flex-start", gap: 12, textAlign: "left", color: t.fg }}>
              <span style={{ width: 52, height: 52, borderRadius: 12, background: t.iconBg, color: t.iconFg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={x.icon} size={28} /></span>
              <span style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.2 }}>{x.label}</span>
                {x.badge && <span className="tag">{x.badge}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
