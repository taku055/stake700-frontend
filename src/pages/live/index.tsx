import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { PromotionSection } from "../casino/PromotionSection";
import { GameSearchPanel } from "./components/GameSearchPanel";
import { ProviderSelection } from "./components/ProviderSelection";
import { GameGridView } from "./components/GameGridView";
import { apiGetGames } from "@/api/common/apiGetGames";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { tGame } from "@/types/tGame";
import { tProvider } from "@/types/tProvider";
import { tPaginationResult } from "@/types/tPaginationResult";
import TopLinkBar from "@/components/TopLinkBar";
import { useLocation } from "preact-iso";
import SearchWidget from "@/components/Header/SearchWidget";
import { EmblaBanner } from "../home/components/EmblaBanner";
import { customGamesState } from "@/state/customGamesState";

const ALL_PROVIDERS_ID = "__ALL_PROVIDERS__";
const GAME_LOAD_COUNT = 24;

export default function Live() {
  const [searchQuery, setSearchQuery] = useState("");
  const [providerSearch, setProviderSearch] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([ALL_PROVIDERS_ID]);
  const [providers, setProviders] = useState<tProvider[]>([]);
  const [games, setGames] = useState<tGame[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false); 
  const [total, setTotal] = useState(0);

  const location = useLocation(); 1

  console.log("location.category", location.query.category);

  // Load providers for live casino
  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetProviders("LIVECASINO");
        setProviders(res);
        console.log("providers", res);
      } catch (error) {
        console.error("Error loading providers:", error);
      }
    })();
  }, []);

  // Check if "All Providers" is selected
  const isAllProvidersSelected = useMemo(() => {
    return selectedProviders.includes(ALL_PROVIDERS_ID);
  }, [selectedProviders]);

  // Get individual providers (excluding ALL_PROVIDERS_ID)
  const individualProviders = useMemo(() => {
    return selectedProviders.filter(id => id !== ALL_PROVIDERS_ID);
  }, [selectedProviders]);

  // Toggle provider selection
  const toggleProvider = useCallback((providerId: string) => {
    if (providerId === ALL_PROVIDERS_ID) {
      // Toggle "All Providers"
      if (isAllProvidersSelected) {
        setSelectedProviders([]);
      } else {
        setSelectedProviders([ALL_PROVIDERS_ID]);
      }
    } else {
      // Toggle individual provider
      if (isAllProvidersSelected) {
        // If "All Providers" is selected, replace it with this provider
        setSelectedProviders([providerId]);
      } else {
        // Toggle individual provider
        const newProviders = individualProviders.includes(providerId)
          ? individualProviders.filter((id) => id !== providerId)
          : [...individualProviders, providerId];

        // If no providers selected, default to "All Providers"
        if (newProviders.length === 0) {
          setSelectedProviders([ALL_PROVIDERS_ID]);
        } else {
          setSelectedProviders(newProviders);
        }
      }
    }
  }, [isAllProvidersSelected, individualProviders]);

  // Reset provider selection
  const resetProviders = useCallback(() => {
    setSelectedProviders([ALL_PROVIDERS_ID]);
    setProviderSearch("");
  }, []);

  // Load games based on filters
  const loadMore = useCallback(
    async (offset1: number) => {
      setLoading(true);
      try {

        if (customGamesState.value.length > 0 && location.query.category) {
          const filteredGames: tGame[] = customGamesState.value.filter(
            (c) => c.category === location.query.category
          ).map((c) => c.Game as tGame);
          setGames(filteredGames);
          setTotal(filteredGames.length);
          console.log("filteredGames", filteredGames);
          return;
        }

        const requestParams: any = {
          offset: offset1,
          limit: GAME_LOAD_COUNT,
          category: location.query.category || "livecasino",
          // category: "livecasino",
          keyword: searchQuery || undefined,
        };

        // Add provider filter if individual providers are selected
        if (!isAllProvidersSelected && individualProviders.length > 0) {
          requestParams.provider = individualProviders.join(",");
        }

        const res: tPaginationResult<tGame> = await apiGetGames(requestParams);

        console.log("reslive", res);

        if (offset1 === 0) {
          setGames(res.data);
        } else {
          setGames((p) => [...p, ...res.data]);
        }
        setOffset(offset1 + GAME_LOAD_COUNT);
        setTotal(res.total);
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, isAllProvidersSelected, individualProviders, location.query.category]
  );

  // Load games when filters change
  useEffect(() => {
    setOffset(0);
    loadMore(0);
  }, [searchQuery, selectedProviders, loadMore, location.query.category]);

  // Handle search button click
  const handleSearchClick = useCallback(() => {
    setOffset(0);
    loadMore(0);
  }, [loadMore]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Banner on top */}
      {/* <PromotionSection showAppleImage={false} category="live-casino" /> */}
      <EmblaBanner />

      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
        <SearchWidget />
        {/* <TopLinkBar /> */}

        {/* Search game input panel */}
        {/* <GameSearchPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClick={handleSearchClick}
        /> */}

        {/* Provider selection */}
        <ProviderSelection
          providers={providers}
          selectedProviders={selectedProviders}
          allProvidersId={ALL_PROVIDERS_ID}
          isAllProvidersSelected={isAllProvidersSelected}
          onToggleProvider={toggleProvider}
          onResetProviders={resetProviders}
        />

        {/* Filtered game view panel */}
        <GameGridView
          games={games}
          total={total}
          loading={loading}
          onLoadMore={() => loadMore(offset)}
        />
      </div>
    </div>
  );
}
