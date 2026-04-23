export type HomePageMode = "home" | "lobby-casino" | "lobby-live-casino";

export type HomeTabConfig = {
  key: string;
  name: string;
  icon: string;
};

export const HOME_PAGE_TABS: Record<HomePageMode, HomeTabConfig[]> = {
  home: [
    { key: "", name: "Lobby", icon: "/images/category_logo/lobby.png" },
    { key: "casino", name: "Casino", icon: "/images/sidebar/casino.png" },
    {
      key: "live-casino",
      name: "Live Casino",
      icon: "/images/sidebar/live-casino.png",
    },
    { key: "jackpots", name: "Jackpots", icon: "/images/category_logo/jackpots.png" },
    { key: "megaways", name: "Megaways", icon: "/images/category_logo/megaways.svg" },
  ],
  "lobby-casino": [
    { key: "", name: "Lobby", icon: "/images/category_logo/lobby.png" },
    { key: "top", name: "Top", icon: "/images/category_logo/top.png" },
    { key: "new", name: "New", icon: "/images/category_logo/new.png" },
    { key: "popular", name: "Popular", icon: "/images/category_logo/popular.png" },
    { key: "jackpots", name: "Jackpots", icon: "/images/category_logo/jackpots.png" },
    { key: "megaways", name: "Megaways", icon: "/images/category_logo/megaways.png" },
  ],
  "lobby-live-casino": [
    { key: "", name: "Live Casino", icon: "/images/category_logo/lobby.png" },
    { key: "top", name: "Top", icon: "/images/category_logo/top-live-games.png" },
    { key: "roulette", name: "Roulette", icon: "/images/category_logo/roulette.png" },
    { key: "blackjack", name: "Blackjack", icon: "/images/category_logo/blackjack.png" },
    { key: "baccarat", name: "Baccarat", icon: "/images/category_logo/baccarat.png" },
    { key: "shows", name: "Shows", icon: "/images/category_logo/shows.png" },
  ],
};
