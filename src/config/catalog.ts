/**
 * Game catalogue: maps clean URL slugs (/casino/popular, /live-casino/roulette)
 * to backend categories. Single source of truth for pages, navigation, sitemap
 * and legacy-URL redirects. Must stay free of browser APIs.
 */

export type CatalogSection = "casino" | "live-casino";

/** Query param for the provider filter on listing pages: ?providers=id1,id2 */
export const PROVIDERS_QUERY_KEY = "providers";

export type CatalogCategory = {
  /** URL slug under the section, e.g. "popular" -> /casino/popular */
  slug: string;
  section: CatalogSection;
  /** Backend category key */
  category: string;
  /** Custom (curated) category served from customGamesState vs. API category */
  isCustom: boolean;
  gameType: "SLOT" | "LIVECASINO";
  /** Translation key in the CasinoPage namespace */
  titleKey: string;
  icon: string;
  /** Shown as a tab in the section header */
  tab?: boolean;
  /** Other backend keys that used to point here (legacy redirects) */
  aliases?: string[];
};

export const SECTION_META: Record<
  CatalogSection,
  { titleKey: string; icon: string; gameType: "SLOT" | "LIVECASINO" }
> = {
  casino: { titleKey: "Casino", icon: "/images/sidebar/casino.webp", gameType: "SLOT" },
  "live-casino": { titleKey: "Live Casino", icon: "/images/sidebar/live-casino.webp", gameType: "LIVECASINO" },
};

const C = (
  section: CatalogSection,
  slug: string,
  category: string,
  titleKey: string,
  icon: string,
  tab = false,
  isCustom = true,
): CatalogCategory => ({
  slug,
  section,
  category,
  isCustom,
  gameType: section === "casino" ? "SLOT" : "LIVECASINO",
  titleKey,
  icon,
  tab,
});

const ICON = "/images/category_logo";

export const CATALOG: CatalogCategory[] = [
  // Casino (slots)
  C("casino", "top", "top-games", "Top Games", `${ICON}/top.webp`, true),
  C("casino", "new", "slot-new", "New", `${ICON}/new.webp`, true),
  { ...C("casino", "popular", "slot-popular", "Popular", `${ICON}/popular.webp`, true), aliases: ["slot-top-slots"] },
  C("casino", "jackpots", "jackpots", "Jackpots", `${ICON}/jackpots.webp`, true),
  C("casino", "megaways", "megaways", "Megaways", `${ICON}/megaways.webp`, true),
  C("casino", "trending", "trending", "Trending Games", `${ICON}/popular.webp`),
  C("casino", "classics", "classic-slots", "Classics", `${ICON}/top.webp`),
  C("casino", "book-of", "book-of", "Book Of", `${ICON}/top.webp`),
  C("casino", "instant-games", "instant-game", "Instant Win", `${ICON}/top.webp`),

  // Live casino
  C("live-casino", "table-games", "tablegames", "Table Games", `${ICON}/top-live-games.webp`, true),
  C("live-casino", "roulette", "rouletteglobal", "Roulette", `${ICON}/roulette.webp`, true),
  C("live-casino", "blackjack", "blackjacks", "Blackjack", `${ICON}/blackjack.webp`, true),
  C("live-casino", "baccarat", "baccaratglobal", "Baccarat", `${ICON}/baccarat.webp`, true),
  C("live-casino", "game-shows", "show", "Game Shows", `${ICON}/shows.webp`, true),
  C("live-casino", "top-tables", "toptables", "Top Tables", `${ICON}/top-live-games.webp`),
  C("live-casino", "live-tables", "live-tables", "Live Tables", `${ICON}/top-live-games.webp`),
  C("live-casino", "high-stakes", "highstakes", "High Stakes", `${ICON}/top-live-games.webp`),
  C("live-casino", "sic-bo", "sic-bo", "Sic Bo", `${ICON}/top-live-games.webp`),
  C("live-casino", "video-poker", "videopoker", "Video Poker", `${ICON}/top-live-games.webp`),
];

export function getCategory(section: CatalogSection, slug: string): CatalogCategory | undefined {
  return CATALOG.find((c) => c.section === section && c.slug === slug);
}

export function getSectionCategories(section: CatalogSection, tabsOnly = false): CatalogCategory[] {
  return CATALOG.filter((c) => c.section === section && (!tabsOnly || c.tab));
}

/** Reverse lookup for legacy "?custom=1&category=X" URLs. Prefers the given section. */
export function findCategoryByBackendKey(
  category: string,
  preferSection?: CatalogSection,
): CatalogCategory | undefined {
  const matches = CATALOG.filter((c) => c.category === category || c.aliases?.includes(category));
  return matches.find((c) => c.section === preferSection) ?? matches[0];
}

/** Legacy /casino-category?page=X keys -> new slugs */
export const LEGACY_CATEGORY_PAGES: Record<string, { section: CatalogSection; slug: string }> = {
  "top-casino": { section: "casino", slug: "top" },
  "new-casino": { section: "casino", slug: "new" },
  "popular-casino": { section: "casino", slug: "popular" },
  "jackpots-casino": { section: "casino", slug: "jackpots" },
  "megaways-casino": { section: "casino", slug: "megaways" },
  "top-livecasino": { section: "live-casino", slug: "table-games" },
  "roulette-livecasino": { section: "live-casino", slug: "roulette" },
  "blackjack-livecasino": { section: "live-casino", slug: "blackjack" },
  "baccarat-livecasino": { section: "live-casino", slug: "baccarat" },
  "shows-livecasino": { section: "live-casino", slug: "game-shows" },
};

type SluggableProvider = { id: string; name: string; platform_id?: string; count?: number };

/**
 * Deterministic provider slugs, shared by server routing and client links.
 * Unique names get a plain slug ("pragmatic-play"); when several providers share a
 * name, the one with most games keeps it and the others get their platform as a
 * suffix ("evolution-novaplay"), falling back to an id prefix.
 */
export function buildProviderSlugs(providers: SluggableProvider[]): Map<string, string> {
  const groups = new Map<string, SluggableProvider[]>();
  for (const p of providers) {
    const base = slugify(p.name) || p.id;
    groups.set(base, [...(groups.get(base) ?? []), p]);
  }
  const result = new Map<string, string>();
  const taken = new Set<string>();
  for (const [base, group] of groups) {
    const ordered = [...group].sort((a, b) => (b.count ?? 0) - (a.count ?? 0) || a.id.localeCompare(b.id));
    ordered.forEach((p, i) => {
      let slug = base;
      if (i > 0) {
        const platform = slugify((p.platform_id || "").split("-")[0]);
        slug = platform && !taken.has(`${base}-${platform}`) ? `${base}-${platform}` : `${base}-${p.id.slice(0, 6)}`;
      }
      taken.add(slug);
      result.set(p.id, slug);
    });
  }
  return result;
}

/** URL-safe slug from a provider/game name: "Pragmatic Play Live" -> "pragmatic-play-live". */
export function slugify(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
