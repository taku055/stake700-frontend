import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { searchWidgetState } from "@/state/searchWidgetState";
import ContentWrapper from "@/provider/ContentWrapper.tsx";
import { userState } from "@/state/userState.ts";
import { useLocation } from "preact-iso";
import { CasinoGameGrid } from "../casino/components/CasinoGameGrid";

const TABS = [
    { key: "roulette", name: "Roulette", icon: "/images/category_logo/roulette.png" },
    { key: "favorites", name: "Favorites", icon: "/images/games-favorite.svg" },
    { key: "recently", name: "Recently", icon: "/images/icons/history.svg" },
];

export default function RouletteLiveCasino() {
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

    const [activeTab, setActiveTab] = useState("roulette");
    const t = useTranslations("CasinoPage");

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

            {activeTab === "roulette" && <CasinoGameGrid isCustom={false} category="roulette" gameType="LIVECASINO" />}
            {activeTab === "favorites" && <></>}
            {activeTab === "recently" && <></>}
        </ContentWrapper>
    );
}
