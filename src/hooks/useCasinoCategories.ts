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
    path: "/casino/games",
    icon: "/images/sidebar/all-games.svg",
  },
  {
    name: "Live Casino",
    path: "/live-casino/games",
    icon: "/images/category_logo/video-poker.svg",
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
    icon: "/images/category_logo/video-poker.svg",
  },
  {
    name: "Table Games",
    path: "/live-casino/table-games",
    icon: "/images/category_logo/table-games.svg",
  },
  {
    name: "Top Slots",
    path: "/casino/top",
    icon: "/images/category_logo/top-slots.png",
  },
  {
    name: "Popular Games",
    path: "/casino/popular",
    icon: "/images/category_logo/popular-games.svg",
  },
  {
    name: "New",
    path: "/casino/new",
    icon: "/images/category_logo/new.svg",
  },
  {
    name: "Megaways",
    path: "/casino/megaways",
    icon: "/images/category_logo/megaways.svg",
  },
  {
    name: "Classic Slots",
    path: "/casino/classics",
    icon: "/images/category_logo/classic-slots.svg",
  },
  {
    name: "Instant Game",
    path: "/casino/instant-games",
    icon: "/images/category_logo/instant-game.svg",
  },
];
