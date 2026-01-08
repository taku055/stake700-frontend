export const TRENDING_CATEGORIES: Record<string, { key: string; name: string; category: string; selectedCategory: string; icon: string }> = {
  "top-slots": {
    key: "top-slots",
    name: "Top Slots",
    category: "slot-top-slots",
    selectedCategory: "/casino/slots?custom=1&category=slot-top-slots",
    icon: "/images/category_logo/top-slots.png"
  },
  "live-casino": {
    key: "live-casino",
    name: "Live Casino",
    category: "home-live-casino",
    selectedCategory: "/casino/live-casino",
    icon: "/images/category_logo/all-games.png"
  },
  "megaways": { 
    key: "megaways",
    name: "Megaways",
    category: "megaways",
    selectedCategory: "/casino/slots?custom=1&category=megaways",
    icon: "/images/sidebar/megaways.svg"
  },
  "classic-slots": {
    key: "classic-slots",
    name: "Classic Slots",
    category: "classic-slots",
    selectedCategory: "/casino/slots?custom=1&category=classic-slots",
    icon: "/images/sidebar/classic-slots.svg"
  },
  "drop-wins": {
    key: "drop-wins",
    name: "Drop Wins",
    category: "drop-wins",
    selectedCategory: "/casino/slots?custom=1&category=drop-wins",
    icon: "/images/sidebar/drop-wins.svg"
  },
};

