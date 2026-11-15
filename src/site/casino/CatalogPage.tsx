"use client";

import { useCallback, useMemo, useState } from "react";
import SearchWidget from "@/components/Header/SearchWidget";
import { useLocation } from "@/router";
import { useTranslations } from "@/context/I18nContext";
import type { tGame } from "@/types/tGame";
import {
  PROVIDERS_QUERY_KEY,
  SECTION_META,
  getCategory,
  type CatalogSection,
} from "@/config/catalog";
import { routes } from "@/config/routes";
import { useAgentRedirect } from "@/hooks/useAgentRedirect";
import { CasinoGameGrid } from "./components/CasinoGameGrid";
import { CategoryRail } from "./components/CategoryRail";
import { ProviderQuickFilter } from "./components/ProviderQuickFilter";
import { ProviderSelection } from "./components/ProviderSelection";
import { SectionHero, type HeroCrumb } from "./components/SectionHero";
import { useProviders } from "./hooks/useProviders";
import { CategoryCountsContext } from "./hooks/useSectionCategories";
import { ProviderMonogram } from "@/components/ProviderCard";
import { CategoryBadge } from "./components/CategoryBadge";

export interface CatalogPageProps {
  /** null for provider pages, which span both sections */
  section: CatalogSection | null;
  /** Category slug; undefined/"games" lists every game in the section */
  slug?: string;
  /** Fixed provider (provider landing pages) */
  provider?: { id: string; name: string; img?: string | null };
  /** First page of games rendered on the server */
  initialData?: { games: tGame[]; total: number };
  /** Curated games per category slug (hides empty categories in the rail) */
  categoryCounts?: Record<string, number>;
}

/** Game listing: section "all games", a category, or a provider's games. */
export default function CatalogPage({
  section,
  slug,
  provider,
  initialData,
  categoryCounts,
}: CatalogPageProps) {
  const location = useLocation();
  const t = useTranslations("CasinoPage");
  const [total, setTotal] = useState<number | undefined>(initialData?.total);
  const redirecting = useAgentRedirect();

  const category =
    section && slug && slug !== "games"
      ? getCategory(section, slug)
      : undefined;
  const gameType = section ? SECTION_META[section].gameType : null;
  const providerQuery =
    (location.query[PROVIDERS_QUERY_KEY] as string | undefined) || "";

  const selectedProviders = useMemo(
    () =>
      providerQuery
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [providerQuery],
  );

  const providers = useProviders({
    gameType,
    customCategory: category?.isCustom ? category.category : undefined,
    skip: !!provider,
  });

  const setSelectedProviders = useCallback(
    (next: string[]) => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(location.query ?? {})) {
        if (key !== PROVIDERS_QUERY_KEY && value != null)
          params.set(key, String(value));
      }
      if (next.length) params.set(PROVIDERS_QUERY_KEY, next.join(","));
      const qs = params.toString();
      location.route(qs ? `${location.path}?${qs}` : location.path, true);
    },
    [location],
  );

  const title = provider
    ? provider.name
    : category
      ? t(category.titleKey, undefined, category.titleKey)
      : t("all_games");

  const crumbs: HeroCrumb[] = provider
    ? [
        { label: t("all_providers"), href: routes.providers() },
        { label: provider.name },
      ]
    : section
      ? [
          {
            label: t(SECTION_META[section].titleKey),
            href: routes.section(section),
          },
          { label: title },
        ]
      : [];

  const subtitle = provider
    ? t("provider_tagline", { name: provider.name })
    : undefined;

  const providerFilter = provider ? provider.id : providerQuery || undefined;
  if (redirecting) return null;

  return (
    <CategoryCountsContext.Provider value={categoryCounts}>
      <div className="flex w-full flex-col gap-5 p-2 md:gap-6">
        <SectionHero
          section={section}
          variant="page"
          title={title}
          subtitle={subtitle}
          crumbs={crumbs}
          icon={
            category?.icon || (section ? SECTION_META[section].icon : undefined)
          }
          iconNode={
            provider ? (
              <ProviderMonogram name={provider.name} size="lg" />
            ) : section ? (
              <CategoryBadge look={category?.slug ?? "games"} />
            ) : undefined
          }
          stats={[
            {
              label: t("stat_games"),
              value: total === undefined ? undefined : total.toLocaleString(),
            },
            ...(!provider && providers && providers.length > 0
              ? [{ label: t("Providers"), value: String(providers.length) }]
              : []),
          ]}
        />

        {section && (
          <CategoryRail section={section} active={category?.slug ?? "games"} />
        )}

        {/* Toolbar: search + provider filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-2.5 md:p-3">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <SearchWidget scope={section === "casino" ? "SLOT" : section === "live-casino" ? "LIVECASINO" : "all"} />
            </div>
            {!provider && (
              <ProviderSelection
                providers={providers ?? []}
                value={selectedProviders}
                onChange={setSelectedProviders}
              />
            )}
          </div>
          {!provider && (
            <ProviderQuickFilter
              providers={providers}
              value={selectedProviders}
              onChange={setSelectedProviders}
            />
          )}
        </div>

        <CasinoGameGrid
          key={`${section}-${category?.slug ?? "all"}-${provider?.id ?? ""}`}
          isCustom={!!category?.isCustom}
          category={category?.category as string}
          gameType={provider ? null : gameType}
          provider={providerFilter}
          onTotalChange={setTotal}
          initialData={initialData}
          onClearFilters={
            !provider && selectedProviders.length > 0
              ? () => setSelectedProviders([])
              : undefined
          }
        />
      </div>
    </CategoryCountsContext.Provider>
  );
}
