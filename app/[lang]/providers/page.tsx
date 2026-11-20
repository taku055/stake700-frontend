import ProvidersPage from "@/site/providers/ProvidersPage";
import { getProviders } from "@/lib/server-data";
import { resolveLang, seoFor, translate } from "@/lib/seo";
import { JsonLd, breadcrumbLd, itemListLd } from "@/lib/jsonld";
import { routes } from "@/config/routes";
import SeoArticle from "@/components/Seo/SeoArticle";
import { pageArticle, siteVars } from "@/lib/seo-content";
import { categoryLinks, siteLinks } from "@/lib/seo-links";

export const generateMetadata = seoFor("providers", "/providers");

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const providers = (await getProviders()).filter((p) => !p.gameType?.every((t) => t === "SPORT"));
  const title = translate(lang, "Seo.providers_title");
  const vars = await siteVars();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(lang, [
            { name: translate(lang, "Seo.home"), path: routes.home() },
            { name: title, path: routes.providers() },
          ]),
          itemListLd(
            lang,
            title,
            providers.map((p) => ({ name: p.name, path: routes.provider(p.slug), image: p.img ?? undefined })),
          ),
        ]}
      />
      <ProvidersPage
        providers={providers.map((p) => ({ id: p.id, slug: p.slug, name: p.name, img: p.img, count: p.count }))}
      />
      <SeoArticle
        lang={lang}
        article={pageArticle(lang, "providers", vars)}
        links={[categoryLinks(lang, "casino"), categoryLinks(lang, "live-casino"), siteLinks(lang)]}
      />
    </>
  );
}
