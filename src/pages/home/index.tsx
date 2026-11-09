import { useEffect, useMemo, useState } from "preact/hooks";
import { CasinoGameGrid } from "@/pages/casino/components/CasinoGameGrid";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "preact-iso";
import { EmblaBanner } from "@/components/EmblaBanner/EmblaBanner";
import ContentWrapper from "@/provider/ContentWrapper.tsx";
import { userState } from "@/state/userState.ts";
import { searchWidgetState } from "@/state/searchWidgetState";
import LobbyGames from "./LobbyGames.tsx";
import LiveCasinoGames from "./LiveCasinoGames.tsx";
import CasinoGames from "./CasinoGames.tsx";
import { HOME_PAGE_TABS, type HomePageMode } from "./tabData";
import { HOME_PAGE_CATEGORIES, HOME_PAGE_DEFAULT_TAB } from "./categoryData";
import ProviderGroup from "@/components/ProviderGroup/index.tsx";

const HOME_PAGE_MODE_QUERY_KEY = "page";

const HOME_PAGE_MODE_BY_PATH: Record<string, HomePageMode> = {
  "/": "home",
  "/lobby-casino": "lobby-casino",
  "/lobby-live-casino": "lobby-live-casino",
};

export default function HomePage() {
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

  const activeMode = useMemo<HomePageMode>(() => {
    const modeFromQuery = location.query?.[HOME_PAGE_MODE_QUERY_KEY];
    if (
      modeFromQuery === "home" ||
      modeFromQuery === "lobby-casino" ||
      modeFromQuery === "lobby-live-casino"
    ) {
      return modeFromQuery;
    }
    return HOME_PAGE_MODE_BY_PATH[location.path] ?? "home";
  }, [location.path, location.query]);

  const tabs = useMemo(() => HOME_PAGE_TABS[activeMode], [activeMode]);
  const defaultTab = useMemo(
    () => HOME_PAGE_DEFAULT_TAB[activeMode],
    [activeMode],
  );
  const categories = useMemo(
    () => HOME_PAGE_CATEGORIES[activeMode],
    [activeMode],
  );
  const t = useTranslations(activeMode === "home" ? "HomePage" : "CasinoPage");
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, activeMode]);

  const renderCategory = () => {
    const categoryConfig = categories[activeTab];
    if (!categoryConfig || categoryConfig.type === "empty") {
      return null;
    }

    if (categoryConfig.type === "component") {
      if (categoryConfig.component === "lobby-games") {
        return <LobbyGames />;
      }
      if (categoryConfig.component === "casino-games") {
        return <CasinoGames />;
      }
      if (categoryConfig.component === "live-casino-games") {
        return <LiveCasinoGames />;
      }
      return null;
    }

    if (categoryConfig.type === "grid") {
      return (
        <CasinoGameGrid
          isCustom={categoryConfig.isCustom}
          category={categoryConfig.category}
          gameType={categoryConfig.gameType}
        />
      );
    }

    return null;
  };

  return (
    <>
      {activeMode === "home" && <EmblaBanner />}
      <ContentWrapper className="px-4">
        <div className="flex overflow-x-auto scrollbar-hide mb-4 mt-4">
          <div className="flex gap-1 min-w-max">
            {/* Search */}
            <button
              type="button"
              onClick={() =>
                (searchWidgetState.value = !searchWidgetState.value)
              }
              className="flex items-center gap-2 px-3 py-2 rounded-md whitespace-nowrap transition-all flex-shrink-0 text-sm font-semibold text-[#b1bad3] hover:text-white hover:bg-[#2f4553]"
            >
              <img
                src="/images/search.png"
                className="w-5 h-5 object-contain"
              />
              {t("Search") || "Search"}
            </button>
            {tabs.map((tab) => (
              <button
                onClick={() => {
                  setActiveTab(tab.key);
                }}
                key={tab.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-md whitespace-nowrap transition-all flex-shrink-0 text-sm font-semibold ${
                  activeTab === tab.key
                    ? "bg-[#2f4553] text-white"
                    : "text-[#b1bad3] hover:text-white hover:bg-[#213743]"
                }`}
              >
                <img
                  src={tab.icon}
                  alt={t(tab.name) || tab.name}
                  className="w-5 h-5 object-contain"
                />
                {t(tab.name) || tab.name}
              </button>
            ))}
          </div>
        </div>

        {renderCategory()}
        <div className="mt-[20px] w-full">
          <ProviderGroup />
        </div>
      </ContentWrapper>
    </>
  );
}
