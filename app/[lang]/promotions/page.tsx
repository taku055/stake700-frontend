import PromotionsPage from "@/site/promotions";
import SeoArticle from "@/components/Seo/SeoArticle";
import { resolveLang, seoFor, translate } from "@/lib/seo";
import { pageArticle, siteVars } from "@/lib/seo-content";
import { siteLinks } from "@/lib/seo-links";
import { getPublicPromotions } from "@/lib/server-data";
import { routes } from "@/config/routes";

export const generateMetadata = seoFor("promotions", "/promotions");

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const [vars, offers] = await Promise.all([siteVars(), getPublicPromotions()]);
  const offerLinks = {
    title: translate(lang, "Seo.promotions_title"),
    items: offers.map((p) => ({ name: p.name, path: routes.promotionOffer(p.code) })),
  };
  return (
    <>
      <PromotionsPage />
      <SeoArticle lang={lang} article={pageArticle(lang, "promotions", vars)} links={[offerLinks, siteLinks(lang)]} />
    </>
  );
}
