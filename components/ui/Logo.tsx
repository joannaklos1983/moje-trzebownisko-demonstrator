import Image from "next/image";

/* logo.png jest wycięte z makiety – do podmiany na oryginalny plik UGT (Design System 2.1).
   fluid: logo zmniejsza się proporcjonalnie, gdy w wierszu brakuje miejsca (nigdy się nie rozciąga). */
export function Logo({ height, fluid }: { height: number; fluid?: boolean }) {
  return (
    <Image
      src="/assets/logo.png"
      alt="Gmina Trzebownisko – Dobry Adres"
      width={389}
      height={115}
      loading="eager"
      style={fluid ? { width: "100%", maxWidth: Math.round((height * 389) / 115), height: "auto", display: "block" } : { height, width: "auto", display: "block" }}
    />
  );
}
