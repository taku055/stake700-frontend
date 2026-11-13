import { useMemo, useState } from "react";
import { useTranslations } from "@/context/I18nContext";
import ContentWrapper from "@/provider/ContentWrapper";
import { userState } from "@/state/userState";
import { useLocation } from "@/router";
import SearchWidget from "@/components/Header/SearchWidget";
import { CasinoGameGrid } from "@/site/casino/components/CasinoGameGrid";
import { CasinoHeader } from "@/site/casino/components/CasinoHeader";
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
  const t = useTranslations("CasinoPage");
  const [total, setTotal] = useState<number | undefined>(undefined);

  const pageKey = useMemo(
    () => resolvePageKey(location.path, location.query?.[CASINO_CATEGORY_PAGE_QUERY_KEY]),
    [location.path, location.query]
  );

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

  const config = CASINO_CATEGORY_PAGES[pageKey];

  return (
    <ContentWrapper>
      <div className="flex w-full flex-col gap-5 md:gap-6">
        <CasinoHeader
          section={config.section}
          activeTab={pageKey}
          title={t(config.tab.name, undefined, config.tab.name)}
          icon={config.tab.icon}
          total={total}
          loading={total === undefined}
        />

        <div className="relative z-30">
          <SearchWidget className="" />
        </div>

        {config.render.type === "grid" && (
          <CasinoGameGrid
            key={pageKey}
            isCustom={config.render.isCustom}
            category={config.render.category}
            gameType={config.render.gameType}
            onTotalChange={setTotal}
          />
        )}
      </div>
    </ContentWrapper>
  );
}
