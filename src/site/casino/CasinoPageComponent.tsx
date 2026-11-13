import { useCallback, useEffect, useMemo, useState } from "react";
import SearchWidget from "@/components/Header/SearchWidget";
import ProviderGroup from "@/components/ProviderGroup";
import { useLocation } from "@/router";
import { useTranslations } from "@/context/I18nContext";
import { tProvider } from "@/types/tProvider";
import { providerState } from "@/state/providerState";
import { apiGetCustomCategoryProviders } from "@/api/common/apiGetCustomCategoryProviders";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { tPageType } from "./data";
import { CasinoGameGrid } from "./components/CasinoGameGrid";
import { CasinoHeader, type CasinoSection } from "./components/CasinoHeader";
import { ProviderSelection, SelectedProviderChips } from "./components/ProviderSelection";

export default function CasinoPageComponent({ pageType }: { pageType: tPageType }) {
  const location = useLocation();
  const t = useTranslations("CasinoPage");
  const [providers, setProviders] = useState<tProvider[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);

  const isCustom = location.query.custom === "1";
  const category = location.query.category as string | undefined;
  const providerQuery = (location.query.providerId as string | undefined) || "";

  // Source of truth for the filter is the URL, so deep links and refreshes stay in sync
  const selectedProviders = useMemo(
    () => providerQuery.split(",").map((s) => s.trim()).filter(Boolean),
    [providerQuery]
  );

  const gameType = pageType === "live-casino" ? "LIVECASINO" : pageType === "slots" ? "SLOT" : null;
  const section: CasinoSection | null =
    pageType === "live-casino" ? "live-casino" : pageType === "slots" ? "slots" : null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = isCustom
          ? await apiGetCustomCategoryProviders(category as string)
          : await apiGetProviders(gameType ?? undefined);
        if (!cancelled) setProviders(res);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isCustom, category, gameType]);

  const onSelectedProvidersChange = useCallback(
    (nextProviders: string[]) => {
      const pathname = location.path.split("?")[0];
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(location.query ?? {})) {
        if (key === "providerId" || value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          for (const v of value) params.append(key, String(v));
        } else {
          params.set(key, String(value));
        }
      }
      const providerId = nextProviders.join(",");
      if (providerId) params.set("providerId", providerId);
      const search = params.toString();
      location.route(search ? `${pathname}?${search}` : pathname);
    },
    [location]
  );

  const providerName = (id: string) =>
    providers.find((p) => p.id === id)?.name ?? providerState.value.map[id]?.name;

  const title = useMemo(() => {
    if (selectedProviders.length === 1 && providerName(selectedProviders[0])) {
      return providerName(selectedProviders[0]) as string;
    }
    if (isCustom && category === "tablegames") return t("Table Games");
    if (pageType === "search") return t("Search");
    return t("all_games");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProviders, providers, isCustom, category, pageType, t]);

  // "All games" tab is active only when the section root is shown unfiltered by a custom category
  const activeTab = isCustom ? "" : "all";

  return (
    <div className="flex w-full flex-col gap-5 p-2 md:gap-6">
      <CasinoHeader
        section={section}
        activeTab={activeTab}
        title={title}
        total={total}
        loading={total === undefined}
      />

      <div className="relative z-30 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <SearchWidget className="" />
          </div>
          <ProviderSelection
            providers={providers}
            value={selectedProviders}
            onChange={onSelectedProvidersChange}
          />
        </div>
        <SelectedProviderChips
          providers={providers.length ? providers : providerState.value.array}
          value={selectedProviders}
          onChange={onSelectedProvidersChange}
        />
      </div>

      <CasinoGameGrid
        isCustom={isCustom}
        category={category as string}
        gameType={gameType}
        provider={providerQuery || undefined}
        onTotalChange={setTotal}
        onClearFilters={
          selectedProviders.length > 0 ? () => onSelectedProvidersChange([]) : undefined
        }
      />

      <div className="mt-4">
        <ProviderGroup category={section ?? undefined} />
      </div>
    </div>
  );
}
