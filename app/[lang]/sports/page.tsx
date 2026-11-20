import SportPage from "@/site/sport";
import SeoArticle from "@/components/Seo/SeoArticle";
import { resolveLang, seoFor } from "@/lib/seo";
import { pageArticle, siteVars } from "@/lib/seo-content";
import { siteLinks } from "@/lib/seo-links";

export const generateMetadata = seoFor("sports", "/sports");

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const vars = await siteVars();
  return (
    <>
      <SportPage />
      <SeoArticle lang={lang} article={pageArticle(lang, "sports", vars)} links={[siteLinks(lang)]} headingLevel={1} />
    </>
  );
}
