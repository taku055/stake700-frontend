import type { Metadata } from "next";
import HomePage from "@/site/home";
import SeedCustomGames from "@/provider/SeedCustomGames";
import { getCustomGamesSeed } from "@/lib/server-data";
import { sectionCounts } from "@/lib/catalog-routes";
import CategoryCountsProvider from "@/site/casino/CategoryCountsProvider";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";
import SeoArticle from "@/components/Seo/SeoArticle";
import { pageArticle, siteVars } from "@/lib/seo-content";
import { categoryLinks, providerLinks, siteLinks } from "@/lib/seo-links";

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

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  // Slot category counts let the home tabs skip empty categories on the first render
  const [seed, counts, vars, providers] = await Promise.all([
    getCustomGamesSeed(),
    sectionCounts("casino"),
    siteVars(),
    providerLinks(lang, null, 24),
  ]);
  return (
    <>
      <SeedCustomGames entries={seed}>
        <CategoryCountsProvider counts={counts}>
          <HomePage />
        </CategoryCountsProvider>
      </SeedCustomGames>
      <SeoArticle
        lang={lang}
        article={pageArticle(lang, "home", vars)}
        links={[siteLinks(lang), categoryLinks(lang, "casino"), categoryLinks(lang, "live-casino"), providers]}
        className="mx-4 md:mx-8"
      />
    </>
  );
}
