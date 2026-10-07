import { DemoBoard } from "@/components/shell/DemoBoard";
import { AppStoreProvider } from "@/lib/store";

/* Plansza demonstratora (szerokość jak w wersji referencyjnej: 1440): aplikacja mieszkańca,
   a po otwarciu przyciskiem – panel administratora obok, z jednym wspólnym stanem.
   Parametr ?w=360 zwęża ekran telefonu do 360 px (odpowiednik M360.dc.html). */
export default async function Home({ searchParams }: PageProps<"/">) {
  const narrow = (await searchParams).w === "360";
  return (
    <AppStoreProvider>
      <DemoBoard screenWidth={narrow ? 360 : 390} />
    </AppStoreProvider>
  );
}
