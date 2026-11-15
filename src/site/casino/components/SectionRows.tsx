"use client";

import GameGroup from "@/components/GameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";
import type { CatalogSection } from "@/config/catalog";
import { routes } from "@/config/routes";
import { providerHref } from "@/helpers/providerHref";
import { useSectionCategories } from "../hooks/useSectionCategories";

/** Studio rows shown after the category rows (curated per-provider lists). */
const PROVIDER_ROWS: Record<CatalogSection, { category: string; title: string; providerId: string }[]> = {
  casino: [
    { category: "hacksaw", title: "Hacksaw", providerId: "6645919a6bf2f0cb6ce4b25f6f054975d443f17e" },
    { category: "pragmatic", title: "Pragmatic", providerId: "1e418d617fc706f42f4a0b6580297f870d877ec9" },
    { category: "nolimit", title: "No Limit", providerId: "17fbedea2386ee51d7684f36f89e0876ff6be5ce" },
  ],
  "live-casino": [],
};

/** Categories shown as the big two-row block at the top of each lobby. */
const FEATURED: Record<CatalogSection, string> = { casino: "top", "live-casino": "roulette" };

/**
 * Lobby game rows, one per category in catalogue order. Categories without
 * games (e.g. new ones not yet filled in the back office) get no row.
 */
export function SectionRows({ section }: { section: CatalogSection }) {
  const t = useTranslations("CasinoPage");
  const categories = useSectionCategories(section);
  const featured = categories.find((c) => c.slug === FEATURED[section]);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {featured && (
        <TwoRowGameGroup
          category={featured.category}
          title={t(featured.titleKey)}
          isCustom
          viewallLink={routes.category(section, featured.slug)}
        />
      )}
      {categories
        .filter((c) => c !== featured)
        .map((c) => (
          <GameGroup
            key={c.slug}
            category={c.category}
            title={t(c.titleKey)}
            isCustom={c.isCustom}
            useImgCustom={false}
            viewallLink={routes.category(section, c.slug)}
          />
        ))}
      {PROVIDER_ROWS[section].map((row) => (
        <GameGroup
          key={row.category}
          category={row.category}
          title={t(row.title, undefined, row.title)}
          isCustom={false}
          useImgCustom={false}
          provider={row.providerId}
          viewallLink={providerHref(row.providerId)}
        />
      ))}
    </div>
  );
}
