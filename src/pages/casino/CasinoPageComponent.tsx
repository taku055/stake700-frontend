import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";
import { useCategoryFromUrl } from "./hooks/useCategoryFromUrl";
import { useUrlSync } from "./hooks/useUrlSync";
import { useCasinoGames } from "./hooks/useCasinoGames";
import { CasinoLayout } from "./components/CasinoLayout";
import { STATIC_CATEGORIES } from "@/components/NavigationSidebar/categoryData";

export default function CasinoPageComponent() {
  const location = useLocation();
  
  if (userState.value?.isSuperAgent) {
    location.route("/superagent");
    return null;
  }

  if (userState.value?.isAgent) {
    location.route("/agent");
    return null;
  }

  // Get category from URL
  const { selectedCategory } = useCategoryFromUrl();

  // Sync URL params with state
  const {
    searchQuery,
    setSearchQuery,
    selectedProviders,
    setSelectedProviders,
  } = useUrlSync();

  // Load games
  const {
    games,
    loading,
    total,
    offset,
    loadMore,
  } = useCasinoGames({
    selectedCategory,
    searchQuery,
    selectedProviders,
  });

  // Handle category change
  const handleCategoryChange = (categoryPath: string | null) => {
    if (categoryPath) {
      location.route(categoryPath);
    } else {
      // If null, navigate to default "All Games"
      const allGamesCategory = STATIC_CATEGORIES.find(cat => cat.name === "All Games");
      if (allGamesCategory) {
        location.route(allGamesCategory.path);
      }
    }
  };

  return (
    <CasinoLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedProviders={selectedProviders}
      onProvidersChange={setSelectedProviders}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      games={games}
      total={total}
      loading={loading}
      offset={offset}
      onLoadMore={loadMore}
    />
  );
}
