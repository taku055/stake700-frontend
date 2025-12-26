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
          <TrendingGamesPanel />
          {/* <TopLinkBar /> */}
          {/* {TRENDING_CATEGORIES.map((category, index) => {
            // const isSelected = selectedCategory === category.path;
            return (
              <TrendingCategory  category={category.category} name={category.name} />
            );
          })} */}
          <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 mt-[20px]`}>

            <CasinoGameGrid
              games={games}
              total={total}
              loading={loading}
              offset={offset}
              onLoadMore={onLoadMore}
            />
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

