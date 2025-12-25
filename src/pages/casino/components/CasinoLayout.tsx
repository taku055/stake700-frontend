import { FunctionalComponent } from "preact";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import GameFilterSidebar from "@/components/GameFilterSidebar";
import { PromotionSection } from "../PromotionSection";
import { CasinoGameGrid } from "./CasinoGameGrid";
import TopLinkBar from "@/components/TopLinkBar";
import TrendingGamesPanel from "@/components/TrendingGamesPanel";

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

  return (
    <div className="w-full flex flex-col gap-3">
      <PromotionSection showAppleImage={false} />
      <TrendingGamesPanel />
      {/* <TopLinkBar /> */}
      <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 mt-[20px]`}>
        {/* Left Sidebar */}
        {/* <GameFilterSidebar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedProviders={selectedProviders}
          onProvidersChange={onProvidersChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        /> */}

        {/* Right Side - Game Cards Panel */}
        <CasinoGameGrid
          games={games}
          total={total}
          loading={loading}
          offset={offset}
          onLoadMore={onLoadMore}
        />
      </div>
    </div>
  );
};

