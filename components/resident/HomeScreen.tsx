"use client";

import { CalendarPreview } from "@/components/resident/start/CalendarPreview";
import { FeaturedSlider } from "@/components/resident/start/FeaturedSlider";
import { ImportantStrip } from "@/components/resident/start/ImportantStrip";
import { PartnersRow, ResidentCardPromo } from "@/components/resident/start/ResidentCard";
import { ServiceChips } from "@/components/resident/start/ServiceChips";
import { TopicsRow } from "@/components/resident/start/TopicsRow";
import { Icon } from "@/components/ui/Icon";
import { useAppActions } from "@/lib/store";

/* Start mieszkańca (wersja start-redesign): „Ważne teraz” → wyszukiwarka → Usługi → wyróżnione
   → tematy → Karta Mieszkańca → partnerzy → Kalendarz gminny. Logika bez zmian – z lib/. */
export function HomeScreen() {
  const { dispatch } = useAppActions();
  return (
    <div style={{ padding: "0 0 32px" }}>
      <ImportantStrip />

      <div style={{ padding: "2px 16px 0" }}>
        <button className="plain" onClick={() => dispatch({ type: "tab", screen: "search" })} style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #CFD8D3", background: "#F5F8F4", borderRadius: 16, padding: "0 16px", minHeight: 52, color: "#5A6670", fontSize: 16 }}>
          <Icon name="search" size={22} style={{ color: "#1F2A2E" }} />
          Szukaj w aplikacji…
        </button>
      </div>

      <ServiceChips />
      <FeaturedSlider />
      <TopicsRow />
      <ResidentCardPromo />
      <PartnersRow />
      <CalendarPreview />
    </div>
  );
}
