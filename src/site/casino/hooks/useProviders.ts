import { useEffect, useState } from "react";
import type { tProvider } from "@/types/tProvider";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { apiGetCustomCategoryProviders } from "@/api/common/apiGetCustomCategoryProviders";

/**
 * Providers for a section (by game type) or a curated category, with their game
 * counts. `undefined` while loading, `[]` on failure.
 */
export function useProviders(opts: {
  gameType?: "SLOT" | "LIVECASINO" | null;
  customCategory?: string;
  skip?: boolean;
}): tProvider[] | undefined {
  const { gameType, customCategory, skip } = opts;
  const [providers, setProviders] = useState<tProvider[] | undefined>(undefined);

  useEffect(() => {
    if (skip) return;
    let cancelled = false;
    setProviders(undefined);
    (async () => {
      try {
        const res = customCategory
          ? await apiGetCustomCategoryProviders(customCategory)
          : await apiGetProviders(gameType ?? undefined);
        if (!cancelled) setProviders(res);
      } catch (err) {
        console.error(err);
        if (!cancelled) setProviders([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gameType, customCategory, skip]);

  return providers;
}

/** Providers with the most games first. */
export function byPopularity(list: tProvider[]): tProvider[] {
  return [...list].sort((a, b) => (b.count ?? 0) - (a.count ?? 0) || (a.order ?? 0) - (b.order ?? 0));
}
