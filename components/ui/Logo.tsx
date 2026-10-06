import Image from "next/image";

/* logo.png jest wycięte z makiety – do podmiany na oryginalny plik UGT (Design System 2.1). */
export function Logo({ height }: { height: number }) {
  return (
    <Image
      src="/assets/logo.png"
      alt="Gmina Trzebownisko – Dobry Adres"
      width={389}
      height={115}
      loading="eager"
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
