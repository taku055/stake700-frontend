"use client";

import GameGroup from "@/components/GameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";
import type { CatalogSection } from "@/config/catalog";
import { routes } from "@/config/routes";
import { providerHref } from "@/helpers/providerHref";
import { useContext } from "react";
import { CategoryCountsContext, useSectionCategories } from "../hooks/useSectionCategories";
import { categoryLook } from "../categoryIcons";
import { ProviderMonogram, providerAccent } from "@/components/ProviderCard";
import { providerState } from "@/state/providerState";

/** Studio rows shown after the category rows (curated per-provider lists). */
const PROVIDER_ROWS: Record<CatalogSection, { category: string; title: string; providerId: string }[]> = {
  casino: [
    { category: "hacksaw", title: "Hacksaw", providerId: "6645919a6bf2f0cb6ce4b25f6f054975d443f17e" },
    { category: "pragmatic", title: "Pragmatic", providerId: "11858297870e9cc0faef0857094e5b320cf98cd4" },
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
  const counts = useContext(CategoryCountsContext);

  const gamesLabel = (count?: number) =>
    typeof count === "number" && count > 0 ? t("games_count", { count: count.toLocaleString("en-US") }) : undefined;
  const categoryHeader = (slug: string) => {
    const { Icon, accent } = categoryLook(slug);
    return { icon: <Icon size={20} strokeWidth={2.25} />, accent, subtitle: gamesLabel(counts?.[slug]) };
  };
  const providerHeader = (providerId: string, name: string) => {
    const provider = providerState.value.map[providerId];
    return {
      icon: <ProviderMonogram name={provider?.name || name} size="sm" />,
      accent: providerAccent(provider?.name || name)[1],
      subtitle: gamesLabel(provider?.count),
    };
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {featured && (
        <TwoRowGameGroup
          category={featured.category}
          title={t(featured.titleKey)}
          isCustom
          viewallLink={routes.category(section, featured.slug)}
          {...categoryHeader(featured.slug)}
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
            {...categoryHeader(c.slug)}
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
          {...providerHeader(row.providerId, row.title)}
        />
      ))}
    </div>
  );
}
