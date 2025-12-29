import { FunctionalComponent } from "preact";
import { useEffect, useState, useMemo, useCallback } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import GameFilterSidebar from "@/components/GameFilterSidebar";
import { PromotionSection } from "../PromotionSection";
import { CasinoGameGrid } from "./CasinoGameGrid";
import TopLinkBar from "@/components/TopLinkBar";
import TrendingGamesPanel from "@/components/TrendingGamesPanel";
import { EmblaBanner } from "@/pages/home/components/EmblaBanner";
import { localeState } from "@/state/localeState";
import { useCasinoGames } from "@/hooks/useCasinoGames";
import { getCachedCategoryCount, getCategoryGameCount } from "@/components/NavigationSidebar/categoryData";
import { useCasinoCategories } from "@/hooks/useCasinoCategories";
import TrendingCategory from "./TrendingCategory";
import { TRENDING_CATEGORIES } from "./categoriesData";
import { useTranslations } from "@/context/I18nContext";
import GuideCard from "./GuideCard";
import { FaThLarge } from "react-icons/fa";
import ProviderGroup from "@/components/ProviderGroup";
import EmulateBetting from "@/components/EmulateBetting";
import { ProviderSelection } from "@/pages/live/components/ProviderSelection";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { tProvider } from "@/types/tProvider";
import { GameSearchPanel } from "@/pages/live/components/GameSearchPanel";

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
  const [providers, setProviders] = useState<tProvider[]>([]);
  const ALL_PROVIDERS_ID = "__ALL_PROVIDERS__";

  console.log("selectedProviders", selectedProviders);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetProviders("SLOT");
        setProviders(res);
        console.log("providers", res);
      } catch (error) {
        console.error("Error loading providers:", error);
      }
    })();
  }, []);

  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Array<{
    name: string;
    path: string;
    icon: string;
    count?: number;
  }>>([]);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const t = useTranslations("HomePage");
  const [activeTab, setActiveTab] = useState<string>("lobby");

  // Get the category path for the active tab (when on home category)
  const activeTabCategory = useMemo(() => {
    if (selectedCategory === "/casino/home?custom=1&category=home" && activeTab !== "lobby") {
      return TRENDING_CATEGORIES[activeTab]?.selectedCategory || selectedCategory;
    }
    return selectedCategory;
  }, [activeTab, selectedCategory]);

  // Load games locally for the active tab category when on home with a tab selected
  const localGamesResult = useCasinoGames({
    selectedCategory: activeTabCategory,
    searchQuery,
    selectedProviders,
  });

  // Use local games when on home category with a tab selected, otherwise use parent games
  const displayGames = useMemo(() => {
    if (selectedCategory === "/casino/home?custom=1&category=home" && activeTab !== "lobby") {
      return localGamesResult.games;
    }
    return games;
  }, [selectedCategory, activeTab, localGamesResult.games, games]);

  const displayTotal = useMemo(() => {
    if (selectedCategory === "/casino/home?custom=1&category=home" && activeTab !== "lobby") {
      return localGamesResult.total;
    }
    return total;
  }, [selectedCategory, activeTab, localGamesResult.total, total]);

  const displayLoading = useMemo(() => {
    if (selectedCategory === "/casino/home?custom=1&category=home" && activeTab !== "lobby") {
      return localGamesResult.loading;
    }
    return loading;
  }, [selectedCategory, activeTab, localGamesResult.loading, loading]);

  const displayOffset = useMemo(() => {
    if (selectedCategory === "/casino/home?custom=1&category=home" && activeTab !== "lobby") {
      return localGamesResult.offset;
    }
    return offset;
  }, [selectedCategory, activeTab, localGamesResult.offset, offset]);

  const handleLoadMore = useMemo(() => {
    if (selectedCategory === "/casino/home?custom=1&category=home" && activeTab !== "lobby") {
      return localGamesResult.loadMore;
    }
    return onLoadMore;
  }, [selectedCategory, activeTab, localGamesResult.loadMore, onLoadMore]);

  // Reset activeTab to lobby when navigating to home category
  useEffect(() => {
    if (selectedCategory === "/casino/home?custom=1&category=home") {
      setActiveTab("lobby");
    }
  }, [selectedCategory]);

  // Add these after the providers state and ALL_PROVIDERS_ID constant (around line 56-70)

  // Check if "All Providers" is selected
  const isAllProvidersSelected = useMemo(() => {
    return selectedProviders.includes(ALL_PROVIDERS_ID);
  }, [selectedProviders]);

  // Get individual providers (excluding ALL_PROVIDERS_ID)
  const individualProviders = useMemo(() => {
    return selectedProviders.filter(id => id !== ALL_PROVIDERS_ID);
  }, [selectedProviders]);

  // Toggle provider selection
  const toggleProvider = useCallback((providerId: string) => {
    if (providerId === ALL_PROVIDERS_ID) {
      // Toggle "All Providers"
      if (isAllProvidersSelected) {
        onProvidersChange([]);
      } else {
        onProvidersChange([ALL_PROVIDERS_ID]);
      }
    } else {
      // Toggle individual provider
      if (isAllProvidersSelected) {
        // If "All Providers" is selected, replace it with this provider
        onProvidersChange([providerId]);
      } else {
        // Toggle individual provider
        const newProviders = individualProviders.includes(providerId)
          ? individualProviders.filter((id) => id !== providerId)
          : [...individualProviders, providerId];

        // If no providers selected, default to "All Providers"
        if (newProviders.length === 0) {
          onProvidersChange([ALL_PROVIDERS_ID]);
        } else {
          onProvidersChange(newProviders);
        }
      }
    }
  }, [isAllProvidersSelected, individualProviders, onProvidersChange]);

  // Reset provider selection
  const resetProviders = useCallback(() => {
    onProvidersChange([ALL_PROVIDERS_ID]);
  }, [onProvidersChange]);

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
        <div className="max-w-[1200px] w-full h-full gap-4 flex flex-col mx-auto">

          {/* Check if this is home category */}
          {selectedCategory === "/casino/home?custom=1&category=home" ? (
            <>
              {/* TabList - always visible */}
              <div className="flex flex-col gap-4 mt-[20px]">
                {/* <GameSearchPanel
                  searchQuery={searchQuery}
                  onSearchChange={onSearchChange}
                  onSearchClick={() => {
                    // Search is handled automatically by useCasinoGames hook when searchQuery changes
                  }}
                /> */}
                <div className="flex w-fit gap-2 mb-4 overflow-x-auto rounded-full p-2 bg-[var(--bar-background-color)]">

                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeTab === "lobby"
                      ? "bg-[var(--background-secondary)] text-white"
                      : "text-[var(--text-color)] hover:bg-[var(--background-secondary)]"
                      }`}
                    onClick={() => setActiveTab("lobby")}
                  >
                    <FaThLarge className="w-4 h-4 grayscale object-contain" />
                    {t("Lobby") || "Lobby"}
                  </button>
                  {Object.values(TRENDING_CATEGORIES).map((category) => (
                    <button
                      key={category.key}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeTab === category.key
                        ? "bg-[var(--background-secondary)] text-white"
                        : "text-[var(--text-color)] hover:bg-[var(--background-secondary)]"
                        }`}
                      onClick={() => setActiveTab(category.key)}
                    >
                      <img src={category.icon} alt={category.name} className="w-4 h-4 grayscale object-contain" />
                      {t(category.name) || category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content based on activeTab */}
              {activeTab === "lobby" ? (
                <div className="flex flex-col gap-4">
                  {Object.values(TRENDING_CATEGORIES).map((category) => (
                    <TrendingCategory
                      key={category.key}
                      category={category.category}
                      name={category.name}
                    />
                  ))}
                </div>
              ) : (
                <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6`}>
                  <CasinoGameGrid
                    games={displayGames}
                    total={displayTotal}
                    loading={displayLoading}
                    offset={displayOffset}
                    onLoadMore={handleLoadMore}
                    selectedCategory={TRENDING_CATEGORIES[activeTab]?.selectedCategory || selectedCategory}
                  />
                </div>
              )}
            </>
          ) : (
            /* Regular category view - not home or trending category */
            <div className={`w-full flex flex-col gap-6 mt-[20px]`}>
              <GameSearchPanel
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                onSearchClick={() => {
                  // Search is handled automatically by useCasinoGames hook when searchQuery changes
                }}
              />
              <ProviderSelection
                providers={providers}
                selectedProviders={selectedProviders}
                allProvidersId={ALL_PROVIDERS_ID}
                isAllProvidersSelected={isAllProvidersSelected}
                onToggleProvider={toggleProvider}
                onResetProviders={resetProviders}
                selectedCategory={selectedCategory}
              />
              <CasinoGameGrid
                games={games}
                total={total}
                loading={loading}
                offset={offset}
                onLoadMore={onLoadMore}
                selectedCategory={selectedCategory}
              />
            </div>
          )}
          <ProviderGroup />
          <div className="flex flex-col pb-4">
            <EmulateBetting />
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

