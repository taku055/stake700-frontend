import { useCallback } from "preact/hooks";

export interface CategoryParams {
  custom: boolean;
  category: string | null;
  provider: string | null;
}

export function useCategoryParams() {
  // Parse category path to get filter parameters
  const getCategoryParams = useCallback((categoryPath: string): CategoryParams => {
    try {
      const url = new URL(categoryPath, window.location.origin);
      const custom = url.searchParams.get("custom");
      const category = url.searchParams.get("category");
      const provider = url.searchParams.get("provider");
      
      return {
        custom: custom === "1",
        category: category || null,
        provider: provider || null,
      };
    } catch {
      return {
        custom: false,
        category: null,
        provider: null,
      };
    }
  }, []);

  return { getCategoryParams };
}

