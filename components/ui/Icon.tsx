import type { CSSProperties } from "react";
import { ICONS } from "@/data/icons";
import type { IconName } from "@/types";

export function Icon({ name, size, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  const sized = size ? { width: size, height: size, ...style } : style;
  return (
    <svg className="ic" style={sized} viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}
