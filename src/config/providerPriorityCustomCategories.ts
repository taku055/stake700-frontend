/**
 * For specific providers, custom-game categories (see `tCustomGame.category`) listed here
 * are shown first in casino grids (before API provider games). Keys are provider IDs.
 */
export const PROVIDER_PRIORITY_CUSTOM_CATEGORIES: Record<
  string,
  readonly string[]
> = {
  f66b7dcd21696a4242e1ff93608c405741802c92: ["evolution"],
};
