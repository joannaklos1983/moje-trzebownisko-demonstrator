"use client";

import { Icon } from "@/components/ui/Icon";
import { CATEGORY_ICON, MAIN_CATEGORIES } from "@/data/categories";
import { useAppActions } from "@/lib/store";

/* Kategorie = „czego szukam / co mnie interesuje?”. Nie są modułami: filtrują Powiadomienia.
   Zestaw pochodzi z data/categories.ts. */
export function CategoryChips() {
  const { dispatch } = useAppActions();
  return (
    <section style={{ padding: "30px 20px 0" }}>
      <h2 className="h2">Kategorie</h2>
      <p style={{ margin: "6px 0 0", fontSize: 14.5, color: "#5A6670" }}>Przeglądaj informacje według tematu</p>
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10 }}>
        {MAIN_CATEGORIES.map((c, i) => {
          const blue = i % 2 === 1;
          return (
            <button key={c} className="chip" onClick={() => dispatch({ type: "openCategory", category: c })} style={{ background: blue ? "#EAF4FA" : "#EEF6F1", border: `1.5px solid ${blue ? "#BFDCEB" : "#C9E0D1"}`, color: "#1F2A2E" }}>
              <Icon name={CATEGORY_ICON[c]} size={18} style={{ color: blue ? "#137FB0" : "#2F824F" }} />{c}
            </button>
          );
        })}
      </div>
    </section>
  );
}
