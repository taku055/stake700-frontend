import { useState, useEffect, useCallback, useMemo } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import { CasinoGameGrid } from "@/pages/casino/components/CasinoGameGrid";
import { searchWidgetState } from "@/state/searchWidgetState";
import ContentWrapper from "@/provider/ContentWrapper.tsx";
import { userState } from "@/state/userState.ts";
import { useLocation } from "preact-iso";
import GameCard from "@/components/GameCard";
import Loader from "@/components/Loader";
import { apiGetFavoritesGame } from "@/api/favorites/apiGetFavoritesGame";
import { apiGetRecentGame } from "@/api/recent/apiGetRecentGame";
import { tGame } from "@/types/tGame";

const TABS = [
    { key: "top", name: "Top", icon: "/images/category_logo/top.png" },
    { key: "favorites", name: "Favorites", icon: "/images/games-favorite.svg" },
    { key: "recently", name: "Recently", icon: "/images/icons/history.svg" },
];

function GamesGrid({ fetcher }: { fetcher: () => Promise<tGame[]> }) {
    const [games, setGames] = useState<tGame[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations("CasinoPage");

    useEffect(() => {
        setLoading(true);
        fetcher()
            .then(setGames)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader />
            </div>
        );
    }

    if (!games.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-[#99897a]">
                {t("No games found")}
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-8 grid-cols-3 md:gap-[12px] gap-[6px]">
            {games.map((game) => (
                <GameCard key={game.id} data={game} />
            ))}
        </div>
    );
}

export default function TopCasino() {
    const location = useLocation();
    if (userState.value?.role === "SUPERAGENT") {
        location.route("/superagent");
        return null;
    } else if (userState.value?.role === "AREA_MANAGER") {
        location.route("/area_manager");
        return null;
    } else if (userState.value?.role === "AGENT") {
        location.route("/agent");
        return null;
    }

    const [activeTab, setActiveTab] = useState("top");
    const t = useTranslations("CasinoPage");

    const favoritesFetcher = useCallback(
        () => apiGetFavoritesGame({ limit: 48 }).then((r) => r.data),
        []
    );
    const recentFetcher = useCallback(
        () => apiGetRecentGame({ limit: 48 }).then((r) => r.data),
        []
    );

    return (
        <ContentWrapper className="px-4 md:px-20">
            <div className="flex overflow-x-auto scrollbar-hide mb-4 mt-4">
                <div className="flex gap-1 min-w-max">
                    <button
                        type="button"
                        onClick={() => (searchWidgetState.value = !searchWidgetState.value)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-lg font-medium text-[#99897a] hover:text-white hover:bg-[rgb(54,48,43)]"
                    >
                        <img src="/images/search.png" className="w-5 h-5 object-contain" />
                        {t("Search")}
                    </button>
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-lg font-medium ${activeTab === tab.key
                                ? "bg-[rgb(54,48,43)] text-[#f0d9c6]"
                                : "text-[#99897a] hover:text-white hover:bg-[#1e1e1e]"
                                }`}
                        >
                            <img src={tab.icon} alt={t(tab.name)} className="w-5 h-5 object-contain" />
                            {t(tab.name)}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "top" && (
                <></>
            )}
            {activeTab === "favorites" && <> </>}
            {activeTab === "recently" && <></>}
        </ContentWrapper>
    );
}
