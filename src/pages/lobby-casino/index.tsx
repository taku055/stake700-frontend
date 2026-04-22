import { useMemo, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { CasinoGameGrid } from "@/pages/casino/components/CasinoGameGrid";
import { HOME_TABS } from "./data.ts";
import { useTranslations } from "@/context/I18nContext";
import GameGroup from "@/components/GameGroup";
import { useLocation } from "preact-iso";
import { Link } from "@/components/common";
import { EmblaBanner } from "@/components/EmblaBanner/EmblaBanner";
import ContentWrapper from "@/provider/ContentWrapper.tsx";
import { userState } from "@/state/userState.ts";
import TopGamesGroup from "@/components/TopGamesGroup/index.tsx";
import TrendingGamesGroup from "@/components/TrendingGamesGroup/index.tsx";
import { searchWidgetState } from "@/state/searchWidgetState";
import LobbyGames from "./LobbyGames.tsx";
import LiveCasinoGames from "./LiveCasinoGames.tsx";
import CasinoGames from "./CasinoGames.tsx";
import Jackpots from "./Jackpots.tsx";
import Megaways from "./Megaways.tsx";

interface LobbyCasinoProps {
  defaultTab?: string;
}

export default function LobbyCasino({ defaultTab = '' }: LobbyCasinoProps) {
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

  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("CasinoPage");
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <>
      <ContentWrapper className="px-4 md:px-20">
        <div className="flex overflow-x-auto scrollbar-hide mb-4 mt-4">
          <div className="flex gap-1 min-w-max">
            {/* Search */}
            <button
              type="button"
              onClick={() => (searchWidgetState.value = !searchWidgetState.value)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-lg font-medium text-[#99897a] hover:text-white hover:bg-[rgb(54,48,43)]"
            >
              <img src="/images/search.png"
                className="w-5 h-5 object-contain"
              />
              {t("Search")}
            </button>
            {HOME_TABS.map((tab) => (
              <button
                onClick={() => {
                  setActiveTab(tab.category)
                }}
                key={tab.key}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-lg  font-medium ${activeTab === tab.category
                  ? "bg-[rgb(54,48,43)] text-[#f0d9c6]"
                  : "text-[#99897a] hover:text-white hover:bg-[#1e1e1e]"
                  }`}
              >
                <img
                  src={tab.icon}
                  alt={t(tab.name)}
                  className="w-5 h-5 object-contain"
                />
                {t(tab.name)}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on activeTab */}
        {activeTab === "" && <LobbyGames setActiveTab={setActiveTab} />}
        {activeTab === "slots" && <CasinoGameGrid isCustom={false} category="casino" gameType="SLOT" />}
        {activeTab === "top" && <CasinoGameGrid isCustom={true} category="top" gameType="SLOT" />}
        {activeTab === "new" && <CasinoGameGrid isCustom={true} category="new" gameType="SLOT" />}
        {activeTab === "popular" && <CasinoGameGrid isCustom={true} category="popular" gameType="SLOT" />}
        {activeTab === "buy-bonus" && <CasinoGameGrid isCustom={true} category="buy-bonus" gameType="SLOT" />}
        {activeTab === "megaways" && <Megaways />}
        {activeTab === "table-games" && <CasinoGameGrid isCustom={true} category="table-games" gameType="SLOT" />}
        {activeTab === "jackpots" && <Jackpots />}

        {/* {activeTab === "" ? (
          <div className="flex flex-col gap-4">
            {HOME_TABS.filter((category) => category.category !== "").map(
              (category) => {
                if (category.category == 'top-games') {
                  return (
                    <TopGamesGroup
                      key={category.key}
                      category={category.category}
                      title={t(category.name) || category.name}
                      isCustom={category.provider ? false : true}
                      provider={category.provider}
                      viewallLink={category.provider ? `/casino/slots?providerId=${category.provider}` : `/?category=${category.category}`}
                    />
                  )
                }
                if (category.category == 'trending') {
                  return (
                    <TrendingGamesGroup
                      key={category.key}
                      category={category.category}
                      title={t(category.name) || category.name}
                      isCustom={category.provider ? false : true}
                      provider={category.provider}
                      viewallLink={category.provider ? `/casino/slots?providerId=${category.provider}` : `/?category=${category.category}`}
                    />
                  )
                }
                if (category.category == 'megaways') {
                  return (
                    <Megaways
                      key={category.key}
                      category={category.category}
                      title={t(category.name) || category.name}
                      isCustom={category.provider ? false : true}
                      provider={category.provider}
                      viewallLink={category.provider ? `/casino/slots?providerId=${category.provider}` : `/?category=${category.category}`}
                    />
                  )
                }

                return (
                  <GameGroup
                    key={category.key}
                    category={category.category}
                    title={t(category.name) || category.name}
                    isCustom={category.provider ? false : true}
                    provider={category.provider}
                    viewallLink={category.provider ? `/casino/slots?providerId=${category.provider}` : `/?category=${category.category}`}
                  />)
              }


            )}
          </div>
        ) : (
          <div
            className={`w-full flex ${isMobile ? "flex-col" : "flex-row"
              } gap-6`}
          >
            <CasinoGameGrid
              isCustom={activeTab === "pragmatic" ? false : true}
              category={activeTab}
              gameType="SLOT"
              provider={activeTab === "pragmatic" ? "5af8ec20d4b1198738df2967a01b0d7c52246b97" : undefined}
            />
          </div>
        )} */}
      </ContentWrapper>
    </>
  );
}
