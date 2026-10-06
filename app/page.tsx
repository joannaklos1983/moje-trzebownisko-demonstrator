import { AdminPanel } from "@/components/admin/AdminPanel";
import { ResidentApp } from "@/components/resident/ResidentApp";
import { DemoBar, ScenarioStrip } from "@/components/shell/DemoBar";
import { PhoneFrame } from "@/components/shell/PhoneFrame";
import { AppStoreProvider } from "@/lib/store";

/* Plansza demonstratora (jak w wersji referencyjnej: 1440 × 1080): aplikacja mieszkańca
   i panel administratora obok siebie, z jednym wspólnym stanem.
   Parametr ?w=360 zwęża ekran telefonu do 360 px (odpowiednik M360.dc.html). */
export default async function Home({ searchParams }: PageProps<"/">) {
  const narrow = (await searchParams).w === "360";
  return (
    <AppStoreProvider>
      <div style={{ width: 1440, height: 1080, padding: "24px 40px 32px", display: "flex", flexDirection: "column", gap: 18, background: "#E9EDEA" }}>
        <DemoBar />
        <ScenarioStrip />
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flex: 1, minHeight: 0 }}>
          <PhoneFrame screenWidth={narrow ? 360 : 390}>
            <ResidentApp />
          </PhoneFrame>
          <AdminPanel />
        </div>
      </div>
    </AppStoreProvider>
  );
}
