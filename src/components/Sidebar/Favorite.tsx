import { userState } from "@/state/userState";
import { FunctionComponent } from "preact";
import LoginRequest from "../LoginRequest";
import { useTranslations } from "@/context/I18nContext";
import { favoritesGameState } from "@/state/favoritesGameState";
import GameCard from "../GameCard";

export const Favorite: FunctionComponent = () => {
  const t = useTranslations("Favorite");

  if (!userState.value?.id) {
    return <LoginRequest />;
  }

  if (favoritesGameState.value.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 pt-10">
        {t("no_favorite_games")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {favoritesGameState.value.map((game) => (
        <GameCard key={game.id} data={game} />
      ))}
    </div>
  );
};
