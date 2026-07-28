export interface CategoryItem {
  name: string;
  path: string;
  icon?: string;
  count?: number;
}

// Static categories list - always shown
const STATIC_CATEGORIES: CategoryItem[] = [
  {
    name: "All Slots",
    path: "/casino/slots",
    icon: "/images/sidebar/all-games.svg",
  },
  {
    name: "Live Casino",
    path: "/casino/live-casino",
    icon: "/images/category_logo/video-poker.svg",
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
    icon: "/images/category_logo/video-poker.svg",
  },
  {
    name: "Table Games",
    path: "/casino/live-casino?custom=1&category=tablegames",
    icon: "/images/category_logo/table-games.svg",
  },
  {
    name: "Top Slots",
    path: "/casino/slots?custom=1&category=slot-top-slots",
    icon: "/images/category_logo/top-slots.png",
  },
  {
    name: "Popular Games",
    path: "/casino/slots?custom=1&category=slot-top-slots",
    icon: "/images/category_logo/popular-games.svg",
  },
  {
    name: "New",
    path: "/casino/slots?custom=1&category=slot-new",
    icon: "/images/category_logo/new.svg",
  },
  {
    name: "Megaways",
    path: "/casino/slots?custom=1&category=megaways",
    icon: "/images/category_logo/megaways.svg",
  },
  {
    name: "Classic Slots",
    path: "/casino/slots?custom=1&category=classic-slots",
    icon: "/images/category_logo/classic-slots.svg",
  },
  {
    name: "Instant Game",
    path: "/casino/slots?custom=1&category=instant-game",
    icon: "/images/category_logo/instant-game.svg",
  },
];
