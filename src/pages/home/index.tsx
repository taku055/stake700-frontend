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
        <div className="flex flex-col gap-4 mt-[20px] overflow-x-auto mb-4">
          <div className="flex w-fit gap-2 rounded-full p-2 bg-[var(--bar-background-color)]">
            {HOME_CATEGORIES.map((category) => (
              <Link
                href={`/?category=${category.category}`}
                key={category.key}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeCategory === category.category
                    ? "bg-[var(--background-secondary)] text-white"
                    : "text-[var(--text-color)] hover:bg-[var(--background-secondary)]"
                }`}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-4 h-4 grayscale object-contain"
                />
                {t(category.name) || category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Content based on activeTab */}
        {activeCategory === "" ? (
          <div className="flex flex-col gap-4">
            {HOME_CATEGORIES.filter((category) => category.category !== "").map(
              (category) => (
                <GameGroup
                  key={category.key}
                  category={category.category}
                  title={category.name}
                  isCustom={true}
                  viewallLink={`/?category=${category.category}`}
                />
              )
            )}
          </div>
        ) : (
          <div
            className={`w-full flex ${
              isMobile ? "flex-col" : "flex-row"
            } gap-6`}
          >
            <CasinoGameGrid
              isCustom={true}
              category={activeCategory}
              gameType="SLOT"
            />
          </div>
        )}
      </ContentWrapper>
    </>
  );
}
