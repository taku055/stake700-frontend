import type { HomePageMode } from "./tabData";

type GridCategoryConfig = {
  type: "grid";
  gameType: "SLOT" | "LIVECASINO";
  category: string;
  isCustom: boolean;
};

type ComponentCategoryConfig = {
  type: "component";
  component:
  | "lobby-games"
  | "casino-games"
  | "live-casino-games"
  | "jackpots"
  | "megaways";
};

type EmptyCategoryConfig = {
  type: "empty";
};

export type HomeCategoryConfig =
  | GridCategoryConfig
  | ComponentCategoryConfig
  | EmptyCategoryConfig;

export const HOME_PAGE_DEFAULT_TAB: Record<HomePageMode, string> = {
  home: "",
  "lobby-casino": "",
  "lobby-live-casino": "",
};

// top-games
// slot-new
// slot-popular
// jackpots
// megaways

export const HOME_PAGE_CATEGORIES: Record<
  HomePageMode,
  Record<string, HomeCategoryConfig>
> = {
  home: {
    "": { type: "component", component: "lobby-games" },
    casino: { type: "component", component: "casino-games" },
    "live-casino": { type: "component", component: "live-casino-games" },
    jackpots: { type: "grid", category: "jackpots", gameType: "SLOT", isCustom: true },
    megaways: { type: "grid", category: "megaways", gameType: "SLOT", isCustom: true },
  },
  "lobby-casino": {
    "": { type: "component", component: "casino-games" },
    slots: {
      type: "grid",
      category: "casino",
      gameType: "SLOT",
      isCustom: false,
    },
    top: { type: "grid", category: "topgames", gameType: "SLOT", isCustom: true },
    new: { type: "grid", category: "slot-new", gameType: "SLOT", isCustom: true },
    popular: {
      type: "grid",
      category: "slot-popular",
      gameType: "SLOT",
      isCustom: true,
    },
    megaways: { type: "grid", gameType: "SLOT", isCustom: true, category: "megaways" },
    "table-games": {
      type: "grid",
      category: "table-games",
      gameType: "SLOT",
      isCustom: true,
    },
    jackpots: { type: "grid", gameType: "SLOT", isCustom: true, category: "jackpots" },
  },
  "lobby-live-casino": {
    "": { type: "component", component: "live-casino-games" },
    top: { type: "grid", category: "toptables", gameType: "LIVECASINO", isCustom: true },
    roulette: {
      type: "grid",
      category: "rouletteglobal",
      gameType: "LIVECASINO",
      isCustom: false,
    },
    blackjack: {
      type: "grid",
      category: "blackjacks",
      gameType: "LIVECASINO",
      isCustom: false,
    },
    baccarat: { type: "grid", category: "baccaratglobal", gameType: "LIVECASINO", isCustom: true },
    shows: { type: "grid", category: "show", gameType: "LIVECASINO", isCustom: true },
  },
};
