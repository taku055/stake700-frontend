import { FunctionComponent } from "preact";
import LoginRequest from "@/components/LoginRequest";
import GameCard from "@/components/GameCard";
import { useTranslations } from "@/context/I18nContext";
import { favoritesGameState } from "@/state/favoritesGameState";
import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";

interface FavoritesGridProps {
  compact?: boolean;
  showBrowseLink?: boolean;
}

export const FavoritesGrid: FunctionComponent<FavoritesGridProps> = ({
  compact = false,
  showBrowseLink = false,
}) => {
  const t = useTranslations("Favorite");
  const location = useLocation();

  if (!userState.value?.id) {
    return <LoginRequest />;
  }

  if (favoritesGameState.value.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 pt-10">
        <div className="text-center text-sm text-gray-500">
          {t("no_favorite_games")}
        </div>
        {showBrowseLink && (
          <button
            type="button"
            className="text-sm text-[var(--green-color)] hover:underline"
            onClick={() => location.route("/casino/slots")}
          >
            {t("browse_games")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "grid grid-cols-2 gap-2"
          : "grid md:grid-cols-8 grid-cols-3 md:gap-[12px] gap-[6px]"
      }
    >
      {favoritesGameState.value.map((game) => (
        <GameCard key={game.id} data={game} />
      ))}
    </div>
  );
};
