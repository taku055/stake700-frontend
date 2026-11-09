import { useMemo } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { searchWidgetState } from "@/state/searchWidgetState";
import ContentWrapper from "@/provider/ContentWrapper.tsx";
import { userState } from "@/state/userState.ts";
import { useLocation } from "preact-iso";
import { CasinoGameGrid } from "@/pages/casino/components/CasinoGameGrid";
import {
  CASINO_CATEGORY_PAGE_BY_PATH,
  CASINO_CATEGORY_PAGES,
  CASINO_CATEGORY_PAGE_QUERY_KEY,
  type CasinoCategoryPageKey,
} from "./data";

function resolvePageKey(path: string, queryPage?: string): CasinoCategoryPageKey {
  if (queryPage && queryPage in CASINO_CATEGORY_PAGES) {
    return queryPage as CasinoCategoryPageKey;
  }
  return CASINO_CATEGORY_PAGE_BY_PATH[path] ?? "top-casino";
}

export default function CasinoCategoryPage() {
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

  const t = useTranslations("CasinoPage");
  const pageKey = useMemo(
    () =>
      resolvePageKey(
        location.path,
        location.query?.[CASINO_CATEGORY_PAGE_QUERY_KEY]
      ),
    [location.path, location.query]
  );
  const config = CASINO_CATEGORY_PAGES[pageKey];

  const renderContent = () => {
    if (config.render.type === "grid") {
      return (
        <CasinoGameGrid
          isCustom={config.render.isCustom}
          category={config.render.category}
          gameType={config.render.gameType}
        />
      );
    }
    return null;
  };

  return (
    <ContentWrapper className="px-4 md:px-20">
      <div className="flex overflow-x-auto scrollbar-hide mb-4 mt-4">
        <div className="flex gap-1 min-w-max">
          <button
            type="button"
            onClick={() => (searchWidgetState.value = !searchWidgetState.value)}
            className="flex items-center gap-2 px-3 py-2 rounded-md whitespace-nowrap transition-all flex-shrink-0 text-sm font-semibold text-[#b1bad3] hover:text-white hover:bg-[#2f4553]"
          >
            <img src="/images/search.png" className="w-5 h-5 object-contain" />
            {t("Search")}
          </button>
          <button
            key={config.tab.key}
            className="flex items-center gap-2 px-3 py-2 rounded-md whitespace-nowrap transition-all flex-shrink-0 text-sm font-semibold bg-[#2f4553] text-white"
          >
            <img
              src={config.tab.icon}
              alt={t(config.tab.name) || config.tab.name}
              className="w-5 h-5 object-contain"
            />
            {t(config.tab.name) || config.tab.name}
          </button>
        </div>
      </div>

      {renderContent()}
    </ContentWrapper>
  );
}
