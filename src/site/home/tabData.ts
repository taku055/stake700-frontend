export type HomePageMode = "home" | "lobby-casino" | "lobby-live-casino";

export type HomeTabConfig = {
  key: string;
  name: string;
  icon: string;
};

export const HOME_PAGE_TABS: Record<HomePageMode, HomeTabConfig[]> = {
  home: [
    { key: "", name: "Lobby", icon: "/images/category_logo/lobby.webp" },
    { key: "casino", name: "Casino", icon: "/images/sidebar/casino.webp" },
    {
      key: "live-casino",
      name: "Live Casino",
      icon: "/images/sidebar/live-casino.webp",
    },
    { key: "jackpots", name: "Jackpots", icon: "/images/category_logo/jackpots.webp" },
    { key: "megaways", name: "Megaways", icon: "/images/category_logo/megaways.webp" },
  ],
  "lobby-casino": [
    { key: "", name: "Lobby", icon: "/images/category_logo/lobby.webp" },
    { key: "top", name: "Top", icon: "/images/category_logo/top.webp" },
    { key: "new", name: "New", icon: "/images/category_logo/new.webp" },
    { key: "popular", name: "Popular", icon: "/images/category_logo/popular.webp" },
    { key: "jackpots", name: "Jackpots", icon: "/images/category_logo/jackpots.webp" },
    { key: "megaways", name: "Megaways", icon: "/images/category_logo/megaways.webp" },
  ],
  "lobby-live-casino": [
    { key: "", name: "Live Casino", icon: "/images/category_logo/lobby.webp" },
    { key: "top", name: "Top", icon: "/images/category_logo/top-live-games.webp" },
    { key: "roulette", name: "Roulette", icon: "/images/category_logo/roulette.webp" },
    { key: "blackjack", name: "Blackjack", icon: "/images/category_logo/blackjack.webp" },
    { key: "baccarat", name: "Baccarat", icon: "/images/category_logo/baccarat.webp" },
    { key: "shows", name: "Shows", icon: "/images/category_logo/shows.webp" },
  ],
};
