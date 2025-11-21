import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";

interface CasinoGameGridProps {
  games: tGame[];
  total: number;
  loading: boolean;
  offset: number;
  onLoadMore: () => void;
}

export const CasinoGameGrid: FunctionalComponent<CasinoGameGridProps> = ({
  games,
  total,
  loading,
  offset,
  onLoadMore,
}) => {
  const t = useTranslations("HomePage");

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      <div className="grid md:grid-cols-6 grid-cols-2 gap-2">
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
            onPress={onLoadMore}
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

