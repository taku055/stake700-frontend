import { signal } from "@preact/signals-react";

export interface ISidebarItem {
  name: string;
  path: string;
  icon?: string;
  count?: number;
  /** Second URL path segment after the leading slash (e.g. `slots` from `/casino/games`). */
  secondPathSegment?: string;
  queryParams?: Record<string, string>;
}

// Static categories list - always shown
export const STATIC_CATEGORIES: ISidebarItem[] = [
  {
    name: "All Slots",
    path: "/casino/games",
    icon: "/images/sidebar/all-games.svg",
  },
  {
    name: "Live Casino",
    path: "/live-casino/games",
    icon: "/images/sidebar/all-games.svg",
  },
  {
    name: "Roulette",
    path: "/live-casino/roulette",
    icon: "/images/category_logo/roulette.webp",
  },
  {
    name: "Blackjack",
    path: "/live-casino/blackjack",
    icon: "/images/category_logo/blackjack.webp",
  },
  {
    name: "Baccarat",
    path: "/live-casino/baccarat",
    icon: "/images/category_logo/baccarat.webp",
  },
  {
    name: "Video Poker",
    path: "/live-casino/video-poker",
    icon: "/images/sidebar/video-poker.svg",
  },
  {
    name: "Table Games",
    path: "/live-casino/table-games",
    icon: "/images/sidebar/table-games.webp",
  },
  {
    name: "Top Slots",
    path: "/casino/top",
    icon: "/images/sidebar/top-slots.svg",
  },
  {
    name: "Popular Games",
    path: "/casino/popular",
    icon: "/images/sidebar/popular-games.svg",
  },
  {
    name: "New",
    path: "/casino/new",
    icon: "/images/sidebar/new.svg",
  },
  {
    name: "Megaways",
    path: "/casino/megaways",
    icon: "/images/sidebar/megaways.svg",
  },
  {
    name: "Classic Slots",
    path: "/casino/classics",
    icon: "/images/sidebar/classic-slots.svg",
  },
  {
    name: "Instant Game",
    path: "/casino/instant-games",
    icon: "/images/sidebar/instant-game.svg",
  },
];

export const sidebarDataState = signal<ISidebarItem[]>(STATIC_CATEGORIES);
