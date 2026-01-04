import { useState, useEffect, useMemo } from "preact/hooks";
import { useCasinoCategories } from "./useCasinoCategories";
import { useLiveCasinoCategories } from "./useLiveCasinoCategories";
import { CategoryItem } from "./useCasinoCategories";

export interface CategoryWithCount extends CategoryItem {
  count?: number;
}

export const useCategoryCounts = () => {
  const [casinoCategoriesWithCounts, setCasinoCategoriesWithCounts] = useState<CategoryWithCount[]>([]);
  const [liveCasinoCategoriesWithCounts, setLiveCasinoCategoriesWithCounts] = useState<CategoryWithCount[]>([]);

  const { categories: casinoCategories, getCachedCategoryCount, getCategoryGameCount } = useCasinoCategories();
  const { categories: liveCasinoCategories, getCachedCategoryCount: getLiveCasinoCachedCategoryCount, getCategoryGameCount: getLiveCasinoCategoryGameCount } = useLiveCasinoCategories();

  // Set initial counts from cache for casino categories
  useEffect(() => {
    setCasinoCategoriesWithCounts(casinoCategories.map((cat) => ({
      ...cat,
      count: getCachedCategoryCount(cat.path),
    })));
  }, [casinoCategories, getCachedCategoryCount]);

  // Set initial counts from cache for live casino categories
  useEffect(() => {
    setLiveCasinoCategoriesWithCounts(liveCasinoCategories.map((cat) => ({
      ...cat,
      count: getLiveCasinoCachedCategoryCount(cat.path),
    })));
  }, [liveCasinoCategories, getLiveCasinoCachedCategoryCount]);

  // Load counts asynchronously for casino categories and update as they become available
  useEffect(() => {
    casinoCategories.forEach((cat) => {
      getCategoryGameCount(cat.path).then((count) => {
        setCasinoCategoriesWithCounts((prev) => {
          return prev.map((c) => (c.path === cat.path ? { ...c, count } : c));
        });
      }).catch((error) => {
        console.error(`Error loading count for ${cat.path}:`, error);
      });
    });
  }, [casinoCategories, getCategoryGameCount]);

  // Load counts asynchronously for live casino categories and update as they become available
  useEffect(() => {
    liveCasinoCategories.forEach((cat) => {
      getLiveCasinoCategoryGameCount(cat.path).then((count) => {
        setLiveCasinoCategoriesWithCounts((prev) => {
          return prev.map((c) => (c.path === cat.path ? { ...c, count } : c));
        });
      }).catch((error) => {
        console.error(`Error loading count for ${cat.path}:`, error);
      });
    });
  }, [liveCasinoCategories, getLiveCasinoCategoryGameCount]);

  // Combined categories with counts
  const allCategoriesWithCounts = useMemo(() => {
    return [...casinoCategoriesWithCounts, ...liveCasinoCategoriesWithCounts];
  }, [casinoCategoriesWithCounts, liveCasinoCategoriesWithCounts]);

  return {
    casinoCategoriesWithCounts,
    liveCasinoCategoriesWithCounts,
    allCategoriesWithCounts,
  };
};
