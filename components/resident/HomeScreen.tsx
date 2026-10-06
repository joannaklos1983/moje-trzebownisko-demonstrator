"use client";

import { CategoryChips } from "@/components/resident/CategoryChips";
import { ImportantNow } from "@/components/resident/ImportantNow";
import { LocalitySelect } from "@/components/resident/LocalitySelect";
import { ServicesGrid } from "@/components/resident/ServicesGrid";
import { Icon } from "@/components/ui/Icon";
import { useAppActions } from "@/lib/store";

/* Pulpit mieszkańca: miejscowość → wyszukiwarka → „Ważne teraz” → Usługi → Kategorie. */
export function HomeScreen() {
  const { dispatch } = useAppActions();
  return (
    <div style={{ padding: "0 0 32px" }}>
      <LocalitySelect />

      <div style={{ padding: "12px 20px 0" }}>
        <button className="plain" onClick={() => dispatch({ type: "tab", screen: "search" })} style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #CFD8D3", background: "#F5F8F4", borderRadius: 16, padding: "0 18px", minHeight: 56, color: "#5A6670", fontSize: 16 }}>
          <Icon name="search" size={22} style={{ color: "#1F2A2E" }} />
          Szukaj informacji, usług i miejsc
        </button>
      </div>

      <ImportantNow />
      <ServicesGrid />
      <CategoryChips />
    </div>
  );
}
