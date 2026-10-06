"use client";

import { CampaignForm } from "@/components/admin/CampaignForm";
import { CampaignPreview } from "@/components/admin/CampaignPreview";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { ADMIN_SIDE_MENU } from "@/data/admin";
import { useAppState } from "@/lib/store";

/* Panel administratora (demo): menu jak w obecnym panelu + formularz kampanii + podgląd.
   Współdzieli stan z aplikacją mieszkańca – publikacja jest od razu widoczna w telefonie obok. */
export function AdminPanel() {
  const { adminFlash } = useAppState();
  return (
    <div style={{ flex: 1, minWidth: 0, height: 868, background: "#FFFFFF", borderRadius: 18, border: `2px solid ${adminFlash ? "#137FB0" : "#DFE6E2"}`, display: "flex", overflow: "hidden", boxShadow: "0 8px 24px rgba(31,42,46,.08)" }}>
      <aside style={{ width: 196, flex: "none", borderRight: "1px solid #E6ECE8", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2, background: "#FBFCFB" }}>
        <div style={{ alignSelf: "flex-start", margin: "0 0 16px 4px" }}><Logo height={40} /></div>
        {ADMIN_SIDE_MENU.map((x, i) => (
          <div key={i} className="a-side" style={{ paddingLeft: x.level ? 36 : 10, background: x.level === 2 ? "#E6F2EA" : "transparent", fontWeight: x.level === 2 ? 700 : 500, color: x.level === 2 ? "#1F6B3D" : "#3C474C" }}>
            {x.icon && <Icon name={x.icon} size={16} style={{ color: "#2F824F" }} />}{x.label}
          </div>
        ))}
      </aside>
      <div className="scr" style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", gap: 20, padding: "18px 20px 28px", alignItems: "flex-start" }}>
        <CampaignForm />
        <CampaignPreview />
      </div>
    </div>
  );
}
