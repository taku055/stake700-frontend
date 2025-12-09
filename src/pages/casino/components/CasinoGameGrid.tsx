import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";
import GuideCard from "./GuideCard";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

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
  const tHeader = useTranslations("Header");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  const guideCards = [
    {
      icon: "/images/be-part.svg",
      title: t("guide_card_exclusive_games_title") || "Be Part of Exclusive Games",
      content: t("guide_card_exclusive_games_content") || "Enjoy exclusive premium games",
    },
    {
      icon: "/images/games-favorite.svg",
      title: t("guide_card_favorite_games_title") || "Make Games Favorite",
      content: t("guide_card_favorite_games_content") || "Access your favorite games instantly",
    },
    {
      icon: "/images/contact-support.svg",
      title: t("guide_card_contact_support_title") || "Contact Support 24/7",
      content: t("guide_card_contact_support_content") || "Contact us for any issues with live chat",
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      <div 
        className={`w-full px-2 py-4 bg-[var(--bar-background-color)] rounded-lg text-[20px] uppercase ${
          isRTL ? "text-right" : "text-left"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {tHeader("All Games")}
      </div>
      <div className="grid md:grid-cols-8 grid-cols-2 gap-2">
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

      <div className="w-full flex flex-col gap-4 md:flex-row items-center justify-center bg-gradient-to-b from-[rgba(11, 22, 41, 0.5)] to-[#122543]">
        {guideCards.map((guide) => (
          <div className="flex-1 flex items-center justify-center py-8">
            <GuideCard key={guide.title} {...guide} />
          </div>
        ))}
      </div>
    </div>
  );
};
