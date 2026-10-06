"use client";

import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { useAppActions } from "@/lib/store";

/* Ekran wejściowy. Logowanie jest wyłącznie demonstracyjne: „Zaloguj się” prowadzi na Start. */
export function EntryScreen() {
  const { dispatch } = useAppActions();
  return (
    <div style={{ height: 844, display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
      <div style={{ position: "relative", height: 430, flex: "none", overflow: "hidden" }}>
        <Image
          src="/assets/hero.jpg"
          alt="Rodzina na rowerach na ścieżce wśród pól, w tle lotnisko"
          width={780}
          height={1040}
          loading="eager"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 62%", display: "block" }}
        />
        <div style={{ position: "absolute", top: 46, left: "50%", transform: "translateX(-50%)", background: "#FFFFFF", borderRadius: 18, padding: "10px 16px", display: "flex" }}>
          <Logo height={60} />
        </div>
        <span style={{ position: "absolute", right: 12, bottom: 40, fontSize: 11, fontWeight: 600, background: "rgba(31,42,46,.75)", color: "#FFFFFF", borderRadius: 6, padding: "3px 7px" }}>Wizualizacja poglądowa (AI)</span>
      </div>
      <div style={{ marginTop: -28, position: "relative", background: "#FFFFFF", borderRadius: "28px 28px 0 0", padding: "32px 24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2, fontWeight: 700 }}>
          Witaj w aplikacji
          <br />
          <span style={{ color: "#2F824F" }}>Moje Trzebownisko</span>
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.5, color: "#3C474C" }}>Najważniejsze informacje i sprawy Gminy w jednym miejscu.</p>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn" style={{ width: "100%", minHeight: 54 }} onClick={() => dispatch({ type: "login" })}>Zaloguj się</button>
          <button className="btn2" style={{ width: "100%", minHeight: 54 }} onClick={() => dispatch({ type: "openStub", key: "register" })}>Załóż konto</button>
          <button className="lnk" style={{ alignSelf: "center", textDecoration: "underline", textUnderlineOffset: 4 }} onClick={() => dispatch({ type: "openStub", key: "about" })}>Zobacz, co oferuje aplikacja</button>
        </div>
      </div>
    </div>
  );
}
