import type { CSSProperties } from "react";

/* Tekst tylko dla czytników ekranu. */
export const visuallyHidden: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" };
