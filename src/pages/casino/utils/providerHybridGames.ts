import type { tCustomGame } from "@/types/tCustomGame";
import type { tGame } from "@/types/tGame";
import { PROVIDER_PRIORITY_CUSTOM_CATEGORIES } from "@/config/providerPriorityCustomCategories";

export function getSingleProviderIdFromQuery(
  providerQuery: string | undefined,
): string | null {
  if (!providerQuery || typeof providerQuery !== "string") return null;
  const parts = providerQuery
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length === 1 ? parts[0] : null;
}

export function getPriorityCustomCategoriesForProvider(
  providerQuery: string | undefined,
): readonly string[] {
  const pid = getSingleProviderIdFromQuery(providerQuery);
  if (!pid) return [];
  return PROVIDER_PRIORITY_CUSTOM_CATEGORIES[pid] ?? [];
}

/**
 * Ordered custom games for the given provider and priority category slugs.
 */
export function buildPriorityGamesForProvider(
  entries: readonly tCustomGame[],
  providerId: string,
  priorityCategories: readonly string[],
): tGame[] {
  const catLower = new Set(priorityCategories.map((c) => c.toLowerCase()));
  const matched = entries.filter((c) => {
    if (!c.Game || c.Game.providerId !== providerId) return false;
    const slug = (c.category ?? "").toLowerCase();
    return slug !== "" && catLower.has(slug);
  });

  matched.sort((a, b) => {
    const orderCmp = (a.order ?? 0) - (b.order ?? 0);
    if (orderCmp !== 0) return orderCmp;
    const ia = priorityCategories.findIndex(
      (x) => x.toLowerCase() === (a.category ?? "").toLowerCase(),
    );
    const ib = priorityCategories.findIndex(
      (x) => x.toLowerCase() === (b.category ?? "").toLowerCase(),
    );
    if (ia !== ib) return ia - ib;
    return (a.Game!.name ?? "").localeCompare(b.Game!.name ?? "");
  });

  const seen = new Set<string>();
  const games: tGame[] = [];
  for (const row of matched) {
    const g = row.Game!;
    if (seen.has(g.id)) continue;
    seen.add(g.id);
    games.push(g);
  }
  return games;
}
