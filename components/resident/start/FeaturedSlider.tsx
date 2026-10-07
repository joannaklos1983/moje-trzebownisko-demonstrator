"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import { FEATURED_SLIDES, SLIDER_INTERVAL_MS } from "@/data/startV4";
import { useAppActions } from "@/lib/store";

const CONTROL = { width: 44, height: 44, borderRadius: "50%", border: "1.5px solid #DFE6E2", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#1F2A2E", flex: "none" } as const;

/* Wybór pauzy pamiętamy w pamięci karty przeglądarki, żeby nie znikał po przejściu na inny ekran i powrocie. */
let rememberedPause: boolean | null = null;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/* Slider wyróżnionych treści. Przewija się sam, ale ma przycisk pauzy, strzałki i kropki;
   przy ustawieniu „ogranicz ruch” startuje zatrzymany. Treści: data/startV4.ts (DANE DEMO). */
export function FeaturedSlider() {
  const { dispatch } = useAppActions();
  const [index, setIndex] = useState(0);
  /* null = mieszkaniec jeszcze nie wybrał; wtedy decyduje ustawienie systemowe „ogranicz ruch” */
  const [userPaused, setUserPaused] = useState<boolean | null>(rememberedPause);
  const setPaused = (v: boolean) => { rememberedPause = v; setUserPaused(v); };
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
  const paused = userPaused ?? reducedMotion;
  const count = FEATURED_SLIDES.length;
  const slide = FEATURED_SLIDES[index];

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDER_INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, count]);

  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section aria-roledescription="karuzela" aria-label="Wyróżnione" style={{ padding: "14px 16px 0" }}>
      <div data-slide={slide.id} role="group" aria-roledescription="slajd" aria-label={`${index + 1} z ${count}: ${slide.title}`} aria-live={paused ? "polite" : "off"} style={{ border: "1px solid #DFE6E2", borderRadius: 20, overflow: "hidden", background: "#FFFFFF" }}>
        <div style={{ position: "relative" }}>
          <Image src={slide.image} alt={slide.imageAlt} width={860} height={550} sizes="390px" loading="eager" style={{ width: "100%", height: "auto", display: "block", aspectRatio: "860 / 550", objectFit: "cover" }} />
          <span style={{ position: "absolute", left: 12, top: 12, background: "#FFFFFF", color: "#1F6B3D", fontSize: 13, fontWeight: 700, borderRadius: 999, padding: "5px 12px" }}>{slide.badge}</span>
          {slide.imageNote && <span style={{ position: "absolute", right: 10, bottom: 10, fontSize: 11, fontWeight: 600, background: "rgba(31,42,46,.75)", color: "#FFFFFF", borderRadius: 6, padding: "3px 7px" }}>{slide.imageNote}</span>}
        </div>
        <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13.5, color: "#5A6670", fontWeight: 500 }}>{slide.meta}</span>
          <h3 style={{ margin: 0, fontSize: 19, lineHeight: 1.25, fontWeight: 700 }}>{slide.title}</h3>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.45, color: "#3C474C" }}>{slide.text}</p>
          <button onClick={() => dispatch({ type: "openCategory", category: slide.category })} style={{ alignSelf: "flex-start", marginTop: 6, display: "inline-flex", alignItems: "center", gap: 8, border: 0, borderRadius: 12, background: "#E6F2EA", color: "#1F6B3D", fontSize: 15, fontWeight: 700, padding: "0 16px", minHeight: 44 }}>Zobacz szczegóły<Icon name="arrowR" size={18} /></button>
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <button aria-label="Poprzedni slajd" onClick={() => go(index - 1)} style={CONTROL}><Icon name="chevR" style={{ transform: "rotate(180deg)" }} /></button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          {FEATURED_SLIDES.map((s, i) => (
            <button key={s.id} aria-label={`Slajd ${i + 1}: ${s.title}`} aria-current={i === index ? "true" : undefined} onClick={() => go(i)} style={{ width: 28, height: 44, border: 0, background: "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              <span style={{ width: i === index ? 22 : 8, height: 8, borderRadius: 4, background: i === index ? "#2F824F" : "#AEB9B3" }} />
            </button>
          ))}
        </div>
        <button aria-label={paused ? "Wznów przewijanie" : "Zatrzymaj przewijanie"} aria-pressed={paused} onClick={() => setPaused(!paused)} style={CONTROL}>
          {paused ? <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg> : <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14 M15 5v14" /></svg>}
        </button>
        <button aria-label="Następny slajd" onClick={() => go(index + 1)} style={CONTROL}><Icon name="chevR" /></button>
      </div>
    </section>
  );
}
