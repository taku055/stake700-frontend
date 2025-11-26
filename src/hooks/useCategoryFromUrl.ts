import { useMemo } from "preact/hooks";
import { useLocation } from "preact-iso";
import { useCasinoCategories } from "./useCasinoCategories";

export function useCategoryFromUrl() {
  const location = useLocation();
  const { categories } = useCasinoCategories();

  // Calculate selected category from URL query parameters
  const selectedCategory = useMemo(() => {
    const params = new URLSearchParams();
    
    if (location.query.custom) {
      params.set("custom", String(location.query.custom));
    }
    if (location.query.category) {
      params.set("category", String(location.query.category));
    }
    if (location.query.provider) {
      params.set("provider", String(location.query.provider));
    }
    
    const queryString = params.toString();
    const categoryPath = queryString ? `${location.path}?${queryString}` : location.path;
    
    // If no query params, default to "All Games"
    if (!location.query.custom && !location.query.category && !location.query.provider) {
      const allGamesCategory = categories.find(cat => cat.name === "Top Slots");
      return allGamesCategory?.path || categoryPath;
    }
    
    return categoryPath;
  }, [location.query, location.path, categories]);

  return { selectedCategory };
}

