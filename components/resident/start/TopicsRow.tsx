"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { START_TOPICS } from "@/data/startV4";
import { useAppActions, useAppState } from "@/lib/store";

/* „Odkrywaj tematy”: kategorie jako kółka z miniaturą. Kategoria nie jest modułem:
   miniatura i nazwa otwierają Powiadomienia z filtrem kategorii, „Obserwuj” dodaje ją do Ulubionych
   (ten sam stan co ekran Ulubione). Stan obserwowania zawsze ma tekst, nie tylko znaczek. */
export function TopicsRow() {
  const { favs } = useAppState();
  const { dispatch } = useAppActions();
  return (
    <section id="kategorie" aria-labelledby="tematy" style={{ padding: "26px 0 0" }}>
      <h2 id="tematy" className="h2" style={{ fontSize: 20, margin: "0 16px" }}>Odkrywaj tematy</h2>
      <div id="category-list" className="hscroll" style={{ gap: 6, padding: "14px 12px 4px" }}>
        {START_TOPICS.map((t) => {
          const on = favs.indexOf(t.category) >= 0;
          const follow = on ? "Obserwujesz" : "Obserwuj";
          return (
            <div key={t.category} data-topic style={{ flex: "none", width: 92, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <button className="topic-open" aria-label={t.category} onClick={() => dispatch({ type: "openCategory", category: t.category })} style={{ border: 0, background: "none", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%", color: "#1F2A2E" }}>
                <span style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", border: `2px solid ${on ? "#2F824F" : "#DFE6E2"}`, background: "#EEF6F1", display: "flex", alignItems: "center", justifyContent: "center", color: "#2F824F" }}>
                  {t.image
                    ? <Image src={t.image} alt="" width={128} height={128} sizes="64px" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    : <Icon name={t.icon} size={28} />}
                  <span aria-hidden="true" style={{ position: "absolute", top: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: on ? "#2F824F" : "#FFFFFF", color: on ? "#FFFFFF" : "#1F6B3D", border: `1.5px solid ${on ? "#2F824F" : "#9CC8AC"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{on ? <Icon name="check" size={13} /> : "+"}</span>
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{t.label}</span>
              </button>
              <button aria-pressed={on} aria-label={`${follow}: ${t.category}`} onClick={() => dispatch({ type: "toggleFavorite", category: t.category })} style={{ border: 0, background: "none", padding: "0 2px", minHeight: 44, display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12.5, fontWeight: 700, color: on ? "#1F6B3D" : "#3C474C", whiteSpace: "nowrap", textDecoration: on ? "none" : "underline", textUnderlineOffset: 3 }}>
                {follow}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
