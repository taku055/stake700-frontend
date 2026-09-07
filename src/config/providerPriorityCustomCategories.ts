/**
 * For specific providers, custom-game categories (see `tCustomGame.category`) listed here
 * are shown first in casino grids (before API provider games). Keys are provider IDs.
 */
export const PROVIDER_PRIORITY_CUSTOM_CATEGORIES: Record<
  string,
  readonly string[]
> = {
  e544fca303b10f448c5695650e34faba5dbad8a2: ["evolution"],
};
