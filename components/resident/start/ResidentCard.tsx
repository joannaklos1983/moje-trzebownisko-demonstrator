"use client";

import Image from "next/image";
import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { CARD_PARTNERS } from "@/data/startV4";
import { useAppActions } from "@/lib/store";

const ARROW = { width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #DFE6E2", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#1F2A2E", flex: "none" } as const;

/* Karta Mieszkańca na Starcie. Karta nie jest potwierdzona w obecnym systemie – przyciski prowadzą
   do ekranu Karty, który opisuje jej status (DO SPRAWDZENIA). */
export function ResidentCardPromo() {
  const { dispatch } = useAppActions();
  return (
    <section aria-labelledby="karta" style={{ padding: "26px 16px 0" }}>
      <div style={{ borderRadius: 20, background: "#E6F2EA", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Image src="/assets/start-v4/karta-mieszkanca.jpg" alt="Wizualizacja Karty Mieszkańca Gminy Trzebownisko" width={960} height={532} sizes="358px" style={{ width: "100%", height: "auto", display: "block", borderRadius: 14 }} />
        <span style={{ marginTop: 6, fontSize: 12, fontWeight: 700, letterSpacing: ".06em", color: "#1F6B3D" }}>PROGRAM DLA MIESZKAŃCÓW</span>
        <h2 id="karta" style={{ margin: 0, fontSize: 21, fontWeight: 700 }}>Karta Mieszkańca</h2>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.45, color: "#3C474C" }}>Sprawdź, jak uzyskać kartę i gdzie możesz z niej skorzystać.</p>
        <button className="btn" style={{ alignSelf: "flex-start", marginTop: 6, padding: "12px 18px", fontSize: 15 }} onClick={() => dispatch({ type: "goTarget", target: "stub:card" })}>Poznaj Kartę</button>
      </div>
    </section>
  );
}

/* Partnerzy Karty Mieszkańca – DANE DEMO (data/startV4.ts). */
export function PartnersRow() {
  const { dispatch } = useAppActions();
  const row = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => row.current?.scrollBy({ left: dir * 270, behavior: "smooth" });
  return (
    <section aria-labelledby="partnerzy" style={{ padding: "26px 0 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "0 16px" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
          <h2 id="partnerzy" className="h2" style={{ fontSize: 17 }}>Partnerzy Karty Mieszkańca</h2>
          <span className="tag">DANE DEMO</span>
        </div>
        <button aria-label="Poprzedni partnerzy" onClick={() => scroll(-1)} style={ARROW}><Icon name="chevR" size={18} style={{ transform: "rotate(180deg)" }} /></button>
        <button aria-label="Następni partnerzy" onClick={() => scroll(1)} style={ARROW}><Icon name="chevR" size={18} /></button>
      </div>
      <div ref={row} className="hscroll" style={{ gap: 12, padding: "12px 16px 4px" }}>
        {CARD_PARTNERS.map((p) => (
          <button key={p.id} data-partner className="plain" onClick={() => dispatch({ type: "goTarget", target: "stub:card" })} style={{ flex: "none", width: 258, border: "1px solid #DFE6E2", borderRadius: 16, overflow: "hidden", background: "#FFFFFF" }}>
            <Image src={p.image} alt={p.imageAlt} width={1672} height={941} sizes="258px" style={{ width: "100%", height: "auto", display: "block" }} />
            <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", minHeight: 48, fontSize: 14 }}>
              {p.locality && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#3C474C" }}><Icon name="pin" size={16} style={{ color: "#5A6670" }} />{p.locality}</span>}
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#1F6B3D" }}>Zobacz szczegóły<Icon name="arrowR" size={17} /></span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
