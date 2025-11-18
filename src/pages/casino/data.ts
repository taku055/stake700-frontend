export type tCategorySubItem = {
  name: string;
  path: string;
  icon?: string;
};

export type tCategoryNavItem = {
  name: string;
  path: string;
  icon?: string;
  subItems?: tCategorySubItem[];
  isSportsBook?: boolean;
};

export type tCategoryData = {
  navItems: tCategoryNavItem[];
  category?: string;
  banners?: string[];
  showAppleImage: boolean;
};

export type tPageType =
  | "slots"
  | "live-casino"
  | "games"
  | "virtual-sports"
  | "jackpot"
  | "tv-games"
  | "live-racing";

export const CATEGORY_DATA: Record<tPageType, tCategoryData> = {
  slots: {
    navItems: [
      {
        name: "Home",
        path: "/casino/slots",
        subItems: [
          {
            name: "Top Slots",
            path: "/casino/slots?custom=1&category=slot-top-slots",
            icon: "/images/category_logo/top-slots.png",
          },
          {
            name: "All Games",
            path: "/casino/slots",
            icon: "/images/category_logo/all-games.png",
          },
          {
            name: "Pragmatic Play",
            path: "/casino/slots?provider=925eb5835a4f3a468ce7fcaf93a51cb1cc078bbb",
            icon: "/images/category_logo/ortak.png",
          },
          {
            name: "New",
            path: "/casino/slots?custom=1&category=slot-new",
            icon: "/images/category_logo/new.png",
          },
          {
            name: "Popular Games",
            path: "/casino/slots?custom=1&category=slot-popular",
            icon: "/images/category_logo/popular.png",
          },
          {
            name: "Jackpots",
            path: "/casino/slots?custom=1&category=slot-jackpots",
            icon: "/images/category_logo/jackpots.png",
          },
          {
            name: "Buy Bonus",
            path: "/casino/slots?custom=1&category=slot-buy-bonus",
            icon: "/images/category_logo/buy-bonus.png",
          },
          {
            name: "bfth_Arena",
            path: "/casino/slots?custom=1&category=slot-bftha",
            icon: "/images/category_logo/bftha.png",
          },
          {
            name: "EGT Bell",
            path: "/casino/slots?custom=1&category=egtbell",
            icon: "/images/category_logo/bftha.png",
          },
          {
            name: "VIP EGT Bell",
            path: "/casino/slots?custom=1&category=egtvipbell",
            icon: "/images/category_logo/bftha.png",
          },
        ],
      },
      {
        name: "Tournamements",
        path: "/casino/slots/tournaments",
      },
      {
        name: "bfth_Archives",
        path: "/casino/slots?custom=1&category=slot-bftha",
        subItems: [
          {
            name: "Top Slots",
            path: "/casino/slots?custom=1&category=slot-top-slots",
            icon: "/images/category_logo/top-slots.png",
          },
          {
            name: "All Games",
            path: "/casino/slots",
            icon: "/images/category_logo/all-games.png",
          },
          {
            name: "Pragmatic Play",
            path: "/casino/slots?provider=925eb5835a4f3a468ce7fcaf93a51cb1cc078bbb",
            icon: "/images/category_logo/ortak.png",
          },
          {
            name: "New",
            path: "/casino/slots?custom=1&category=slot-new",
            icon: "/images/category_logo/new.png",
          },
          {
            name: "Popular Games",
            path: "/casino/slots?custom=1&category=slot-popular",
            icon: "/images/category_logo/popular.png",
          },
          {
            name: "Jackpots",
            path: "/casino/slots?custom=1&category=slot-jackpots",
            icon: "/images/category_logo/jackpots.png",
          },
          {
            name: "Buy Bonus",
            path: "/casino/slots?custom=1&category=slot-buy-bonus",
            icon: "/images/category_logo/buy-bonus.png",
          },
          {
            name: "bfth_Arena",
            path: "/casino/slots?custom=1&category=slot-bftha",
            icon: "/images/category_logo/bftha.png",
          },
          {
            name: "EGT Bell",
            path: "/casino/slots?custom=1&category=egtbell",
            icon: "/images/category_logo/bftha.png",
          },
          {
            name: "VIP EGT Bell",
            path: "/casino/slots?custom=1&category=egtvipbell",
            icon: "/images/category_logo/bftha.png",
          },
        ],
      },
      {
        name: "Pragmatic games",
        path: "/casino/slots?provider=925eb5835a4f3a468ce7fcaf93a51cb1cc078bbb",
        subItems: [
          {
            name: "Top Slots",
            path: "/casino/slots?custom=1&category=slot-top-slots",
            icon: "/images/category_logo/top-slots.png",
          },
          {
            name: "All Games",
            path: "/casino/slots",
            icon: "/images/category_logo/all-games.png",
          },
          {
            name: "Pragmatic Play",
            path: "/casino/slots?provider=925eb5835a4f3a468ce7fcaf93a51cb1cc078bbb",
            icon: "/images/category_logo/ortak.png",
          },
          {
            name: "New",
            path: "/casino/slots?custom=1&category=slot-new",
            icon: "/images/category_logo/new.png",
          },
          {
            name: "Popular Games",
            path: "/casino/slots?custom=1&category=slot-popular",
            icon: "/images/category_logo/popular.png",
          },
          {
            name: "Jackpots",
            path: "/casino/slots?custom=1&category=slot-jackpots",
            icon: "/images/category_logo/jackpots.png",
          },
          {
            name: "Buy Bonus",
            path: "/casino/slots?custom=1&category=slot-buy-bonus",
            icon: "/images/category_logo/buy-bonus.png",
          },
          {
            name: "bfth_Arena",
            path: "/casino/slots?custom=1&category=slot-bftha",
            icon: "/images/category_logo/bftha.png",
          },
          {
            name: "EGT Bell",
            path: "/casino/slots?custom=1&category=egtbell",
            icon: "/images/category_logo/bftha.png",
          },
          {
            name: "VIP EGT Bell",
            path: "/casino/slots?custom=1&category=egtvipbell",
            icon: "/images/category_logo/bftha.png",
          },
        ],
      },
    ],
    category: "slots,crashgame,mines",
    banners: [
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
    ],
    showAppleImage: true,
  },
  "live-casino": {
    navItems: [
      {
        name: "Live Casino",
        path: "/casino/live-casino",
        subItems: [
          {
            name: "All Games",
            path: "/casino/live-casino",
            icon: "/images/category_logo/all-games.png",
          },
          {
            name: "Roulette",
            path: "/casino/live-casino?custom=1&category=rouletteglobal",
            icon: "/images/category_logo/all-games.png",
          },
          {
            name: "Blackjack",
            path: "/casino/live-casino?custom=1&category=blackjacks",
            icon: "/images/category_logo/all-games.png",
          },
          {
            name: "Baccarat",
            path: "/casino/live-casino?custom=1&category=baccaratglobal",
            icon: "/images/category_logo/all-games.png",
          },
          {
            name: "Video Poker",
            path: "/casino/live-casino?custom=1&category=videopoker",
            icon: "/images/category_logo/all-games.png",
          },
          {
            name: "Table Games",
            path: "/casino/live-casino?custom=1&category=tablegames",
            icon: "/images/category_logo/all-games.png",
          },
        ],
      },
    ],
    category:
      "tablegames,videopoker,scratchcards,livecasino,blackjacks,baccaratglobal,rouletteglobal,pokerglobal",
    banners: [
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
    ],
    showAppleImage: true,
  },
  games: {
    navItems: [
      {
        name: "Games",
        path: "/casino/games",
        subItems: [
          {
            name: "All Games",
            path: "/casino/games",
            icon: "/images/category_logo/all-games.png",
          },
        ],
      },
    ],
    category: "",
    banners: [
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
    ],
    showAppleImage: false,
  },
  "virtual-sports": {
    navItems: [
      {
        name: "Virtual Sports",
        path: "/casino/virtual-sports",
        subItems: [
          {
            name: "All Games",
            path: "/casino/virtual-sports",
            icon: "/images/category_logo/all-games.png",
          },
        ],
      },
    ],
    category: "virtualsports",
    banners: [
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
    ],
    showAppleImage: false,
  },
  jackpot: {
    navItems: [
      {
        name: "Jackpot",
        path: "/casino/jackpot",
        subItems: [
          {
            name: "All Games",
            path: "/casino/jackpot",
            icon: "/images/category_logo/all-games.png",
          },
        ],
      },
    ],
    category: "jackpots",
    banners: [
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
    ],
    showAppleImage: true,
  },
  "tv-games": {
    navItems: [
      {
        name: "TV Games",
        path: "/casino/tv-games",
        subItems: [
          {
            name: "All Games",
            path: "/casino/tv-games",
            icon: "/images/category_logo/all-games.png",
          },
        ],
      },
    ],
    category: "tvgames",
    banners: [
      "https://tekio.s3.eu-north-1.amazonaws.com/betinbet/promotions/slots.png",
    ],
    showAppleImage: true,
  },
  "live-racing": {
    navItems: [
      {
        name: "Horse Racing",
        path: "/casino/live-racing?sportsBookPath=/horse-racing",
        isSportsBook: true,
      },
      {
        name: "Dog Racing",
        path: "/casino/live-racing/dog?sportsBookPath=/greyhound-racing",
        isSportsBook: true,
      },
    ],
    showAppleImage: false,
  },
};
