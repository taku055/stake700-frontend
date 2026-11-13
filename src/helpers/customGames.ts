import type { tGame } from "@/types/tGame";
import { customGamesState } from "@/state/customGamesState";
import { matchesCustomCategory } from "@/config/customGameCategories";

/**
 * Games of a curated category from customGamesState. Synchronous, so rows can
 * use it as their initial state and render on the server when the state is seeded.
 */
export function pickCustomGames(category: string | undefined, limit = 30, exceptGameId?: string): tGame[] {
  if (!category) return [];
  return customGamesState.value
    .filter((c) => c.Game && matchesCustomCategory(c.category, category))
    .slice(0, limit)
    .map((c) => c.Game as tGame)
    .filter((g) => g.id !== exceptGameId);
}
