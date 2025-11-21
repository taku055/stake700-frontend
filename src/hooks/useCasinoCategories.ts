import { useMemo, useEffect } from "preact/hooks";
import { customGamesState } from "@/state/customGamesState";
import { apiGetGames } from "@/api/common/apiGetGames";
import { categoryCountsCache } from "@/state/categoryCountsState";
import { effect } from "@preact/signals";

export interface CategoryItem {
  name: string;
  path: string;
  icon: string;
  count?: number;
}

// Static categories list - always shown
const STATIC_CATEGORIES: Array<{ name: string; path: string; icon?: string }> = [
  {
    name: "All Games",
    path: "/casino/slots",
  },
  {
    name: "Top Slots",
    path: "/casino/slots?custom=1&category=top-slots",
  },
  {
    name: "Popular Games",
    path: "/casino/slots?custom=1&category=popular-games",
  },
  {
    name: "New",
    path: "/casino/slots?custom=0&category=new",
  },
  {
    name: "Jackpots",
    path: "/casino/slots?custom=0&category=jackpots",
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
  if (name.includes("table games") || pathLower.includes("table") || pathLower.includes("tablegames")) {
    return "/images/sidebar/table-games.svg";
  }
  if (name.includes("roulette") || pathLower.includes("roulette")) {
    return "/images/sidebar/roulette.svg";
  }
  if (name.includes("blackjack") || pathLower.includes("blackjack") || pathLower.includes("blackjacks")) {
    return "/images/sidebar/blackjack.svg";
  }
  if (name.includes("baccarat") || pathLower.includes("baccarat")) {
    return "/images/sidebar/baccarat.svg";
  }
  if (name.includes("video poker") || pathLower.includes("video-poker") || pathLower.includes("videopoker")) {
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
const getCategoryGameCount = async (path: string): Promise<number> => {
  // Extract category and custom params from path first
  const url = new URL(path, window.location.origin);
  const custom = url.searchParams.get("custom");
  const category = url.searchParams.get("category");
  const provider = url.searchParams.get("provider");

  // For custom categories, wait for customGamesState to be loaded
  if (custom === "1" && category) {
    // Wait for customGamesState to be populated (max 5 seconds)
    let attempts = 0;
    while (customGamesState.value.length === 0 && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    // If still empty after waiting, return 0
    if (customGamesState.value.length === 0) {
      return 0;
    }
  }

  // Check cache after ensuring customGamesState is loaded (for custom categories)
  if (categoryCountsCache.value[path] !== undefined) {
    // For custom categories, verify cache is still valid
    if (custom === "1" && category) {
      const currentCount = customGamesState.value.filter((c) => c.category === category).length;
      // If count changed, invalidate cache
      if (currentCount !== categoryCountsCache.value[path]) {
        // Cache is stale, will recalculate below
      } else {
        return categoryCountsCache.value[path];
      }
    } else {
      return categoryCountsCache.value[path];
    }
  }

  try {
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

// Get cached count (synchronous, returns undefined if not cached)
const getCachedCategoryCount = (path: string): number | undefined => {
  return categoryCountsCache.value[path];
};

// Process categories and add icons
const processCategories = (
  categories: Array<{ name: string; path: string; icon?: string }>
): CategoryItem[] => {
  return categories.map((cat) => ({
    name: cat.name,
    path: cat.path,
    icon: cat.icon || getCategoryIcon(cat.name, cat.path),
  }));
};

export const useCasinoCategories = () => {
  const categories = useMemo(() => {
    return processCategories(STATIC_CATEGORIES);
  }, []);

  // Watch for customGamesState changes and invalidate cache for custom categories when it loads
  useEffect(() => {
    const dispose = effect(() => {
      const customGames = customGamesState.value;
      
      // When customGamesState becomes populated, invalidate cache for all custom categories
      if (customGames.length > 0) {
        // Find all custom category paths and invalidate their cache
        const customCategoryPaths = STATIC_CATEGORIES
          .filter(cat => {
            try {
              const url = new URL(cat.path, window.location.origin);
              return url.searchParams.get("custom") === "1" && url.searchParams.get("category");
            } catch {
              return false;
            }
          })
          .map(cat => cat.path);

        // Remove cached values for custom categories to force recalculation
        const newCache = { ...categoryCountsCache.value };
        let cacheChanged = false;
        customCategoryPaths.forEach(path => {
          if (newCache[path] !== undefined) {
            delete newCache[path];
            cacheChanged = true;
          }
        });
        
        if (cacheChanged) {
          categoryCountsCache.value = newCache;
        }
      }
    });

    return () => {
      dispose();
    };
  }, []);

  return {
    categories,
    getCategoryGameCount,
    getCachedCategoryCount,
    processCategories,
  };
};

