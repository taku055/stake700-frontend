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
    top: { type: "grid", category: "top", gameType: "SLOT", isCustom: true },
    new: { type: "grid", category: "new", gameType: "SLOT", isCustom: true },
    popular: {
      type: "grid",
      category: "popular",
      gameType: "SLOT",
      isCustom: true,
    },
    "buy-bonus": {
      type: "grid",
      category: "buy-bonus",
      gameType: "SLOT",
      isCustom: true,
    },
    megaways: { type: "component", component: "megaways" },
    "table-games": {
      type: "grid",
      category: "table-games",
      gameType: "SLOT",
      isCustom: true,
    },
    jackpots: { type: "component", component: "jackpots" },
  },
  "lobby-live-casino": {
    "": { type: "component", component: "live-casino-games" },
    top: { type: "empty" },
    roulette: {
      type: "grid",
      category: "roulette",
      gameType: "LIVECASINO",
      isCustom: false,
    },
    blackjack: {
      type: "grid",
      category: "blackjack",
      gameType: "LIVECASINO",
      isCustom: false,
    },
    baccarat: { type: "empty" },
    shows: { type: "empty" },
  },
};
