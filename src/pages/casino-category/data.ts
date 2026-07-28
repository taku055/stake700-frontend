export type CasinoCategoryPageKey =
  | "top-casino"
  | "new-casino"
  | "popular-casino"
  | "jackpots-casino"
  | "megaways-casino"
  | "top-livecasino"
  | "roulette-livecasino"
  | "blackjack-livecasino"
  | "baccarat-livecasino"
  | "shows-livecasino";

export type CasinoCategoryTabConfig = {
  key: string;
  name: string;
  icon: string;
};

type GridCategoryConfig = {
  type: "grid";
  gameType: "SLOT" | "LIVECASINO";
  category: string;
  isCustom: boolean;
};

type ComponentCategoryConfig = {
  type: "component";
  component: "megaways" | "jackpots";
};

export type CasinoCategoryRenderConfig = GridCategoryConfig | ComponentCategoryConfig;

export type CasinoCategoryPageConfig = {
  section: "slots" | "live-casino";
  tab: CasinoCategoryTabConfig;
  render: CasinoCategoryRenderConfig;
};

export const CASINO_CATEGORY_PAGE_QUERY_KEY = "page";

export const CASINO_CATEGORY_PAGES: Record<
  CasinoCategoryPageKey,
  CasinoCategoryPageConfig
> = {
  "top-casino": {
    section: "slots",
    tab: { key: "top", name: "Top", icon: "/images/category_logo/top.png" },
    render: { type: "grid", category: "slot-top-slots", gameType: "SLOT", isCustom: true },
  },
  "new-casino": {
    section: "slots",
    tab: { key: "new", name: "New", icon: "/images/category_logo/new.png" },
    render: { type: "grid", category: "slot-new", gameType: "SLOT", isCustom: true },
  },
  "popular-casino": {
    section: "slots",
    tab: { key: "popular", name: "Popular", icon: "/images/category_logo/popular.png" },
    render: {
      type: "grid",
      category: "slot-top-slots",
      gameType: "SLOT",
      isCustom: true,
    },
  },
  "jackpots-casino": {
    section: "slots",
    tab: { key: "jackpots", name: "Jackpots", icon: "/images/category_logo/jackpots.png" },
    render: { type: "grid", category: "jackpots", gameType: "SLOT", isCustom: true },
  },
  "megaways-casino": {
    section: "slots",
    tab: { key: "megaways", name: "Megaways", icon: "/images/category_logo/megaways.png" },
    render: { type: "grid", category: "megaways", gameType: "SLOT", isCustom: true },
  },
  "top-livecasino": {
    section: "live-casino",
    tab: { key: "top-live", name: "Top Live Games", icon: "/images/category_logo/top-live-games.png" },
    render: { type: "grid", category: "tablegames", gameType: "LIVECASINO", isCustom: true },
  },
  "roulette-livecasino": {
    section: "live-casino",
    tab: { key: "roulette", name: "Roulette", icon: "/images/category_logo/roulette.png" },
    render: {
      type: "grid",
      category: "rouletteglobal",
      gameType: "LIVECASINO",
      isCustom: true,
    },
  },
  "blackjack-livecasino": {
    section: "live-casino",
    tab: { key: "blackjack", name: "Blackjack", icon: "/images/category_logo/blackjack.png" },
    render: {
      type: "grid",
      category: "blackjacks",
      gameType: "LIVECASINO",
      isCustom: true,
    },
  },
  "baccarat-livecasino": {
    section: "live-casino",
    tab: { key: "baccarat", name: "Baccarat", icon: "/images/category_logo/baccarat.png" },
    render: {
      type: "grid",
      category: "baccaratglobal",
      gameType: "LIVECASINO",
      isCustom: true,
    },
  },
  "shows-livecasino": {
    section: "live-casino",
    tab: { key: "shows", name: "Shows", icon: "/images/category_logo/shows.png" },
    render: { type: "grid", category: "show", gameType: "LIVECASINO", isCustom: true },
  },
};

export const CASINO_CATEGORY_PAGE_BY_PATH: Record<string, CasinoCategoryPageKey> = {
  "/top-casino": "top-casino",
  "/new-casino": "new-casino",
  "/popular-casino": "popular-casino",
  "/jackpots-casino": "jackpots-casino",
  "/megaways-casino": "megaways-casino",
  "/top-livecasino": "top-livecasino",
  "/roulette-livecasino": "roulette-livecasino",
  "/blackjack-livecasino": "blackjack-livecasino",
  "/baccarat-livecasino": "baccarat-livecasino",
  "/shows-livecasino": "shows-livecasino",
};

export const SLOTS_CATEGORY_PAGES: CasinoCategoryPageKey[] = [
  "top-casino",
  "new-casino",
  "popular-casino",
  "jackpots-casino",
  "megaways-casino",
];

export const LIVE_CATEGORY_PAGES: CasinoCategoryPageKey[] = [
  "top-livecasino",
  "roulette-livecasino",
  "blackjack-livecasino",
  "baccarat-livecasino",
  "shows-livecasino",
];
