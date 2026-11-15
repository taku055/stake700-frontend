import type { CSSProperties } from "react";
import { categoryLook } from "../categoryIcons";

/** Large accent-coloured icon tile for category page banners. */
export function CategoryBadge({ look }: { look: string }) {
  const { Icon, accent } = categoryLook(look);
  return (
    <span
      aria-hidden
      style={{ "--accent": accent } as CSSProperties}
      className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_55%,#0f212e),color-mix(in_srgb,var(--accent)_18%,#0f212e))] text-white shadow-[0_18px_40px_-16px_var(--accent),inset_0_1px_0_rgba(255,255,255,0.25)] md:h-24 md:w-24"
    >
      <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
      <Icon size={40} strokeWidth={2} className="relative drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]" />
    </span>
  );
}
