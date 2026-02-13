import { useMemo } from "preact/hooks";
import { customGamesState } from "@/state/customGamesState";
import { apiGetGames } from "@/api/common/apiGetGames";
import { categoryCountsCache } from "@/state/categoryCountsState";
import { useTranslations } from "@/context/I18nContext";

export interface CategoryItem {
  name: string;
  path: string;
  icon: string;
  count?: number;
}

// Live Casino categories
const LIVE_CASINO_CATEGORIES: Array<{ name: string; path: string; icon?: string }> = [
  {
    name: "Live Casino",
    path: "/casino/live-casino",
  },
  {
    name: "Roulette",
    path: "/casino/live-casino?custom=2&category=rouletteglobal",
  },
  {
    name: "Blackjack",
    path: "/casino/live-casino?custom=2&category=blackjacks",
  },
  {
    name: "Baccarat",
    path: "/casino/live-casino?custom=2&category=baccaratglobal",
  },
  {
    name: "Video Poker",
    path: "/casino/live-casino?custom=2&category=videopoker",
  },
  {
    name: "Table Games",
    path: "/casino/live-casino?custom=2&category=tablegames",
  },
];

// Map category names/paths to sidebar SVG icons
const getCategoryIcon = (categoryName: string, path: string): string => {
  const name = categoryName.toLowerCase();
  const pathLower = path.toLowerCase();
  
  if (name.includes("all games") || pathLower.includes("all-games")) {
    return "/images/category_logo/all-games.png";
  }
  if (name.includes("roulette") || pathLower.includes("roulette")) {
    return "/images/category_logo/roulette.png";
  }
  if (name.includes("blackjack") || pathLower.includes("blackjack") || pathLower.includes("blackjacks")) {
    return "/images/category_logo/blackjack.png";
  }
  if (name.includes("baccarat") || pathLower.includes("baccarat")) {
    return "/images/category_logo/baccarat.svg";
  }
  if (name.includes("video poker") || pathLower.includes("video-poker") || pathLower.includes("videopoker")) {
    return "/images/category_logo/video-poker.svg";
  }
  if (name.includes("table games") || pathLower.includes("table") || pathLower.includes("tablegames")) {
    return "/images/category_logo/table-games.svg";
  }
  
  // Default icon
  return "/images/category_logo/all-games.png";
};

// Get game count for a category based on its path (with caching)
const getCategoryGameCount = async (path: string): Promise<number> => {
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
    } else if (path.includes("/casino/live-casino")) {
      // All Games - fetch total count from API
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

// Process categories and add icons with translations
const processCategories = (
  categories: Array<{ name: string; path: string; icon?: string }>,
  t: (key: string) => string
): CategoryItem[] => {
  return categories.map((cat) => ({
    name: t(cat.name) || cat.name, // Translate category name, fallback to original if translation not found
    path: cat.path,
    icon: cat.icon || getCategoryIcon(cat.name, cat.path),
  }));
};

export const useLiveCasinoCategories = () => {
  const t = useTranslations("Header");
  
  const categories = useMemo(() => {
    return processCategories(LIVE_CASINO_CATEGORIES, t);
  }, [t]);

  return {
    categories,
    getCategoryGameCount,
    getCachedCategoryCount,
    processCategories,
  };
};

