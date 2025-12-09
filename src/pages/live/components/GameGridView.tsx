import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";

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
  const t = useTranslations("CasinoDetailPage");

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-8 gap-2">
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
            isDisabled={loading}
          >
            {t("load_more") || "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

