"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { CARD_PARTNERS } from "@/data/startV4";

/* Karta Mieszkańca – ekran koncepcyjny. Karta nie jest potwierdzona w obecnym systemie, dlatego ekran
   opisuje ją jako koncepcję („Dostępna wkrótce”) i nie zawiera prawdziwego numeru karty, kodu QR,
   weryfikacji mieszkańca, konta ani płatności. Partnerzy i zniżki to dane demonstracyjne z grafik. */
export function CardScreen() {
  return (
    <div style={{ padding: "18px 20px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ borderRadius: 20, background: "#E6F2EA", padding: 16, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <Image src="/assets/start-v4/karta-mieszkanca.jpg" alt="Wizualizacja Karty Mieszkańca Gminy Trzebownisko z przykładowym imieniem i numerem" width={960} height={532} sizes="350px" loading="eager" style={{ width: "100%", height: "auto", display: "block", borderRadius: 14 }} />
        <span data-card-soon style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FFFFFF", color: "#1F6B3D", border: "1.5px solid #2F824F", borderRadius: 999, padding: "6px 14px", fontSize: 14, fontWeight: 700 }}><Icon name="clock" size={16} />Dostępna wkrótce</span>
      </div>

      <div>
        <h2 className="h2" style={{ fontSize: 20 }}>O programie</h2>
        <p data-card-about style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.55, color: "#2B3639" }}>Karta Mieszkańca to koncepcja jednego miejsca, w którym mieszkaniec mógłby korzystać z lokalnych benefitów i ofert partnerów programu. Zakres funkcji oraz sposób integracji z obecnym systemem wymagają potwierdzenia.</p>
      </div>

      <section aria-labelledby="partnerzy-karty">
        <h2 id="partnerzy-karty" className="h2" style={{ fontSize: 20 }}>Partnerzy Karty Mieszkańca</h2>
        <p style={{ margin: "6px 0 0", fontSize: 14.5, color: "#5A6670" }}>Przykładowe korzyści u partnerów programu.</p>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {CARD_PARTNERS.map((p) => (
            <article key={p.id} data-card-partner style={{ border: "1px solid #DFE6E2", borderRadius: 16, overflow: "hidden", background: "#FFFFFF" }}>
              <Image src={p.image} alt={p.imageAlt} width={1672} height={941} sizes="350px" style={{ width: "100%", height: "auto", display: "block" }} />
              <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
                <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, lineHeight: 1.3 }}>{p.name}</h3>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: "#1F6B3D" }}>{p.benefit}</span>
                {p.locality && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#3C474C" }}><Icon name="pin" size={16} style={{ color: "#5A6670" }} />{p.locality}</span>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
