import Image from "next/image";

/* Duża grafika na górze ekranu szczegółu (od krawędzi do krawędzi). Etykieta na grafice jest tekstem,
   więc informacja nie zależy od samego obrazu. „note” oznacza materiał poglądowy (Design System 7.2). */
export function HeroImage({ src, alt, width, height, badge, note }: { src: string; alt: string; width: number; height: number; badge?: string; note?: string }) {
  return (
    <div data-hero style={{ position: "relative", background: "#EEF2EF" }}>
      <Image src={src} alt={alt} width={width} height={height} sizes="390px" loading="eager" style={{ width: "100%", height: "auto", display: "block", aspectRatio: `${width} / ${height}`, objectFit: "cover" }} />
      {badge && <span data-hero-badge style={{ position: "absolute", left: 12, top: 12, background: "#FFFFFF", color: "#1F6B3D", fontSize: 13, fontWeight: 700, borderRadius: 999, padding: "5px 12px", maxWidth: "calc(100% - 24px)" }}>{badge}</span>}
      {note && <span data-hero-note style={{ position: "absolute", right: 10, bottom: 10, fontSize: 11, fontWeight: 600, background: "rgba(31,42,46,.75)", color: "#FFFFFF", borderRadius: 6, padding: "3px 7px" }}>{note}</span>}
    </div>
  );
}
