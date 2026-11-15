import type { Metadata } from "next";
import HomePage from "@/site/home";
import SeedCustomGames from "@/provider/SeedCustomGames";
import { getCustomGamesSeed } from "@/lib/server-data";
import { sectionCounts } from "@/lib/catalog-routes";
import CategoryCountsProvider from "@/site/casino/CategoryCountsProvider";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await resolveLang(params);
  return buildMetadata({
    lang,
    path: "/",
    title: translate(lang, "Seo.home_title"),
    description: translate(lang, "Seo.home_description"),
    absoluteTitle: true,
  });
}

export default async function Page() {
  // Slot category counts let the home tabs skip empty categories on the first render
  const [seed, counts] = await Promise.all([getCustomGamesSeed(), sectionCounts("casino")]);
  return (
    <SeedCustomGames entries={seed}>
      <CategoryCountsProvider counts={counts}>
        <HomePage />
      </CategoryCountsProvider>
    </SeedCustomGames>
  );
}
