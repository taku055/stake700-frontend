import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";
import GuideCard from "./GuideCard";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { useCasinoCategories } from "@/hooks/useCasinoCategories";
import { useMemo } from "preact/hooks";
import Loader from "@/components/Loader";

interface CasinoGameGridProps {
  games: tGame[];
  total: number;
  loading: boolean;
  offset: number;
  onLoadMore: () => void;
  selectedCategory: string;
}

export const CasinoGameGrid: FunctionalComponent<CasinoGameGridProps> = ({
  games,
  total,
  loading,
  offset,
  onLoadMore,
  selectedCategory,
}) => {
  const t = useTranslations("HomePage");
  const tHeader = useTranslations("Header");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const { categories } = useCasinoCategories();

  const categoryName = useMemo(() => {
    console.log("selectedCategory", selectedCategory);
    if (selectedCategory === "/casino/home?custom=1&category=home") {
      return "Home";
    }
    return selectedCategory ? categories.find(cat => cat.path === selectedCategory)?.name : "All Games";
  }, [selectedCategory, categories]);


  if (categoryName === "Home") {
    return null;
  }

  // Show loading state during initial load
  if (loading && games.length === 0) {
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
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      {/* <div 
        className={`w-full px-2 py-4 bg-[var(--bar-background-color)] rounded-lg text-[20px] uppercase ${
          isRTL ? "text-right" : "text-left"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {categoryName}
      </div> */}
      <div className="grid md:grid-cols-8 grid-cols-2 gap-2">
        {games.map((game) => (
          <GameCard key={game.id} data={game} />
        ))}
      </div>
      {/* {total === 0 && !loading && (
        <div className="text-center text-[20px] text-[var(--text-color)]">
          {t("no_games_found") || "No games found"}
          No games found for this category
        </div>
      )} */}

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
