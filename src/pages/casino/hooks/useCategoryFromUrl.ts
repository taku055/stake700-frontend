import { useMemo } from "preact/hooks";
import { useLocation } from "preact-iso";
import { STATIC_CATEGORIES } from "@/components/NavigationSidebar/categoryData";

export function useCategoryFromUrl() {
  const location = useLocation();

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
      const allGamesCategory = STATIC_CATEGORIES.find(cat => cat.name === "All Games");
      return allGamesCategory?.path || categoryPath;
    }
    
    return categoryPath;
  }, [location.query, location.path]);

  return { selectedCategory };
}

