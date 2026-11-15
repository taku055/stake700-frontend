import { createContext, useContext, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import { getSectionCategories, type CatalogCategory, type CatalogSection } from "@/config/catalog";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { customGamesState } from "@/state/customGamesState";

/** Games per category slug, rendered by the server for the current page. */
export const CategoryCountsContext = createContext<Record<string, number> | undefined>(undefined);

/**
 * Categories of a section, minus curated categories that have no games yet
 * (e.g. new ones still being filled in the back office).
 *
 * With server counts (CategoryCountsContext) the result is the same on server
 * and client. Without them, every category is listed until mount (the server's
 * signal state may hold another request's data) and empty ones drop out after.
 * `keep` is always listed (the category the visitor is currently on).
 */
export function useSectionCategories(section: CatalogSection, keep?: string): CatalogCategory[] {
  const counts = useContext(CategoryCountsContext);
  const isClient = useIsClient();
  const custom = customGamesState.value;
  return useMemo(() => {
    const all = getSectionCategories(section);
    if (counts) return all.filter((c) => c.slug === keep || !c.isCustom || (counts[c.slug] ?? 1) > 0);
    if (!isClient || custom.length === 0) return all;
    return all.filter(
      (c) => c.slug === keep || !c.isCustom || custom.some((e) => e.Game && matchesCustomCategory(e.category, c.category)),
    );
  }, [section, counts, custom, isClient, keep]);
}
