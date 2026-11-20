import type { Locale } from "@/config/i18n";
import { SECTION_META, getSectionCategories, type CatalogSection } from "@/config/catalog";
import { routes } from "@/config/routes";
import { translate } from "@/lib/seo";
import { seoUi, topProviders } from "@/lib/seo-content";
import { getProviders } from "@/lib/server-data";
import type { SeoLinkGroup } from "@/components/Seo/SeoArticle";

/** Internal-link groups for SEO articles (crawl paths between hub pages). */

export function siteLinks(lang: Locale): SeoLinkGroup {
  const t = (k: string) => translate(lang, `Header.${k}`);
  return {
    title: seoUi(lang, "explore"),
    items: [
      { name: t("Casino"), path: routes.casino() },
      { name: t("Live Casino"), path: routes.liveCasino() },
      { name: t("Sports"), path: routes.sports() },
      { name: t("Horse Racing"), path: routes.racing() },
      { name: t("Promotions"), path: routes.promotions() },
      { name: t("VIP Club"), path: routes.vip() },
      { name: translate(lang, "Footer.Publishers"), path: routes.providers() },
      { name: seoUi(lang, "best_slots_link"), path: routes.bestSlots() },
      { name: seoUi(lang, "blog_link"), path: routes.blog() },
    ],
  };
}

export function categoryLinks(lang: Locale, section: CatalogSection): SeoLinkGroup {
  return {
    title: translate(lang, `CasinoPage.${SECTION_META[section].titleKey}`),
    items: [
      { name: translate(lang, "CasinoPage.all_games"), path: routes.sectionAll(section) },
      ...getSectionCategories(section).map((c) => ({
        name: translate(lang, `CasinoPage.${c.titleKey}`),
        path: routes.category(section, c.slug),
      })),
    ],
  };
}

export async function providerLinks(
  lang: Locale,
  type: "SLOT" | "LIVECASINO" | null,
  limit = 18,
): Promise<SeoLinkGroup> {
  const providers = topProviders(await getProviders(), type, limit);
  return {
    title: seoUi(lang, "popular_providers"),
    items: providers.map((p) => ({ name: p.name, path: routes.provider(p.slug) })),
  };
}
