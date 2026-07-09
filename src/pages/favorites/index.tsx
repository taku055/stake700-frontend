import ContentWrapper from "@/provider/ContentWrapper";
import { FavoritesGrid } from "@/components/FavoritesGrid";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { favoritesGameState } from "@/state/favoritesGameState";
import { apiGetFavoritesGame } from "@/api/favorites/apiGetFavoritesGame";
import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";

export default function FavoritesPage() {
  const t = useTranslations("Favorite");
  const location = useLocation();

  useEffect(() => {
    if (userState.value?.role === "SUPERAGENT") {
      location.route("/superagent");
      return;
    }
    if (userState.value?.role === "AREA_MANAGER") {
      location.route("/area_manager");
      return;
    }
    if (userState.value?.role === "AGENT") {
      location.route("/agent");
      return;
    }
  }, [location, userState.value?.role]);

  useEffect(() => {
    if (!userState.value?.id) return;

    const loadFavorites = async () => {
      try {
        const favorites = await apiGetFavoritesGame({
          offset: 0,
          limit: 1000,
        });
        favoritesGameState.value = favorites.data;
      } catch (ex) {
        console.error(ex);
      }
    };

    void loadFavorites();
  }, [userState.value?.id]);

  return (
    <ContentWrapper className="px-4 md:px-20 pb-24 md:pb-8">
      <h1 className="text-2xl font-semibold text-white mt-4 mb-6">
        {t("title")}
      </h1>
      <FavoritesGrid showBrowseLink />
    </ContentWrapper>
  );
}
