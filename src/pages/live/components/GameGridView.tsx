import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";
import Loader from "@/components/Loader";

interface GameGridViewProps {
  games: tGame[];
  total: number;
  loading: boolean;
  onLoadMore: () => void;
}

export const GameGridView: FunctionalComponent<GameGridViewProps> = ({
  games,
  total,
  loading,
  onLoadMore,
}) => {
  const t = useTranslations("HomePage");

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <div className="text-[var(--text-color)] text-lg">
              {t("loading") || "Loading games..."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-8 gap-2">
        {games.map((game) => (
          <GameCard key={game.id} data={game} />
        ))}
      </div>
      {games.length === 0 && (
        <div className="text-center text-[20px] text-[var(--text-color)] pb-10">
          {t("no_games_found") || "No games found"}
        </div>
      )}

      {games.length < total && (
        <div className="flex justify-center">
          <Button
            type="button"
            color="success"
            size="sm"
            onPress={onLoadMore}
            isLoading={loading}
            isDisabled={loading}
          >
            {t("load_more") || "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

