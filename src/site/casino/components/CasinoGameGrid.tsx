import type { FC as FunctionalComponent } from "react";
import { Loader2, SearchX } from "lucide-react";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";
import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/site/casino/utils/providerHybridGames";

interface CasinoGameGridProps {
  isCustom: boolean;
  category: string;
  provider?: string;
  gameType: "SLOT" | "LIVECASINO" | null;
  /** Reports the total number of games for the current filters (undefined while loading). */
  onTotalChange?: (total: number | undefined) => void;
  /** Shown as an action in the empty state when filters are active. */
  onClearFilters?: () => void;
}

export const CasinoGameGrid: FunctionalComponent<CasinoGameGridProps> = ({
  isCustom,
  category,
  provider,
  gameType,
  onTotalChange,
  onClearFilters,
}) => {
  const t = useTranslations("HomePage");
  const tc = useTranslations("CasinoPage");
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

  useEffect(() => {
    onTotalChange?.(initialLoading ? undefined : total);
  }, [initialLoading, total, onTotalChange]);

  const gridClass =
    "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8";

  if (initialLoading && games.length === 0) {
    return (
      <div className={gridClass} aria-busy="true">
        {Array.from({ length: GAME_LOAD_COUNT }).map((_, i) => (
          <div
            key={i}
            className="aspect-[136/182] animate-pulse rounded-[10px] bg-[var(--bar-background-color)]"
          />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--background-secondary)] px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bar-background-color)] text-[var(--background-tertiary)]">
          <SearchX size={26} />
        </div>
        <p className="text-[16px] font-semibold text-white">{tc("No games found")}</p>
        <p className="mt-1 max-w-sm text-[14px] text-[var(--text-muted-color)]">
          {tc("no_games_hint")}
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-5 h-10 rounded-lg bg-[var(--primary-color)] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover-color)]"
          >
            {tc("Clear all")}
          </button>
        )}
      </div>
    );
  }

  const shown = games.length;
  const progress = total > 0 ? Math.min(100, Math.round((shown / total) * 100)) : 100;
  const canLoadMore = shown < total;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className={gridClass}>
        {games.map((game) => (
          <GameCard
            key={game.id}
            data={game}
            useImgCustom={hybridEnabled && priorityIdSet.has(game.id)}
          />
        ))}
        {loadingMore &&
          Array.from({ length: Math.min(GAME_LOAD_COUNT, total - shown) }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="aspect-[136/182] animate-pulse rounded-[10px] bg-[var(--bar-background-color)]"
            />
          ))}
      </div>

      {total > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-[13px] font-medium text-[var(--text-muted-color)]">
            {tc("showing_of", { shown: shown.toLocaleString(), total: total.toLocaleString() })}
          </p>
          <div className="h-1 w-56 overflow-hidden rounded-full bg-[var(--background-secondary)]">
            <div
              className="h-full rounded-full bg-[var(--primary-color)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {canLoadMore && (
            <button
              type="button"
              onClick={() => onLoadMore(offset, "append")}
              disabled={loadingMore || offset >= total || initialLoading}
              className="mt-2 flex h-11 min-w-[180px] items-center justify-center gap-2 rounded-lg border border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-6 text-[14px] font-semibold text-white transition-colors hover:border-[var(--background-tertiary)] hover:bg-[var(--background-secondary)] disabled:cursor-default disabled:opacity-70"
            >
              {loadingMore && <Loader2 size={16} className="animate-spin" />}
              {t("load_more") || "Load More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
