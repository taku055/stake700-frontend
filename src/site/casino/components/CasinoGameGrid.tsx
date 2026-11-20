import type { FC as FunctionalComponent } from "react";
import { Loader2, SearchX } from "lucide-react";
import GameCard, { GameCardSkeleton } from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tGame } from "@/types/tGame";
import { customGamesState } from "@/state/customGamesState";
import { apiGetGames } from "@/api/common/apiGetGames";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { mobileMediaQuery } from "@/config/constants";
import {
  buildPriorityGamesForProvider,
  getPriorityCustomCategoriesForProvider,
  getSingleProviderIdFromQuery,
} from "@/site/casino/utils/providerHybridGames";

/** Pages loaded automatically on scroll before falling back to the button. */
const AUTO_LOAD_PAGES = 3;

interface CasinoGameGridProps {
  isCustom: boolean;
  category: string;
  provider?: string;
  gameType: "SLOT" | "LIVECASINO" | null;
  /** Reports the total number of games for the current filters (undefined while loading). */
  onTotalChange?: (total: number | undefined) => void;
  /** Shown as an action in the empty state when filters are active. */
  onClearFilters?: () => void;
  /** First page rendered on the server; the grid continues paging from it. */
  initialData?: { games: tGame[]; total: number };
}

export const CasinoGameGrid: FunctionalComponent<CasinoGameGridProps> = ({
  isCustom,
  category,
  provider,
  gameType,
  onTotalChange,
  onClearFilters,
  initialData,
}) => {
  const t = useTranslations("HomePage");
  const tc = useTranslations("CasinoPage");
  const [games, setGames] = useState<tGame[]>(() => initialData?.games ?? []);
  const [initialLoading, setInitialLoading] = useState(!initialData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [offset, setOffset] = useState(initialData?.games.length ?? 0);
  const usedInitialData = useRef(false);
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
    // Server already rendered the first page for these filters — keep it (unless the
    // provider "priority games" mode applies, which is resolved on the client).
    if (initialData && !usedInitialData.current && !hybridEnabled) {
      usedInitialData.current = true;
      return;
    }
    usedInitialData.current = true;
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

  // Load the next pages automatically as the end of the grid comes into view,
  // then switch to the button so the footer stays reachable.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const autoLoads = useRef(0);
  const canLoadMore = games.length > 0 && games.length < total;
  useEffect(() => {
    autoLoads.current = 0;
  }, [category, isCustom, provider, gameType]);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !canLoadMore || loadingMore || initialLoading || autoLoads.current >= AUTO_LOAD_PAGES) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        autoLoads.current += 1;
        void onLoadMore(offset, "append");
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canLoadMore, loadingMore, initialLoading, offset, onLoadMore]);

  const gridClass =
    "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8";

  if (initialLoading && games.length === 0) {
    return (
      <div className={gridClass} aria-busy="true">
        {Array.from({ length: GAME_LOAD_COUNT }).map((_, i) => (
          <GameCardSkeleton key={i} />
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
            <GameCardSkeleton key={`sk-${i}`} />
          ))}
      </div>

      <div ref={sentinelRef} aria-hidden className="h-px" />

      {total > 0 && (
        <div className="mx-auto mt-10 flex w-full max-w-[360px] flex-col items-center gap-3 rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-4">
          <div className="flex w-full items-center justify-between text-[13px] font-semibold">
            <span className="text-[var(--text-muted-color)]">
              {tc("showing_of", { shown: shown.toLocaleString("en-US"), total: total.toLocaleString("en-US") })}
            </span>
            <span className="tabular-nums text-white">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--background-secondary)]">
            <div
              className="h-full rounded-full bg-[var(--primary-color)] shadow-[0_0_10px_var(--primary-color)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {canLoadMore && (
            <button
              type="button"
              onClick={() => onLoadMore(offset, "append")}
              disabled={loadingMore || offset >= total || initialLoading}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-color)] px-6 text-[14px] font-bold text-white shadow-[0_10px_24px_-12px_var(--primary-color)] transition-colors hover:bg-[var(--primary-hover-color)] disabled:cursor-default disabled:opacity-70"
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
