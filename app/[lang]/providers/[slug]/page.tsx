import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CatalogPage from "@/site/casino/CatalogPage";
import { findProvider, getInitialGames } from "@/lib/server-data";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";
import { routes } from "@/config/routes";
import { JsonLd, breadcrumbLd, itemListLd } from "@/lib/jsonld";
import SeoArticle from "@/components/Seo/SeoArticle";
import { providerArticle, siteVars } from "@/lib/seo-content";
import { categoryLinks, providerLinks } from "@/lib/seo-links";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const match = await findProvider(decodeURIComponent(slug));
  if (!match) return {};
  const { provider } = match;
  return buildMetadata({
    lang,
    path: routes.provider(provider.slug),
    title: translate(lang, "Seo.provider_title", { provider: provider.name }),
    description: translate(lang, "Seo.provider_description", { provider: provider.name }),
    image: provider.img ?? undefined,
  });
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  const match = await findProvider(decodeURIComponent(slug));
  if (!match) notFound();

  // Old links used the provider id — move them to the readable slug URL
  if (match.byId) permanentRedirect(`/${lang}${routes.provider(match.provider.slug)}`);

  const { provider } = match;
  const locale = await resolveLang(params);
  const [initialData, vars, others] = await Promise.all([
    getInitialGames({ isCustom: false, provider: provider.id }),
    siteVars(),
    providerLinks(locale, null, 25),
  ]);
  const isLive = provider.gameType?.includes("LIVECASINO") && !provider.gameType?.includes("SLOT");
  const article = providerArticle(locale, {
    ...vars,
    provider: provider.name,
    count: (initialData?.total ?? provider.count ?? 0).toLocaleString("en-US"),
  });
  const path = routes.provider(provider.slug);
  const otherProviders = { ...others, items: others.items.filter((i) => i.path !== path).slice(0, 24) };
  const crumbs = [
    { name: translate(locale, "Seo.home"), path: routes.home() },
    { name: translate(locale, "Seo.providers_title"), path: routes.providers() },
    { name: provider.name, path },
  ];
  const items = (initialData?.games ?? []).map((g) => ({
    name: g.name,
    path: routes.game(g.id, g.name),
    image: g.img_custom || g.img || undefined,
  }));
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(locale, crumbs),
          ...(items.length
            ? [itemListLd(locale, translate(locale, "Seo.provider_title", { provider: provider.name }), items)]
            : []),
        ]}
      />
      <CatalogPage
        section={null}
        provider={{ id: provider.id, name: provider.name, img: provider.img }}
        initialData={initialData}
      />
      <SeoArticle
        lang={locale}
        article={article}
        links={[otherProviders, categoryLinks(locale, isLive ? "live-casino" : "casino")]}
      />
    </>
  );
}
