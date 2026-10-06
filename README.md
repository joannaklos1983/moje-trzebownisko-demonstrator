# Moje Trzebownisko – demonstrator (Next.js)

Status: **PROTOTYP / KONCEPCJA**. Migracja 1:1 demonstratora z Claude Design do Next.js + TypeScript.
Wersja referencyjna (zamrożona): `../moje-trzebownisko-demonstrator/`.

Stan: etap 5C – działają ekran wejściowy, Start mieszkańca, Powiadomienia, szczegół komunikatu,
panel administratora z publikacją kampanii oraz pasek „Czas demo” (7:30 / 10:30 / 15:00) i „Resetuj demo”.
Odpady, Zgłoszenia, Szukaj, Ulubione, Profil i zaślepki modułów pokazują jeszcze planszę „MIGRACJA W TOKU”.

Świadome zmiany względem demonstratora referencyjnego: nasycone kafle Usług, kafel Karty Mieszkańca z grafiką,
zielona ramka „Ważne teraz” (czerwona tylko dla Alertu RCB), Kategorie jako lista z gwiazdką Ulubionych.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:3000  (http://localhost:3000/?w=360 – ekran telefonu 360 px)
npm run build    # kompilacja produkcyjna
npm run lint     # ESLint
npm test         # testy logiki (Vitest)
```

Test zgodności z demonstratorem referencyjnym (`tests/logic/reference-parity.test.ts`) uruchamia się tylko wtedy,
gdy obok tego katalogu leży `moje-trzebownisko-demonstrator/`. Bez niego jest pomijany.

## Struktura

```
app/                 layout (lang="pl", Montserrat), strona startowa, globals.css z tokenami UGT
components/shell/    pasek demonstratora, ramka telefonu
components/resident/ ekrany aplikacji mieszkańca
components/admin/    panel administratora
components/ui/       wspólne elementy interfejsu
data/                dane demonstracyjne i konfiguracja (usługi, kategorie, komunikaty)
lib/                 logika: status, sortowanie, kampania, wyszukiwanie
types/               typy TypeScript
public/assets/       logo.png, hero.jpg (skopiowane z wersji referencyjnej)
tests/               testy regresyjne
```

## Zasady

- Zwykły CSS, bez Tailwind. Kolory i font zgodnie z UGT Design System v2.0.
- Bez backendu, bazy danych i prawdziwego logowania. Dane wyłącznie demonstracyjne.
- Funkcje niepotwierdzone w obecnym systemie oznaczamy „DO SPRAWDZENIA”.
- `logo.png` jest wycięte z makiety – do podmiany na oryginalny plik UGT.
- `hero.jpg` to wizualizacja AI – zawsze z oznaczeniem na ekranie.
