import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogPage from "@/site/casino/CatalogPage";
import LobbyPage from "@/site/casino/LobbyPage";
import SeedCustomGames from "@/provider/SeedCustomGames";
import { getCustomCategoryCount, getCustomCategoryCounts, getCustomGamesSeed, getInitialGames, type InitialGames } from "@/lib/server-data";
import { PROVIDERS_QUERY_KEY, SECTION_META, getCategory, getSectionCategories, type CatalogSection } from "@/config/catalog";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/i18n";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";
import { JsonLd, breadcrumbLd, itemListLd, type Crumb } from "@/lib/jsonld";

/**
 * Page/metadata factories shared by /casino/* and /live-casino/*, so both
 * sections are wired identically from the catalogue config.
 */
type LangParams = { params: Promise<{ lang: string }> };
type CategoryParams = { params: Promise<{ lang: string; category: string }> };
type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function providersFilter(searchParams: Search["searchParams"]): Promise<string | undefined> {
  const value = (await searchParams)[PROVIDERS_QUERY_KEY];
  return (Array.isArray(value) ? value[0] : value) || undefined;
}

const SEO_KEY: Record<CatalogSection, { lobby: string; all: string }> = {
  casino: { lobby: "casino", all: "casino_all" },
  "live-casino": { lobby: "live", all: "live_all" },
};

function sectionCrumbs(lang: Locale, section: CatalogSection): Crumb[] {
  return [
    { name: translate(lang, "Seo.home"), path: routes.home() },
    { name: translate(lang, `CasinoPage.${SECTION_META[section].titleKey}`), path: routes.section(section) },
  ];
}

/** Curated game counts per category slug for a section (undefined if the backend is down). */
export async function sectionCounts(section: CatalogSection): Promise<Record<string, number> | undefined> {
  const categories = getSectionCategories(section);
  const counts = await getCustomCategoryCounts(categories.map((c) => c.category));
  return counts ? Object.fromEntries(categories.map((c) => [c.slug, counts[c.category] ?? 0])) : undefined;
}

/** Breadcrumbs + the server-rendered games as an ItemList. */
function CatalogJsonLd({ lang, crumbs, data }: { lang: Locale; crumbs: Crumb[]; data?: InitialGames }) {
  const items = (data?.games ?? []).map((g) => ({
    name: g.name,
    path: routes.game(g.id, g.name),
    image: g.img_custom || g.img || undefined,
  }));
  return (
    <JsonLd
      data={[
        breadcrumbLd(lang, crumbs),
        ...(items.length ? [itemListLd(lang, crumbs[crumbs.length - 1].name, items)] : []),
      ]}
    />
  );
}

export function sectionLobby(section: CatalogSection) {
  return {
    generateMetadata: async ({ params }: LangParams): Promise<Metadata> => {
      const lang = await resolveLang(params);
      const key = SEO_KEY[section].lobby;
      return buildMetadata({
        lang,
        path: routes.section(section),
        title: translate(lang, `Seo.${key}_title`),
        description: translate(lang, `Seo.${key}_description`),
      });
    },
    Page: async ({ params }: LangParams) => {
      const lang = await resolveLang(params);
      const [seed, categoryCounts] = await Promise.all([getCustomGamesSeed(), sectionCounts(section)]);
      return (
        <>
          <JsonLd data={breadcrumbLd(lang, sectionCrumbs(lang, section))} />
          <SeedCustomGames entries={seed}>
            <LobbyPage section={section} categoryCounts={categoryCounts} />
          </SeedCustomGames>
        </>
      );
    },
  };
}

export function sectionAll(section: CatalogSection) {
  return {
    generateMetadata: async ({ params }: LangParams): Promise<Metadata> => {
      const lang = await resolveLang(params);
      const key = SEO_KEY[section].all;
      return buildMetadata({
        lang,
        path: routes.sectionAll(section),
        title: translate(lang, `Seo.${key}_title`),
        description: translate(lang, `Seo.${key}_description`),
      });
    },
    Page: async ({ params, searchParams }: LangParams & Search) => {
      const lang = await resolveLang(params);
      const [initialData, categoryCounts] = await Promise.all([
        getInitialGames({
          isCustom: false,
          gameType: SECTION_META[section].gameType,
          provider: await providersFilter(searchParams),
        }),
        sectionCounts(section),
      ]);
      const crumbs = [
        ...sectionCrumbs(lang, section),
        { name: translate(lang, "CasinoPage.all_games"), path: routes.sectionAll(section) },
      ];
      return (
        <>
          <CatalogJsonLd lang={lang} crumbs={crumbs} data={initialData} />
          <CatalogPage section={section} slug="games" initialData={initialData} categoryCounts={categoryCounts} />
        </>
      );
    },
  };
}

export function sectionCategory(section: CatalogSection) {
  return {
    generateMetadata: async ({ params }: CategoryParams): Promise<Metadata> => {
      const lang = await resolveLang(params);
      const { category: slug } = await params;
      const category = getCategory(section, slug);
      if (!category) return {};
      const name = translate(lang, `CasinoPage.${category.titleKey}`);
      // Keep empty curated categories out of the index (thin content)
      const count = category.isCustom ? await getCustomCategoryCount(category.category) : null;
      const sectionName = translate(lang, `CasinoPage.${SECTION_META[section].titleKey}`);
      return buildMetadata({
        lang,
        path: routes.category(section, slug),
        title: translate(lang, "Seo.category_title", { category: name, section: sectionName }),
        description: translate(lang, "Seo.category_description", { category: name }),
        noindex: count === 0,
      });
    },
    Page: async ({ params, searchParams }: CategoryParams & Search) => {
      const lang = await resolveLang(params);
      const { category: slug } = await params;
      const category = getCategory(section, slug);
      if (!category) notFound();
      const [initialData, categoryCounts] = await Promise.all([
        getInitialGames({
          isCustom: category.isCustom,
          category: category.category,
          gameType: category.gameType,
          provider: await providersFilter(searchParams),
        }),
        sectionCounts(section),
      ]);
      const crumbs = [
        ...sectionCrumbs(lang, section),
        { name: translate(lang, `CasinoPage.${category.titleKey}`), path: routes.category(section, slug) },
      ];
      return (
        <>
          <CatalogJsonLd lang={lang} crumbs={crumbs} data={initialData} />
          <CatalogPage section={section} slug={slug} initialData={initialData} categoryCounts={categoryCounts} />
        </>
      );
    },
  };
}
