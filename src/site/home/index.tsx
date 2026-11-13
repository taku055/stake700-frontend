import { useEffect, useMemo, useState } from "react";
import { CasinoGameGrid } from "@/site/casino/components/CasinoGameGrid";
import { CasinoHeader } from "@/site/casino/components/CasinoHeader";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "@/router";
import ContentWrapper from "@/provider/ContentWrapper";
import { userState } from "@/state/userState";
import SearchWidget from "@/components/Header/SearchWidget";
import LobbyGames from "./LobbyGames";
import LiveCasinoGames from "./LiveCasinoGames";
import CasinoGames from "./CasinoGames";
import { HOME_PAGE_TABS, type HomePageMode } from "./tabData";
import { HOME_PAGE_CATEGORIES, HOME_PAGE_DEFAULT_TAB } from "./categoryData";
import ProviderGroup from "@/components/ProviderGroup/index";
import HomeStage from "./HomeStage";

const HOME_PAGE_MODE_QUERY_KEY = "page";

const HOME_PAGE_MODE_BY_PATH: Record<string, HomePageMode> = {
  "/": "home",
  "/lobby-casino": "lobby-casino",
  "/lobby-live-casino": "lobby-live-casino",
};

export default function HomePage() {
  const location = useLocation();

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

  const tabs = HOME_PAGE_TABS[activeMode];
  const defaultTab = HOME_PAGE_DEFAULT_TAB[activeMode];
  const categories = HOME_PAGE_CATEGORIES[activeMode];
  const t = useTranslations(activeMode === "home" ? "HomePage" : "CasinoPage");
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [total, setTotal] = useState<number | undefined>(undefined);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, activeMode]);

  useEffect(() => {
    setTotal(undefined);
  }, [activeTab, activeMode]);

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

  if (activeMode === "home") {
    return <HomeStage />;
  }

  const section = activeMode === "lobby-live-casino" ? "live-casino" : "slots";
  const categoryConfig = categories[activeTab];
  const isGrid = categoryConfig?.type === "grid";
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];

  const renderCategory = () => {
    if (!categoryConfig || categoryConfig.type === "empty") return null;

    if (categoryConfig.type === "component") {
      if (categoryConfig.component === "lobby-games") return <LobbyGames />;
      if (categoryConfig.component === "casino-games") return <CasinoGames />;
      if (categoryConfig.component === "live-casino-games") return <LiveCasinoGames />;
      return null;
    }

    return (
      <CasinoGameGrid
        key={`${activeMode}-${activeTab}`}
        isCustom={categoryConfig.isCustom}
        category={categoryConfig.category}
        gameType={categoryConfig.gameType}
        onTotalChange={setTotal}
      />
    );
  };

  return (
    <ContentWrapper>
      <div className="flex w-full flex-col gap-5 md:gap-7">
        <CasinoHeader
          section={section}
          title={activeTab === "" ? t("Lobby") : t(currentTab.name, undefined, currentTab.name)}
          icon={currentTab.icon}
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          tabs={tabs.map((tab) => ({
            key: tab.key,
            label: t(tab.name, undefined, tab.name),
            icon: tab.icon,
          }))}
          total={isGrid ? total : undefined}
          loading={isGrid && total === undefined}
        />

        <div className="relative z-30">
          <SearchWidget className="" />
        </div>

        <div className="flex flex-col gap-8 md:gap-10">{renderCategory()}</div>

        <div className="mt-2">
          <ProviderGroup category={section} />
        </div>
      </div>
    </ContentWrapper>
  );
}
