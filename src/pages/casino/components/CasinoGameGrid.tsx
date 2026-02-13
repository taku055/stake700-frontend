import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import Loader from "@/components/Loader";
import { tGame } from "@/types/tGame";
import { customGamesState } from "@/state/customGamesState";
import { apiGetGames } from "@/api/common/apiGetGames";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";

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
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const GAME_LOAD_COUNT = useMemo(() => (isMobile ? 8 : 24), [isMobile]);

  const onLoadMore = useCallback(
    async (offset1: number) => {
      if (offset1 >= total && total > 0) return;

      setLoading(true);
      let data: tGame[] = [];
      if (isCustom) {
        const totalGames = customGamesState.value.filter(
          (c) => c.category === category
        );
        data = totalGames
          .slice(offset1, offset1 + GAME_LOAD_COUNT)
          .map((e) => e.Game as tGame);

        setTotal(totalGames.length);
        setOffset(offset1 + GAME_LOAD_COUNT);
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
        setOffset(offset1 + GAME_LOAD_COUNT);
      }

      setGames((p) => (offset1 === 0 ? data : [...p, ...data]));
      setLoading(false);
    },
    [category, isCustom, customGamesState.value, provider, gameType, GAME_LOAD_COUNT]
  );

  useEffect(() => {
    onLoadMore(0);
  }, [category, isCustom, provider, onLoadMore, gameType]);

  // Show loading state during initial load (before checking for Home category)
  if (loading) {
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
      <div className="grid md:grid-cols-8 grid-cols-2 md:gap-[16px] gap-[8px]">
        {games.map((game) => (
          <GameCard key={game.id} data={game} />
        ))}
      </div>
      {games.length < total && (
        <div className="flex justify-center">
          <Button
            type="button"
            color="success"
            size="sm"
            onPress={() => onLoadMore(offset)}
            isLoading={loading}
            isDisabled={loading || offset >= total}
          >
            {t("load_more") || "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};
