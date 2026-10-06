/* TYMCZASOWE (migracja): zastępuje ekrany, które nie zostały jeszcze przeniesione
   z demonstratora referencyjnego. Tytuł i „Wróć” są w nagłówku podstrony.
   Do usunięcia po przeniesieniu wszystkich ekranów. */
export function PendingScreen() {
  return (
    <div style={{ padding: "24px 20px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <span className="tag" style={{ alignSelf: "flex-start" }}>MIGRACJA W TOKU</span>
      <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.55 }}>Ten ekran działa w demonstratorze referencyjnym. Do nowej aplikacji zostanie przeniesiony w kolejnym etapie.</p>
    </div>
  );
}
