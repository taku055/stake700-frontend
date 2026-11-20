import { Crown, Diamond, Gem, Medal, type LucideIcon } from "lucide-react";

export type TierLook = { Icon: LucideIcon; color: string; color2: string };

/** Colour + medal per tier family, picked from the tier title. */
export function tierLook(title: string | undefined | null): TierLook {
  const t = (title ?? "").toLowerCase();
  if (t.includes("elite")) return { Icon: Crown, color: "#ff5c8a", color2: "#ffb36b" };
  if (t.includes("diamond")) return { Icon: Diamond, color: "#8ab4ff", color2: "#c4a8ff" };
  if (t.includes("platinum")) return { Icon: Gem, color: "#5ee0d0", color2: "#8ab4ff" };
  if (t.includes("gold")) return { Icon: Medal, color: "#ffc83d", color2: "#ff9f1c" };
  if (t.includes("silver")) return { Icon: Medal, color: "#c7d0de", color2: "#8fa0b8" };
  return { Icon: Medal, color: "#d98b4a", color2: "#a8602e" }; // bronze / default
}
