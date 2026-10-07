"use client";

import { useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ResidentApp } from "@/components/resident/ResidentApp";
import { DemoBar, ScenarioStrip } from "@/components/shell/DemoBar";
import { PhoneFrame } from "@/components/shell/PhoneFrame";
import { Icon } from "@/components/ui/Icon";

/* Plansza demonstratora. Po otwarciu widać samą aplikację mieszkańca (na środku); panel administratora
   z formularzem kampanii i podpowiedź scenariusza otwiera przycisk pod telefonem. Stan aplikacji
   i panelu pozostaje wspólny – ukrycie panelu niczego nie kasuje. */
export function DemoBoard({ screenWidth }: { screenWidth: number }) {
  const [panelOpen, setPanelOpen] = useState(false);
  return (
    <div style={{ width: 1440, height: 1080, padding: "24px 40px 12px", display: "flex", flexDirection: "column", gap: 18, background: "#E9EDEA" }}>
      <DemoBar />
      {panelOpen && <ScenarioStrip />}
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", justifyContent: panelOpen ? "flex-start" : "center", flex: 1, minHeight: 0 }}>
        <PhoneFrame
          screenWidth={screenWidth}
          footer={
            <button className="tbtn" data-panel-toggle aria-expanded={panelOpen} aria-controls={panelOpen ? "panel-administratora" : undefined}onClick={() => setPanelOpen((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "0 18px", fontSize: 14 }}>
              <Icon name={panelOpen ? "x" : "send"} size={16} />{panelOpen ? "Ukryj panel administratora" : "Panel administratora – dodaj kampanię"}
            </button>
          }
        >
          <ResidentApp />
        </PhoneFrame>
        {panelOpen && <AdminPanel />}
      </div>
    </div>
  );
}
