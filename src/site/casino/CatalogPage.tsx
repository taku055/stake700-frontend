"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchWidget from "@/components/Header/SearchWidget";
import ProviderGroup from "@/components/ProviderGroup";
import { useLocation } from "@/router";
import { useTranslations } from "@/context/I18nContext";
import type { tProvider } from "@/types/tProvider";
import type { tGame } from "@/types/tGame";
import { providerState } from "@/state/providerState";
import { apiGetCustomCategoryProviders } from "@/api/common/apiGetCustomCategoryProviders";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { PROVIDERS_QUERY_KEY, SECTION_META, getCategory, type CatalogSection } from "@/config/catalog";
import { useAgentRedirect } from "@/hooks/useAgentRedirect";
import { CasinoGameGrid } from "./components/CasinoGameGrid";
import { CasinoHeader } from "./components/CasinoHeader";
import { ProviderSelection, SelectedProviderChips } from "./components/ProviderSelection";

export interface CatalogPageProps {
  /** null for provider pages, which span both sections */
  section: CatalogSection | null;
  /** Category slug; undefined/"games" lists every game in the section */
  slug?: string;
  /** Fixed provider (provider landing pages) */
  provider?: { id: string; name: string; img?: string | null };
  /** First page of games rendered on the server */
  initialData?: { games: tGame[]; total: number };
}

export default function CatalogPage({ section, slug, provider, initialData }: CatalogPageProps) {
  const location = useLocation();
  const t = useTranslations("CasinoPage");
  const [providers, setProviders] = useState<tProvider[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const redirecting = useAgentRedirect();

  const category = section && slug && slug !== "games" ? getCategory(section, slug) : undefined;
  const gameType = section ? SECTION_META[section].gameType : null;
  const providerQuery = (location.query[PROVIDERS_QUERY_KEY] as string | undefined) || "";

  const selectedProviders = useMemo(
    () => providerQuery.split(",").map((s) => s.trim()).filter(Boolean),
    [providerQuery],
  );

  // Provider options for the filter
  useEffect(() => {
    if (provider) return;
    let cancelled = false;
    (async () => {
      try {
        const res = category?.isCustom
          ? await apiGetCustomCategoryProviders(category.category)
          : await apiGetProviders(gameType ?? undefined);
        if (!cancelled) setProviders(res);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [provider, category?.isCustom, category?.category, gameType]);

  const setSelectedProviders = useCallback(
    (next: string[]) => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(location.query ?? {})) {
        if (key !== PROVIDERS_QUERY_KEY && value != null) params.set(key, String(value));
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

  const providerFilter = provider ? provider.id : providerQuery || undefined;
  if (redirecting) return null;

  return (
    <div className="flex w-full flex-col gap-5 p-2 md:gap-6">
      <CasinoHeader
        section={section}
        activeTab={category?.slug ?? "games"}
        title={title}
        eyebrow={provider ? t("Providers") : undefined}
        icon={provider?.img || category?.icon}
        total={total}
        loading={total === undefined}
      />

      <div className="relative z-30 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <SearchWidget className="" />
          </div>
          {!provider && (
            <ProviderSelection providers={providers} value={selectedProviders} onChange={setSelectedProviders} />
          )}
        </div>
        {!provider && (
          <SelectedProviderChips
            providers={providers.length ? providers : providerState.value.array}
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
        onClearFilters={!provider && selectedProviders.length > 0 ? () => setSelectedProviders([]) : undefined}
      />

      <div className="mt-4">
        <ProviderGroup category={section === "live-casino" ? "live-casino" : section === "casino" ? "slots" : undefined} />
      </div>
    </div>
  );
}
