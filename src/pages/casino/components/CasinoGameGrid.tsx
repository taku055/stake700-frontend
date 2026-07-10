import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import Loader from "@/components/Loader";
import { tGame } from "@/types/tGame";
import { customGamesState } from "@/state/customGamesState";
import { apiGetGames } from "@/api/common/apiGetGames";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import {
  buildPriorityGamesForProvider,
  getPriorityCustomCategoriesForProvider,
  getSingleProviderIdFromQuery,
} from "@/pages/casino/utils/providerHybridGames";

interface CasinoGameGridProps {
  isCustom: boolean;
  category: string;
  provider?: string;
  gameType: "SLOT" | "LIVECASINO" | null;
}

export const CasinoGameGrid: FunctionalComponent<CasinoGameGridProps> = ({
  isCustom,
  category,
  provider,
  gameType,
}) => {
  const t = useTranslations("HomePage");
  const [games, setGames] = useState<tGame[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const GAME_LOAD_COUNT = useMemo(() => (isMobile ? 8 : 24), [isMobile]);

  const priorityCategories = useMemo(
    () => getPriorityCustomCategoriesForProvider(provider),
    [provider],
  );

  const singleProviderId = useMemo(
    () => getSingleProviderIdFromQuery(provider),
    [provider],
  );

  const priorityGames = useMemo(() => {
    if (isCustom || !singleProviderId || priorityCategories.length === 0) {
      return [] as tGame[];
    }
    return buildPriorityGamesForProvider(
      customGamesState.value,
      singleProviderId,
      priorityCategories,
    );
  }, [
    isCustom,
    singleProviderId,
    priorityCategories,
    customGamesState.value,
  ]);

  const priorityIdSet = useMemo(
    () => new Set(priorityGames.map((g) => g.id)),
    [priorityGames],
  );

  const hybridEnabled =
    !isCustom &&
    !!singleProviderId &&
    priorityCategories.length > 0 &&
    priorityGames.length > 0;

  const onLoadMore = useCallback(
    async (offset1: number, mode: "initial" | "append") => {
      if (mode === "append") {
        if (offset1 >= total && total > 0) return;
        setLoadingMore(true);
      } else {
        setInitialLoading(true);
      }

      try {
        let data: tGame[] = [];

        if (isCustom) {
          const totalGames = customGamesState.value.filter(
            (c) =>
              matchesCustomCategory(c.category, category) &&
              (provider && c.Game?.providerId
                ? provider.includes(c.Game?.providerId)
                : true),
          );
          data = totalGames
            .slice(offset1, offset1 + GAME_LOAD_COUNT)
            .map((e) => e.Game as tGame);

          setTotal(totalGames.length);
          setOffset(offset1 + data.length);
        } else if (hybridEnabled) {
          const P = priorityGames;

          if (offset1 === 0) {
            const meta = await apiGetGames({
              category: category,
              limit: 1,
              offset: 0,
              provider,
              randomOrderby: true,
              gameType: gameType || undefined,
            });
            setTotal(P.length + meta.total);

            const head = P.slice(0, Math.min(GAME_LOAD_COUNT, P.length));
            data = [...head];

            if (data.length < GAME_LOAD_COUNT) {
              const need = GAME_LOAD_COUNT - data.length;
              const res = await apiGetGames({
                category: category,
                limit: need,
                offset: 0,
                provider,
                randomOrderby: true,
                gameType: gameType || undefined,
              });
              const extra = res.data.filter((g) => !priorityIdSet.has(g.id));
              data = [...data, ...extra];
            }

            setOffset(data.length);
          } else if (offset1 < P.length) {
            let chunk = P.slice(
              offset1,
              Math.min(offset1 + GAME_LOAD_COUNT, P.length),
            );
            const reachedEndOfPriority =
              offset1 + chunk.length === P.length &&
              chunk.length < GAME_LOAD_COUNT;
            if (reachedEndOfPriority) {
              const need = GAME_LOAD_COUNT - chunk.length;
              const apiOffset = Math.max(0, offset1 - P.length);
              const res = await apiGetGames({
                category: category,
                limit: need,
                offset: apiOffset,
                provider,
                randomOrderby: true,
                gameType: gameType || undefined,
              });
              chunk = [
                ...chunk,
                ...res.data.filter((g) => !priorityIdSet.has(g.id)),
              ];
            }
            data = chunk;
            setOffset(offset1 + data.length);
          } else {
            const apiOffset = offset1 - P.length;
            const res = await apiGetGames({
              category: category,
              limit: GAME_LOAD_COUNT,
              offset: apiOffset,
              provider,
              randomOrderby: true,
              gameType: gameType || undefined,
            });
            data = res.data.filter((g) => !priorityIdSet.has(g.id));
            setOffset(offset1 + data.length);
          }
        } else {
          const res = await apiGetGames({
            category: category,
            limit: GAME_LOAD_COUNT,
            provider: provider,
            randomOrderby: true,
            offset: offset1,
            gameType: gameType || undefined,
          });
          data = res.data;
          setTotal(res.total);
          setOffset(offset1 + data.length);
        }

        setGames((p) => (offset1 === 0 ? data : [...p, ...data]));
      } finally {
        if (mode === "append") {
          setLoadingMore(false);
        } else {
          setInitialLoading(false);
        }
      }
    },
    [
      category,
      isCustom,
      hybridEnabled,
      priorityGames,
      priorityIdSet,
      provider,
      gameType,
      GAME_LOAD_COUNT,
      total,
    ],
  );

  useEffect(() => {
    setInitialLoading(true);
    setGames([]);
    setOffset(0);
    setTotal(0);
    void onLoadMore(0, "initial");
    // Only reset when route/filter inputs change — not when onLoadMore identity changes (avoids wiping the grid on load-more).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isCustom, provider, gameType]);

  if (initialLoading && games.length === 0) {
    return (
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <div className="text-[var(--text-color)] text-lg">
              {"Loading games..."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      <div className="grid md:grid-cols-8 grid-cols-3 md:gap-[12px] gap-[6px]">
        {games.map((game) => (
          <GameCard
            key={game.id}
            data={game}
            useImgCustom={hybridEnabled && priorityIdSet.has(game.id)}
          />
        ))}
      </div>
      {loadingMore && (
        <div className="flex justify-center py-3 min-h-[48px] items-center">
          <Loader />
        </div>
      )}
      {games.length < total && (
        <div className="flex justify-center">
          <Button
            type="button"
            color="success"
            size="sm"
            onPress={() => onLoadMore(offset, "append")}
            isDisabled={loadingMore || offset >= total || initialLoading}
          >
            {t("load_more") || "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};
