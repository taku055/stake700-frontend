import { signal } from "@preact/signals";

export interface ISidebarItem {
  name: string;
  path: string;
  icon?: string;
  count?: number;
  /** Second URL path segment after the leading slash (e.g. `slots` from `/casino/slots`). */
  secondPathSegment?: string;
  queryParams?: Record<string, string>;
}

// Static categories list - always shown
export const STATIC_CATEGORIES: ISidebarItem[] = [
  {
    name: "All Slots",
    path: "/casino/slots",
    icon: "/images/sidebar/all-games.svg",
  },
  {
    name: "Live Casino",
    path: "/casino/live-casino",
    icon: "/images/sidebar/all-games.svg",
  },
  {
    name: "Roulette",
    path: "/casino/live-casino?custom=1&category=rouletteglobal",
    icon: "/images/category_logo/roulette.png",
  },
  {
    name: "Blackjack",
    path: "/casino/live-casino?custom=1&category=blackjacks",
    icon: "/images/category_logo/blackjack.png",
  },
  {
    name: "Baccarat",
    path: "/casino/live-casino?custom=1&category=baccaratglobal",
    icon: "/images/category_logo/baccarat.svg",
  },
  {
    name: "Video Poker",
    path: "/casino/live-casino?custom=1&category=videopoker",
    icon: "/images/sidebar/video-poker.svg",
  },
  {
    name: "Table Games",
    path: "/casino/live-casino?custom=1&category=tablegames",
    icon: "/images/sidebar/table-games.svg",
  },
  {
    name: "Top Slots",
    path: "/casino/slots?custom=1&category=slot-top-slots",
    icon: "/images/sidebar/top-slots.svg",
  },
  {
    name: "Popular Games",
    path: "/casino/slots?custom=1&category=slot-popular",
    icon: "/images/sidebar/popular-games.svg",
  },
  {
    name: "New",
    path: "/casino/slots?custom=1&category=slot-new",
    icon: "/images/sidebar/new.svg",
  },
  {
    name: "Megaways",
    path: "/casino/slots?custom=1&category=megaways",
    icon: "/images/sidebar/megaways.svg",
  },
  {
    name: "Classic Slots",
    path: "/casino/slots?custom=1&category=classic-slots",
    icon: "/images/sidebar/classic-slots.svg",
  },
  {
    name: "Instant Game",
    path: "/casino/slots?custom=1&category=instant-game",
    icon: "/images/sidebar/instant-game.svg",
  },
];

export const sidebarDataState = signal<ISidebarItem[]>(STATIC_CATEGORIES);
