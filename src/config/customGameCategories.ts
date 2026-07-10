const CUSTOM_GAME_CATEGORY_ALIASES: Record<string, readonly string[]> = {
  jackpots: ["jackpots", "slot-jackpots"],
  "slot-jackpots": ["jackpots", "slot-jackpots"],
};

export function getCustomCategoryAliases(category: string): readonly string[] {
  const trimmed = category.trim();
  if (!trimmed) {
    return [];
  }

  return (
    CUSTOM_GAME_CATEGORY_ALIASES[trimmed] ??
    CUSTOM_GAME_CATEGORY_ALIASES[trimmed.toLowerCase()] ?? [trimmed]
  );
}

export function matchesCustomCategory(
  entryCategory: string,
  category: string,
): boolean {
  const aliases = getCustomCategoryAliases(category);
  const normalizedEntry = entryCategory.toLowerCase();
  return aliases.some((alias) => alias.toLowerCase() === normalizedEntry);
}
