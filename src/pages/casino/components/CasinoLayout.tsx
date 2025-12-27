import { FunctionalComponent } from "preact";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import GameFilterSidebar from "@/components/GameFilterSidebar";
import { PromotionSection } from "../PromotionSection";
import { CasinoGameGrid } from "./CasinoGameGrid";
import TopLinkBar from "@/components/TopLinkBar";
import TrendingGamesPanel from "@/components/TrendingGamesPanel";
import { EmblaBanner } from "@/pages/home/components/EmblaBanner";
import { useEffect, useState } from "preact/hooks";
import { localeState } from "@/state/localeState";
import { getCachedCategoryCount, getCategoryGameCount } from "@/components/NavigationSidebar/categoryData";
import { useCasinoCategories } from "@/hooks/useCasinoCategories";
import TrendingCategory from "./TrendingCategory";
import { TRENDING_CATEGORIES } from "./categoriesData";
import { useTranslations } from "@/context/I18nContext";
import GuideCard from "./GuideCard";

interface CasinoLayoutProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedProviders: string[];
  onProvidersChange: (providers: string[]) => void;
  selectedCategory: string;
  onCategoryChange: (category: string | null) => void;
  games: any[];
  total: number;
  loading: boolean;
  offset: number;
  onLoadMore: () => void;
}

export const CasinoLayout: FunctionalComponent<CasinoLayoutProps> = ({
  searchQuery,
  onSearchChange,
  selectedProviders,
  onProvidersChange,
  selectedCategory,
  onCategoryChange,
  games,
  total,
  loading,
  offset,
  onLoadMore,
}) => {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const { categories, getCachedCategoryCount, getCategoryGameCount } = useCasinoCategories();

  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Array<{
    name: string;
    path: string;
    icon: string;
    count?: number;
  }>>([]);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const t = useTranslations("HomePage");

  const guideCards = [
    {
      icon: "/images/be-part.svg",
      title: t("guide_card_exclusive_games_title") || "Be Part of Exclusive Games",
      content: t("guide_card_exclusive_games_content") || "Enjoy exclusive premium games",
    },
    {
      icon: "/images/games-favorite.svg",
      title: t("guide_card_favorite_games_title") || "Make Games Favorite",
      content: t("guide_card_favorite_games_content") || "Access your favorite games instantly",
    },
    {
      icon: "/images/contact-support.svg",
      title: t("guide_card_contact_support_title") || "Contact Support 24/7",
      content: t("guide_card_contact_support_content") || "Contact us for any issues with live chat",
    },
  ];

  useEffect(() => {
    const loadCategoryCounts = async () => {
      // Use cached values initially
      const categoriesWithCountsData = categories.map((cat) => ({
        ...cat,
        count: getCachedCategoryCount(cat.path),
      }));
      setCategoriesWithCounts(categoriesWithCountsData);
      // console.log("categoriesWithCountsData", categoriesWithCountsData);

      // Load counts asynchronously
      categories.forEach((cat) => {
        getCategoryGameCount(cat.path).then((count) => {
          setCategoriesWithCounts((prev) => {
            return prev.map((c) => (c.path === cat.path ? { ...c, count } : c));
          });
        }).catch((error) => {
          console.error(`Error loading count for ${cat.path}:`, error);
        });
      });
    };
    loadCategoryCounts();
  }, [categories, getCachedCategoryCount, getCategoryGameCount]);


  return (
    <div className="w-full flex flex-col gap-3">
      {/* <PromotionSection showAppleImage={false} /> */}
      <EmblaBanner />
      <div className="flex gap-3">
        {/* <GameFilterSidebar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedProviders={selectedProviders}
          onProvidersChange={onProvidersChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        /> */}
        <div className="max-w-[1200px] w-full h-full mx-auto">

          <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 mt-[20px]`}>

            <CasinoGameGrid
              games={games}
              total={total}
              loading={loading}
              offset={offset}
              onLoadMore={onLoadMore}
              selectedCategory={selectedCategory}
            />
          </div>
          {/* <TrendingGamesPanel /> */}
          {/* <TopLinkBar /> */}
          {TRENDING_CATEGORIES.map((category, index) => {
            // const isSelected = selectedCategory === category.path;
            return (
              <TrendingCategory category={category.category} name={category.name} />
            );
          })}

          <div className="w-full flex flex-col gap-4 md:flex-row items-center justify-center bg-gradient-to-b from-[rgba(11, 22, 41, 0.5)] to-[#122543]">
            {guideCards.map((guide) => (
              <div className="flex-1 flex items-center justify-center py-8">
                <GuideCard key={guide.title} {...guide} />
              </div>
            ))}
          </div>

        </div>
      </div>
      {/* <div className="max-w-[1200px] w-full mx-auto">
        <TrendingGamesPanel />
        <TopLinkBar />
        <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 mt-[20px]`}>
          
          <CasinoGameGrid
            games={games}
            total={total}
            loading={loading}
            offset={offset}
            onLoadMore={onLoadMore}
          />
        </div>
      </div> */}
    </div>
  );
};

