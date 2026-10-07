import type { Category, IconName } from "../types";

/* Dane nowego ekranu Start (gałąź start-redesign). To DEMONSTRATOR – treści pochodzą z grafik
   przekazanych do projektu i nie są potwierdzonymi komunikatami Gminy.
   DO SPRAWDZENIA: slajdy powinny docelowo być kampaniami (jeden rekord zasila slider, Powiadomienia
   i Kalendarz). Na razie przycisk slajdu otwiera Powiadomienia z filtrem kategorii slajdu. */

export interface FeaturedSlide {
  id: string;
  image: string;
  imageAlt: string;
  /** Krótka etykieta na zdjęciu. */
  badge: string;
  /** Istniejąca kategoria komunikatów – cel przycisku „Zobacz szczegóły”. */
  category: Category;
  meta: string;
  title: string;
  text: string;
  /** Oznaczenie materiału ilustracyjnego (Design System 6.4 / 7.2). */
  imageNote?: string;
}

export const FEATURED_SLIDES: FeaturedSlide[] = [
  {
    id: "aed", image: "/assets/start-v4/slider-aed.png", badge: "Edukacja", category: "Edukacja",
    imageAlt: "Plansza „Bezpieczniej w gminnych szkołach”: defibrylatory AED i apteczki dla 10 szkół i przedszkoli",
    meta: "Edukacja · 10 szkół i przedszkoli", title: "Defibrylatory AED w gminnych szkołach",
    text: "Dzięki darowiźnie firmy LPP szkoły i przedszkola w gminie otrzymają defibrylatory AED oraz apteczki.",
  },
  {
    id: "sport", image: "/assets/start-v4/slider-sport.png", badge: "Sport", category: "Sport i OSiR",
    imageAlt: "Plansza „Gramy razem”: dzieci grające w piłkę nożną na stadionie w Wólce Podleśnej",
    meta: "Sport · Stadion w Wólce Podleśnej", title: "Treningi piłki nożnej dla dzieci",
    text: "Organizator: LKS „Leśna” Wólka Podleśna. Terminy i godziny treningów u organizatora.",
  },
  {
    /* DO SPRAWDZENIA: termin z grafiki (3 października 2026) jest wcześniejszy niż dzień demo (6 października). */
    id: "mammografia", image: "/assets/start-v4/slider-mammografia.png", badge: "Zdrowie", category: "Zdrowie",
    imageAlt: "Plansza „Bezpłatna mammografia w Trzebownisku”: 3 października 2026, godz. 9:00–15:00, przy siedzibie OSP Trzebownisko",
    meta: "Zdrowie · Trzebownisko", title: "Bezpłatna mammografia w Trzebownisku",
    text: "3 października 2026, godz. 9:00–15:00, przy siedzibie OSP Trzebownisko. Rejestracja: 42 254 64 17.",
  },
  {
    /* DO SPRAWDZENIA: grafika nie ma tytułu ani opisu – tekst jest ogólnym wejściem do kategorii, nie informacją o konkretnej inwestycji. */
    id: "inwestycje", image: "/assets/start-v4/slider-inwestycje.jpg", badge: "Inwestycje", category: "Drogi, transport i inwestycje",
    imageAlt: "Wizualizacja parku: alejki, latarnie, ławki i plac zabaw",
    meta: "Inwestycje · Gmina Trzebownisko", title: "Inwestycje w gminie",
    text: "Sprawdź informacje o inwestycjach i remontach w Twojej okolicy.",
    imageNote: "Wizualizacja poglądowa",
  },
];

/** Czas pokazywania slajdu przy automatycznym przewijaniu. */
export const SLIDER_INTERVAL_MS = 6000;

/* „Odkrywaj tematy”: istniejące kategorie główne w kolejności z referencji, z krótką nazwą i miniaturą. */
export interface StartTopic {
  category: Category;
  label: string;
  image?: string;
  icon: IconName;
}

export const START_TOPICS: StartTopic[] = [
  { category: "Sport i OSiR", label: "Sport", image: "/assets/start-v4/slider-sport.png", icon: "sport" },
  { category: "Zdrowie", label: "Zdrowie", image: "/assets/start-v4/slider-mammografia.png", icon: "heart" },
  { category: "Drogi, transport i inwestycje", label: "Inwestycje", image: "/assets/start-v4/slider-inwestycje.jpg", icon: "road" },
  { category: "Wydarzenia i kultura", label: "Wydarzenia", icon: "ticket" },
  { category: "Edukacja", label: "Edukacja", icon: "edu" },
  { category: "Urząd / dla mieszkańca", label: "Urząd", icon: "office" },
];

/* Usługi na Starcie: kolejność z referencji. Powiadomienia mają wejście przez dzwonek. */
export const START_SERVICE_ORDER: string[] = ["reports", "evoting", "card", "waste"];

/* Partnerzy Karty Mieszkańca – DANE DEMO. Karta Mieszkańca i program partnerski nie są potwierdzone
   w obecnym systemie (DO SPRAWDZENIA); nazwy i zniżki pochodzą z przykładowych grafik.
   DO SPRAWDZENIA: miejscowości salonu i restauracji; grafika partnera „Kort tenisowy” z referencji nie została dostarczona. */
export interface CardPartner {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  locality?: string;
}

export const CARD_PARTNERS: CardPartner[] = [
  { id: "basen", name: "Basen", image: "/assets/start-v4/partner-basen.png", imageAlt: "Basen – 15% zniżki z Kartą Mieszkańca", locality: "Trzebownisko" },
  { id: "salon", name: "Salon kosmetyczny Agnieszka", image: "/assets/start-v4/partner-salon.png", imageAlt: "Salon kosmetyczny Agnieszka – 10% zniżki z Kartą Mieszkańca" },
  { id: "restauracja", name: "Restauracja Szamka", image: "/assets/start-v4/partner-restauracja.png", imageAlt: "Restauracja Szamka – 15% zniżki z Kartą Mieszkańca" },
];
