import { useMemo } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { CasinoGameGrid } from "@/pages/casino/components/CasinoGameGrid";
import { HOME_CATEGORIES } from "./data.ts";
import { useTranslations } from "@/context/I18nContext";
import GameGroup from "@/components/GameGroup";
import { useLocation } from "preact-iso";
import { Link } from "@/components/common";
import { EmblaBanner } from "@/components/EmblaBanner/EmblaBanner";
import ContentWrapper from "@/provider/ContentWrapper.tsx";
import { userState } from "@/state/userState.ts";
import TopGamesGroup from "@/components/TopGamesGroup/index.tsx";
import TrendingGamesGroup from "@/components/TrendingGamesGroup/index.tsx";
import Megaways from "@/components/Megaways/index.tsx";
import { searchWidgetState } from "@/state/searchWidgetState";

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

  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("HomePage");
  const activeCategory = useMemo(() => {
    return (
      HOME_CATEGORIES.find((cat) => cat.category === location.query.category)
        ?.category || HOME_CATEGORIES[0].category
    );
  }, [location.query.category]);

  return (
    <>
      <EmblaBanner />
      <ContentWrapper>
        <div className="flex justify-center overflow-x-auto scrollbar-hide mb-4 mt-4">
          <div className="flex gap-1 min-w-max">
            {/* Search */}
            <button
              type="button"
              onClick={() => (searchWidgetState.value = !searchWidgetState.value)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-sm font-medium text-[#aaaaaa] hover:text-white hover:bg-[#1e1e1e]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search
            </button>
            {HOME_CATEGORIES.map((category) => (
              <Link
                href={`/?category=${category.category}`}
                key={category.key}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-sm font-medium ${activeCategory === category.category
                    ? "bg-[#2a2a2a] text-white"
                    : "text-[#aaaaaa] hover:text-white hover:bg-[#1e1e1e]"
                  }`}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-4 h-4 object-contain"
                />
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Content based on activeTab */}
        {activeCategory === "" ? (
          <div className="flex flex-col gap-4">
            {HOME_CATEGORIES.filter((category) => category.category !== "").map(
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
              isCustom={activeCategory === "pragmatic" ? false : true}
              category={activeCategory}
              gameType="SLOT"
              provider={activeCategory === "pragmatic" ? "5af8ec20d4b1198738df2967a01b0d7c52246b97" : undefined}
            />
          </div>
        )}
      </ContentWrapper>
    </>
  );
}
