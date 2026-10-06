import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moje Trzebownisko – demonstrator",
  description:
    "Demonstrator funkcjonalny aplikacji Moje Trzebownisko. Prototyp / koncepcja, dane przykładowe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
