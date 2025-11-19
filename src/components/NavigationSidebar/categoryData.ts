import { customGamesState } from "@/state/customGamesState";
import { apiGetGames } from "@/api/common/apiGetGames";
import { categoryCountsCache, categoryCountsLoaded } from "@/state/categoryCountsState";

export interface CategoryItem {
  name: string;
  path: string;
  icon: string;
  count?: number;
}

// Static categories list - always shown
export const STATIC_CATEGORIES: Array<{ name: string; path: string; icon?: string }> = [
  {
    name: "Top Slots",
    path: "/casino/slots?custom=1&category=slot-top-slots",
  },
  {
    name: "All Games",
    path: "/casino/slots",
  },
  {
    name: "Popular Games",
    path: "/casino/slots?custom=1&category=slot-popular",
  },
  {
    name: "New",
    path: "/casino/slots?custom=1&category=slot-new",
  },
  {
    name: "Jackpots",
    path: "/casino/slots?custom=1&category=slot-jackpots",
  },
  {
    name: "Buy Bonus",
    path: "/casino/slots?custom=1&category=slot-buy-bonus",
  },
  {
    name: "Megaways",
    path: "/casino/slots?custom=1&category=megaways",
  },
  {
    name: "Classic Slots",
    path: "/casino/slots?custom=1&category=classic-slots",
  },
  {
    name: "Video Slots",
    path: "/casino/slots?custom=1&category=video-slots",
  },
  {
    name: "Drop Wins",
    path: "/casino/slots?custom=1&category=drop-wins",
  },
  {
    name: "Table Games",
    path: "/casino/games?category=table-games",
  },
  {
    name: "Video Poker",
    path: "/casino/games?category=video-poker",
  },
  {
    name: "Video Bingo",
    path: "/casino/games?category=video-bingo",
  },
  {
    name: "Scratch Games",
    path: "/casino/games?category=scratch-games",
  },
  {
    name: "Instant Game",
    path: "/casino/games?category=instant-game",
  },
  {
    name: "Fishing & Hunting",
    path: "/casino/games?category=fishing-hunting",
  },
  {
    name: "Casual Games",
    path: "/casino/games?category=casual-games",
  },
  {
    name: "Other Games",
    path: "/casino/games?category=other-games",
  },
];

// Map category names/paths to sidebar SVG icons
const getCategoryIcon = (categoryName: string, path: string): string => {
  const name = categoryName.toLowerCase();
  const pathLower = path.toLowerCase();
  
  // Map based on category name or path
  if (name.includes("top slots") || pathLower.includes("top-slots")) {
    return "/images/sidebar/top-slots.svg";
  }
  if (name.includes("all games") || pathLower.includes("all-games")) {
    return "/images/sidebar/all-games.svg";
  }
  if (name.includes("popular") || pathLower.includes("popular")) {
    return "/images/sidebar/popular-games.svg";
  }
  if (name.includes("new") || pathLower.includes("slot-new")) {
    return "/images/sidebar/new.svg";
  }
  if (name.includes("jackpot") || pathLower.includes("jackpot")) {
    return "/images/sidebar/lottery-games.svg";
  }
  if (name.includes("buy bonus") || pathLower.includes("buy-bonus")) {
    return "/images/sidebar/buy-bonus.svg";
  }
  if (name.includes("megaways") || pathLower.includes("megaways")) {
    return "/images/sidebar/megaways.svg";
  }
  if (name.includes("classic slots") || pathLower.includes("classic")) {
    return "/images/sidebar/classic-slots.svg";
  }
  if (name.includes("video slots") || pathLower.includes("video-slots")) {
    return "/images/sidebar/video-slots.svg";
  }
  if (name.includes("drop wins") || pathLower.includes("drop-wins")) {
    return "/images/sidebar/drop-wins.svg";
  }
  if (name.includes("table games") || pathLower.includes("table")) {
    return "/images/sidebar/table-games.svg";
  }
  if (name.includes("video poker") || pathLower.includes("video-poker")) {
    return "/images/sidebar/video-poker.svg";
  }
  if (name.includes("video bingo") || pathLower.includes("video-bingo")) {
    return "/images/sidebar/video-bingo.svg";
  }
  if (name.includes("scratch") || pathLower.includes("scratch")) {
    return "/images/sidebar/scratch-games.svg";
  }
  if (name.includes("instant") || pathLower.includes("instant")) {
    return "/images/sidebar/instant-game.svg";
  }
  if (name.includes("fishing") || pathLower.includes("fishing")) {
    return "/images/sidebar/fishing-hunting.svg";
  }
  if (name.includes("casual") || pathLower.includes("casual")) {
    return "/images/sidebar/casual-games.svg";
  }
  if (name.includes("other") || pathLower.includes("other")) {
    return "/images/sidebar/other-games.svg";
  }
  if (name.includes("favourites") || name.includes("favorites") || pathLower.includes("favourite")) {
    return "/images/sidebar/favourites.svg";
  }
  
  // Default icon
  return "/images/sidebar/all-games.svg";
};

// Get game count for a category based on its path (with caching)
export const getCategoryGameCount = async (path: string): Promise<number> => {
  // Check cache first
  if (categoryCountsCache.value[path] !== undefined) {
    return categoryCountsCache.value[path];
  }

  try {
    // Extract category and custom params from path
    const url = new URL(path, window.location.origin);
    const custom = url.searchParams.get("custom");
    const category = url.searchParams.get("category");
    const provider = url.searchParams.get("provider");

    let count = 0;

    if (custom === "1" && category) {
      // Custom category - count from customGamesState
      count = customGamesState.value.filter((c) => c.category === category).length;
    } else if (category) {
      // Regular category - fetch count from API
      const result = await apiGetGames({
        category: category,
        limit: 1,
        provider: provider || undefined,
      });
      count = result.total || 0;
    } else if (path.includes("/casino/slots")) {
      // All Games - fetch total count from API with category="slots"
      const result = await apiGetGames({
        category: "slots",
        limit: 1,
        provider: provider || undefined,
      });
      count = result.total || 0;
    } else if (path.includes("/casino/games")) {
      // All games in /casino/games - fetch total count from API
      const result = await apiGetGames({
        category: category || undefined,
        limit: 1,
        provider: provider || undefined,
      });
      count = result.total || 0;
    }

    // Cache the result
    categoryCountsCache.value = {
      ...categoryCountsCache.value,
      [path]: count,
    };

    return count;
  } catch (error) {
    console.error("Error getting category count:", error);
    return 0;
  }
};

// Initialize and load all category counts once
export const initializeCategoryCounts = async (
  categories: Array<{ name: string; path: string; icon?: string }>
): Promise<void> => {
  if (categoryCountsLoaded.value) {
    return; // Already loaded
  }

  try {
    const categoriesWithIcons = processCategories(categories);
    const counts: Record<string, number> = {};

    // Load all counts in parallel
    await Promise.all(
      categoriesWithIcons.map(async (cat) => {
        const count = await getCategoryGameCount(cat.path);
        counts[cat.path] = count;
      })
    );

    // Update cache
    categoryCountsCache.value = counts;
    categoryCountsLoaded.value = true;
  } catch (error) {
    console.error("Error initializing category counts:", error);
  }
};

// Get cached count (synchronous, returns undefined if not cached)
export const getCachedCategoryCount = (path: string): number | undefined => {
  return categoryCountsCache.value[path];
};

// Process categories and add icons
export const processCategories = (
  categories: Array<{ name: string; path: string; icon?: string }>
): CategoryItem[] => {
  return categories.map((cat) => ({
    name: cat.name,
    path: cat.path,
    icon: cat.icon || getCategoryIcon(cat.name, cat.path),
  }));
};

// Map navigation keys to sidebar SVG icons
export const getNavIcon = (key: string): string => {
  const iconMap: Record<string, string> = {
    slots: "/images/sidebar/casino.svg",
    "live-casino": "/images/sidebar/live-casino.svg",
    sport: "/images/sidebar/sportsbook.svg",
    promotions: "/images/sidebar/promotions.svg",
  };
  return iconMap[key] || "/images/sidebar/casino.svg";
};
