"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES_COLLAPSED_COUNT, CATEGORY_ICON, MAIN_CATEGORIES } from "@/data/categories";
import { useAppActions, useAppState } from "@/lib/store";

/* Kategorie = „czego szukam / co mnie interesuje?”. Nie są modułami:
   nazwa otwiera Powiadomienia przefiltrowane kategorią, gwiazdka dodaje kategorię do Ulubionych.
   Obserwowanie kategorii nie włącza powiadomień push, SMS ani e-mail – informacja o tym
   będzie na ekranie Ulubione / w ustawieniach powiadomień, nie na Starcie.
   Zestaw i kolejność pochodzą z data/categories.ts. */
export function CategoryList() {
  const { favs } = useAppState();
  const { dispatch } = useAppActions();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? MAIN_CATEGORIES : MAIN_CATEGORIES.slice(0, CATEGORIES_COLLAPSED_COUNT);
  const canExpand = MAIN_CATEGORIES.length > CATEGORIES_COLLAPSED_COUNT;

  return (
    <section style={{ padding: "30px 20px 0" }}>
      <h2 className="h2">Kategorie</h2>
      <p style={{ margin: "6px 0 0", fontSize: 14.5, color: "#5A6670" }}>Przeglądaj informacje według tematu</p>

      <div id="category-list" style={{ marginTop: 14, border: "1.5px solid #DFE6E2", borderRadius: 16, overflow: "hidden", background: "#FFFFFF" }}>
        {visible.map((c, i) => {
          const blue = MAIN_CATEGORIES.indexOf(c) % 2 === 1;
          const on = favs.indexOf(c) >= 0;
          const starText = on ? "Obserwujesz" : "Dodaj do ulubionych";
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px 8px 12px", borderTop: i ? "1px solid #E6ECE8" : undefined }}>
              <button className="row" onClick={() => dispatch({ type: "openCategory", category: c })} style={{ flex: 1, minWidth: 0, width: "auto", minHeight: 52, borderRadius: 12 }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: blue ? "#137FB0" : "#2F824F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={CATEGORY_ICON[c]} size={24} /></span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: "#1F2A2E" }}>{c}</span>
              </button>
              {/* stan obserwowania zawsze opisany tekstem, nie tylko kolorem i ikoną */}
              <button aria-pressed={on} aria-label={`${starText}: ${c}`} onClick={() => dispatch({ type: "toggleFavorite", category: c })} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #2F824F", background: on ? "#2F824F" : "#FFFFFF", color: on ? "#FFFFFF" : "#23673D", borderRadius: 999, padding: "6px 12px", minHeight: 44, maxWidth: 132, fontSize: 13, fontWeight: 700, lineHeight: 1.2, textAlign: "left", flex: "none" }}>
                <Icon name="star" size={16} style={{ fill: on ? "#FFFFFF" : "none" }} />{starText}
              </button>
            </div>
          );
        })}
      </div>

      {canExpand && (
        <button className="lnk" aria-expanded={expanded} aria-controls="category-list" onClick={() => setExpanded(!expanded)} style={{ marginTop: 6 }}>
          {expanded ? "Zwiń kategorie" : "Pokaż wszystkie kategorie"}
          <Icon name="chevD" size={18} style={{ transform: expanded ? "rotate(180deg)" : undefined }} />
        </button>
      )}
    </section>
  );
}
