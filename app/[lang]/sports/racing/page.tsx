import RacingPage from "@/site/sports/RacingPage";
import SeoArticle from "@/components/Seo/SeoArticle";
import { resolveLang, seoFor } from "@/lib/seo";
import { pageArticle, siteVars } from "@/lib/seo-content";
import { siteLinks } from "@/lib/seo-links";

export const generateMetadata = seoFor("racing", "/sports/racing");

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const vars = await siteVars();
  return (
    <>
      <RacingPage racing="horseRacing" />
      <SeoArticle lang={lang} article={pageArticle(lang, "racing", vars)} links={[siteLinks(lang)]} headingLevel={1} />
    </>
  );
}
