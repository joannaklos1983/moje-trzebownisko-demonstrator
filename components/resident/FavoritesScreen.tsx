"use client";

import { Icon } from "@/components/ui/Icon";
import { CATEGORY_ICON, MAIN_CATEGORIES } from "@/data/categories";
import { decorateMessage, favoriteFeed } from "@/lib/messages";
import { useAppActions, useAppState } from "@/lib/store";

/* Ulubione: obserwowane kategorie i najnowsze treści z tych kategorii.
   Ten sam stan co gwiazdki na Starcie (☆ Dodaj do ulubionych / ★ Obserwujesz) i te same rekordy
   co w Powiadomieniach – bez kopii treści.
   Obserwowanie kategorii nie włącza push / SMS / e-mail. „Powiadamiaj mnie” o nowych treściach
   z ulubionych kategorii to osobna funkcja – DO SPRAWDZENIA u dostawcy, dlatego nie jest tu pokazana. */
export function FavoritesScreen() {
  const state = useAppState();
  const { dispatch } = useAppActions();
  /* kolejność jak na Starcie */
  const watched = MAIN_CATEGORIES.filter((c) => state.favs.indexOf(c) >= 0);
  const feed = favoriteFeed(state).map((m) => decorateMessage(state, m));

  const goToCategories = () => {
    dispatch({ type: "tab", screen: "home" });
    /* po przejściu na Start przewijamy ekran telefonu do sekcji Kategorie */
    window.setTimeout(() => {
      const el = document.getElementById("kategorie");
      const scr = el?.closest(".scr");
      if (el && scr) scr.scrollTop = el.offsetTop - 80;
    }, 80);
  };

  return (
    <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ margin: 0, fontSize: 15, color: "#3C474C", lineHeight: 1.5 }}>Twoje obserwowane tematy i najnowsze informacje</p>

      {watched.length === 0 ? (
        <div data-empty style={{ border: "1.5px dashed #CFD8D3", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Nie obserwujesz jeszcze żadnej kategorii.</p>
          <p style={{ margin: 0, fontSize: 14.5, color: "#3C474C", lineHeight: 1.5 }}>Wróć na Start i wybierz „Obserwuj” przy interesującym Cię temacie.</p>
          <button className="btn" style={{ width: "100%", marginTop: 4 }} onClick={goToCategories}>Przejdź do kategorii</button>
        </div>
      ) : (
        <>
          <section aria-label="Obserwowane kategorie">
            <h2 className="h2" style={{ fontSize: 20 }}>Obserwowane kategorie</h2>
            <div id="favorite-categories" style={{ marginTop: 12, border: "1.5px solid #DFE6E2", borderRadius: 16, overflow: "hidden", background: "#FFFFFF" }}>
              {watched.map((c, i) => {
                const blue = MAIN_CATEGORIES.indexOf(c) % 2 === 1;
                return (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px 8px 12px", borderTop: i ? "1px solid #E6ECE8" : undefined }}>
                    <button className="row" onClick={() => dispatch({ type: "openCategory", category: c })} style={{ flex: 1, minWidth: 0, width: "auto", minHeight: 52, borderRadius: 12 }}>
                      <span style={{ width: 44, height: 44, borderRadius: 12, background: blue ? "#137FB0" : "#2F824F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={CATEGORY_ICON[c]} size={24} /></span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: "#1F2A2E" }}>{c}</span>
                    </button>
                    <button aria-label={`Przestań obserwować: ${c}`} onClick={() => dispatch({ type: "toggleFavorite", category: c })} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #CFD8D3", background: "#FFFFFF", color: "#1F2A2E", borderRadius: 999, padding: "6px 12px", minHeight: 44, maxWidth: 132, fontSize: 13, fontWeight: 700, lineHeight: 1.2, textAlign: "left", flex: "none" }}>
                      <Icon name="x" size={15} />Przestań obserwować
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-label="Najnowsze dla Ciebie">
            <h2 className="h2" style={{ fontSize: 20 }}>Najnowsze dla Ciebie</h2>
            <div id="favorite-feed" style={{ marginTop: 8 }}>
              {feed.map((m) => (
                <button key={m.id} className="row" data-feed onClick={() => dispatch({ type: "openMessage", id: m.id })} style={{ borderBottom: "1px solid #E6ECE8", padding: "12px 0" }}>
                  <span style={{ width: 42, height: 42, borderRadius: 12, background: "#EEF6F1", color: "#2F824F", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={m.catIcon} /></span>
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{m.title}</span>
                    <span style={{ fontSize: 13, color: "#5A6670" }}>{m.cat} · {m.when}</span>
                  </span>
                  <Icon name="chevR" style={{ color: "#3C474C" }} />
                </button>
              ))}
              {feed.length === 0 && <p style={{ margin: "8px 0 0", fontSize: 14.5, color: "#3C474C" }}>Brak aktualnych treści w obserwowanych kategoriach.</p>}
            </div>
          </section>

          <p style={{ margin: 0, borderRadius: 14, background: "#F5F8F4", padding: "12px 14px", fontSize: 13.5, lineHeight: 1.5, color: "#2B3639" }}>Obserwowanie kategorii nie włącza powiadomień push, SMS ani e-mail.</p>
        </>
      )}
    </div>
  );
}
