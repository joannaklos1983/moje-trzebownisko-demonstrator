/* Wyszukiwanie odporne na polskie znaki i końcówki fleksyjne. */

/** Małe litery, bez znaków diakrytycznych; „ł” nie rozkłada się w NFD, więc zamieniamy je osobno. */
export function normalize(s: string | null | undefined): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l");
}

/** Uproszczony rdzeń słowa: bez ostatniej litery dla słów od 4 znaków. */
export function stem(w: string): string {
  return w.length > 4 ? w.slice(0, w.length - 1) : w.length === 4 ? w.slice(0, 3) : w;
}

/** Każde słowo zapytania (znormalizowanego) musi wystąpić w tekście (znormalizowanym). */
export function matchesAllWords(haystack: string, query: string): boolean {
  return query.split(/\s+/).every((w) => haystack.indexOf(stem(w)) >= 0);
}
