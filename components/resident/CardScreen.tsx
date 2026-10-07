"use client";

import Image from "next/image";
import { HeroImage } from "@/components/ui/HeroImage";
import { Icon } from "@/components/ui/Icon";
import { CARD_ABOUT, CARD_BENEFITS, CARD_PARTNERS, CARD_STEPS, CARD_WHERE } from "@/data/startV4";
import { useAppActions, useAppState } from "@/lib/store";

/* Karta Mieszkańca – ekran koncepcyjny z treściami PRZYKŁADOWYMI (data/startV4.ts). Karta nie jest
   potwierdzona w obecnym systemie, dlatego ekran opisuje ją jako koncepcję („Dostępna wkrótce”)
   i nie zawiera prawdziwego numeru karty, kodu QR, weryfikacji mieszkańca, konta ani płatności. */
export function CardScreen() {
  const { dispatch } = useAppActions();
  return (
    <div style={{ padding: "18px 20px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ borderRadius: 20, background: "#E6F2EA", padding: 16, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <Image src="/assets/start-v4/karta-mieszkanca.jpg" alt="Wizualizacja Karty Mieszkańca Gminy Trzebownisko z przykładowym imieniem i numerem" width={960} height={532} sizes="350px" loading="eager" style={{ width: "100%", height: "auto", display: "block", borderRadius: 14 }} />
        <span data-card-soon style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FFFFFF", color: "#1F6B3D", border: "1.5px solid #2F824F", borderRadius: 999, padding: "6px 14px", fontSize: 14, fontWeight: 700 }}><Icon name="clock" size={16} />Dostępna wkrótce</span>
      </div>

      <section aria-labelledby="karta-o-programie">
        <h2 id="karta-o-programie" className="h2" style={{ fontSize: 20 }}>O programie</h2>
        <p data-card-about style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.55, color: "#2B3639" }}>{CARD_ABOUT}</p>
      </section>

      <section aria-labelledby="karta-korzysci">
        <h2 id="karta-korzysci" className="h2" style={{ fontSize: 20 }}>Przykładowe korzyści</h2>
        <ul data-card-benefits style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {CARD_BENEFITS.map((b) => (
            <li key={b} style={{ display: "flex", gap: 10, fontSize: 15, lineHeight: 1.45 }}><Icon name="check" style={{ color: "#2F824F", marginTop: 1 }} />{b}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="karta-jak">
        <h2 id="karta-jak" className="h2" style={{ fontSize: 20 }}>Jak uzyskać kartę</h2>
        <p style={{ margin: "6px 0 0", fontSize: 14.5, color: "#5A6670" }}>Przykładowy przebieg – zasady programu nie są jeszcze ustalone.</p>
        <ol data-card-steps style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {CARD_STEPS.map((s, i) => (
            <li key={s} style={{ display: "flex", gap: 12, fontSize: 15, lineHeight: 1.45 }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#2F824F", color: "#FFFFFF", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{i + 1}</span>
              <span style={{ paddingTop: 3 }}>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="partnerzy-karty">
        <h2 id="partnerzy-karty" className="h2" style={{ fontSize: 20 }}>Gdzie można korzystać</h2>
        <p style={{ margin: "6px 0 0", fontSize: 14.5, color: "#5A6670", lineHeight: 1.45 }}>{CARD_WHERE}</p>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {CARD_PARTNERS.map((p) => (
            /* cała karta partnera jest przyciskiem i otwiera szczegół oferty */
            <button key={p.id} className="plain" data-card-partner onClick={() => dispatch({ type: "openPartner", id: p.id })} style={{ border: "1px solid #DFE6E2", borderRadius: 16, overflow: "hidden", background: "#FFFFFF" }}>
              <Image src={p.image} alt={p.imageAlt} width={1672} height={941} sizes="350px" style={{ width: "100%", height: "auto", display: "block" }} />
              <span style={{ padding: "12px 14px 6px", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.3, color: "#1F2A2E" }}>{p.name}</span>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: "#1F6B3D" }}>{p.benefit}</span>
                {p.locality && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#3C474C" }}><Icon name="pin" size={16} style={{ color: "#5A6670" }} />{p.locality}</span>}
                <span style={{ minHeight: 40, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700, color: "#2F824F" }}>Zobacz ofertę<Icon name="arrowR" size={18} /></span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* Szczegół partnera / oferty – dane demonstracyjne z grafik partnerów. */
export function PartnerScreen() {
  const { partnerId } = useAppState();
  const { dispatch } = useAppActions();
  const p = CARD_PARTNERS.find((x) => x.id === partnerId);

  if (!p) {
    return (
      <div style={{ padding: "24px 20px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
        <p role="status" style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>Nie znaleziono partnera.</p>
        <button className="btn2" onClick={() => dispatch({ type: "back" })}>Wróć</button>
      </div>
    );
  }

  return (
    <>
      <HeroImage src={p.image} alt={p.imageAlt} width={1672} height={941} />
      <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", color: "#1F6B3D" }}>PARTNER KARTY MIESZKAŃCA</span>
        <h2 data-partner-name style={{ margin: "-8px 0 0", fontSize: 24, lineHeight: 1.25, fontWeight: 700 }}>{p.name}</h2>
        <div style={{ background: "#F5F8F4", border: "1px solid #DFE6E2", borderRadius: 16, padding: "4px 16px" }}>
          <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: p.locality ? "1px solid #E6ECE8" : undefined }}>
            <Icon name="idcard" style={{ color: "#2F824F", marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 12.5, color: "#5A6670", fontWeight: 600 }}>Zniżka z Kartą Mieszkańca</div>
              <div data-partner-discount style={{ fontSize: 22, fontWeight: 700, marginTop: 2, color: "#1F6B3D" }}>{p.discount}</div>
            </div>
          </div>
          {p.locality && (
            <div style={{ display: "flex", gap: 12, padding: "12px 0" }}>
              <Icon name="pin" style={{ color: "#2F824F", marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12.5, color: "#5A6670", fontWeight: 600 }}>Miejscowość</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{p.locality}</div>
              </div>
            </div>
          )}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>O ofercie</h3>
          <p style={{ margin: "6px 0 0", fontSize: 15.5, lineHeight: 1.55, color: "#2B3639" }}>{p.desc}</p>
        </div>
        <p data-partner-demo style={{ margin: 0, borderRadius: 14, background: "#F5F8F4", padding: "12px 14px", fontSize: 13.5, lineHeight: 1.5, color: "#2B3639" }}>Dane demonstracyjne – oferta przykładowa. Karta Mieszkańca będzie dostępna wkrótce.</p>
        <button className="btn2" style={{ width: "100%" }} onClick={() => dispatch({ type: "goTarget", target: "stub:card" })}>O Karcie Mieszkańca</button>
      </div>
    </>
  );
}
