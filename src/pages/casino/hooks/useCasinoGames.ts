import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import { tPaginationResult } from "@/types/tPaginationResult";
import { customGamesState } from "@/state/customGamesState";
import { useCategoryParams, CategoryParams } from "./useCategoryParams";

const GAME_LOAD_COUNT = 24;
const ALL_PROVIDERS_ID = "__ALL_PROVIDERS__";

interface UseCasinoGamesProps {
  selectedCategory: string;
  searchQuery: string;
  selectedProviders: string[];
}

export function useCasinoGames({
  selectedCategory,
  searchQuery,
  selectedProviders,
}: UseCasinoGamesProps) {
  const [games, setGames] = useState<tGame[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { getCategoryParams } = useCategoryParams();

  // Get individual providers (excluding ALL_PROVIDERS_ID)
  const individualProviders = useMemo(() => {
    return selectedProviders.filter(id => id !== ALL_PROVIDERS_ID);
  }, [selectedProviders]);

  // Check if "All Providers" is selected
  const isAllProvidersSelected = useMemo(() => {
    return selectedProviders.length === 0 || selectedProviders.includes(ALL_PROVIDERS_ID);
  }, [selectedProviders]);

  // Load games based on filters
  const loadMore = useCallback(
    async (offset1: number) => {
      setLoading(true);
      try {
        // Get category params
        const categoryParams = selectedCategory ? getCategoryParams(selectedCategory) : { custom: false, category: null, provider: null };
        
        // Determine provider filter
        let providerFilter: string | undefined = undefined;
        if (!isAllProvidersSelected && individualProviders.length > 0) {
          providerFilter = individualProviders.join(",");
        } else if (categoryParams.provider) {
          providerFilter = categoryParams.provider;
        }

        let res: tPaginationResult<tGame> = {
          data: [],
          total: 0,
        };

        if (categoryParams.custom && categoryParams.category) {
          // Custom category - get from customGamesState
          const filteredGames = customGamesState.value.filter(
            (c) =>
              c.category === categoryParams.category &&
              c.Game?.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // Filter by providers if selected
          let finalGames = filteredGames.map((e) => e.Game as tGame);
          if (providerFilter) {
            const providerIds = providerFilter.split(",");
            finalGames = finalGames.filter((game) =>
              providerIds.includes(game.providerId || "")
            );
          }

          res = {
            data: finalGames.slice(offset1, offset1 + GAME_LOAD_COUNT),
            total: finalGames.length,
          };
        } else {
          // Regular category - fetch from API
          const requestParams: any = {
            offset: offset1,
            limit: GAME_LOAD_COUNT,
            keyword: searchQuery || undefined,
          };

          // If path is "/casino/slots" without category, use "slots" category
          if (selectedCategory?.includes("/casino/slots") && !categoryParams.category) {
            requestParams.category = "slots";
          } else if (categoryParams.category) {
            requestParams.category = categoryParams.category;
          }

          if (providerFilter) {
            requestParams.provider = providerFilter;
          }

          res = await apiGetGames(requestParams);
        }

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
    [selectedCategory, searchQuery, isAllProvidersSelected, individualProviders, getCategoryParams]
  );

  // Load games when filters change
  useEffect(() => {
    if (selectedCategory) {
      setOffset(0);
      loadMore(0);
    }
  }, [selectedCategory, searchQuery, selectedProviders, loadMore]);

  return {
    games,
    loading,
    total,
    offset,
    loadMore: () => loadMore(offset),
  };
}

