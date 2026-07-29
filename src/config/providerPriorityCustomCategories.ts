/**
 * For specific providers, custom-game categories (see `tCustomGame.category`) listed here
 * are shown first in casino grids (before API provider games). Keys are provider IDs.
 */
export const PROVIDER_PRIORITY_CUSTOM_CATEGORIES: Record<
  string,
  readonly string[]
> = {
  c780a72efac190d6c49c11b328a79b3ce45b8bc2: ["evolution"],
};
