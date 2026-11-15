import {
  Armchair,
  Bell,
  BookOpen,
  Cherry,
  CircleDot,
  Club,
  Coins,
  Crown,
  Dice5,
  Flame,
  Flower2,
  Gamepad2,
  Gem,
  Heart,
  Layers,
  LayoutGrid,
  Lock,
  Radio,
  Rocket,
  ShoppingBag,
  Spade,
  Sparkles,
  Star,
  Trophy,
  Users,
  Tv,
  type LucideIcon,
} from "lucide-react";
import type { CatalogSection } from "@/config/catalog";

/** Line icon + accent colour for each section / category (by URL slug). */
export type CategoryLook = { Icon: LucideIcon; accent: string };

export const SECTION_LOOK: Record<CatalogSection, CategoryLook> = {
  casino: { Icon: Cherry, accent: "#ff5c7a" },
  "live-casino": { Icon: Radio, accent: "#ff4d5e" },
};

const LOBBY: CategoryLook = { Icon: LayoutGrid, accent: "#4aa3ff" };
const ALL_GAMES: CategoryLook = { Icon: Gamepad2, accent: "#7c8cff" };

const BY_SLUG: Record<string, CategoryLook> = {
  // casino
  top: { Icon: Trophy, accent: "#ffc83d" },
  trending: { Icon: Flame, accent: "#ff7a3c" },
  "most-played": { Icon: Users, accent: "#4aa3ff" },
  new: { Icon: Sparkles, accent: "#38d9f5" },
  popular: { Icon: Heart, accent: "#ff5c8a" },
  jackpots: { Icon: Coins, accent: "#ffd23f" },
  megaways: { Icon: Layers, accent: "#b28cff" },
  "bonus-buy": { Icon: ShoppingBag, accent: "#3ee08f" },
  "hold-and-win": { Icon: Lock, accent: "#ffb020" },
  "fruit-slots": { Icon: Cherry, accent: "#ff5c7a" },
  classics: { Icon: Bell, accent: "#e0b467" },
  "book-of": { Icon: BookOpen, accent: "#c9a46b" },
  "instant-games": { Icon: Rocket, accent: "#ff6b6b" },
  // live casino
  "table-games": { Icon: Armchair, accent: "#4aa3ff" },
  "live-tables": { Icon: Radio, accent: "#ff4d5e" },
  "top-tables": { Icon: Star, accent: "#ffc83d" },
  roulette: { Icon: CircleDot, accent: "#ff5c5c" },
  blackjack: { Icon: Club, accent: "#3ee08f" },
  baccarat: { Icon: Gem, accent: "#ff7aa8" },
  "game-shows": { Icon: Tv, accent: "#b28cff" },
  poker: { Icon: Spade, accent: "#7c8cff" },
  "asian-games": { Icon: Flower2, accent: "#ff8a5c" },
  "sic-bo": { Icon: Dice5, accent: "#38d9f5" },
  "high-stakes": { Icon: Crown, accent: "#ffd23f" },
};

/** "lobby", "games" or a category slug. */
export function categoryLook(key: string): CategoryLook {
  if (key === "lobby") return LOBBY;
  if (key === "games") return ALL_GAMES;
  return BY_SLUG[key] ?? ALL_GAMES;
}
