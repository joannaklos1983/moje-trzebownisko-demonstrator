import type { ReactNode } from "react";

/* Ramka telefonu. Szerokość ekranu 390 px (domyślnie) lub 360 px (kontrola wąskiego ekranu).
   „footer” – element pod telefonem (przycisk panelu administratora). */
export function PhoneFrame({ screenWidth = 390, footer, children }: { screenWidth?: number; footer?: ReactNode; children: ReactNode }) {
  const frameWidth = screenWidth + 24;
  return (
    <div style={{ width: frameWidth, flex: "none", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <div style={{ width: frameWidth, height: 868, borderRadius: 56, background: "#1B2120", padding: 12, boxShadow: "0 18px 40px rgba(31,42,46,.18)" }}>
        <div style={{ width: screenWidth, height: 844, borderRadius: 44, overflow: "hidden", background: "#FFFFFF", position: "relative", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
      {footer}
    </div>
  );
}
