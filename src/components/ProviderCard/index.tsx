"use client";

import type { CSSProperties, MouseEventHandler } from "react";
import { ChevronRight, Crown } from "lucide-react";
import { Link } from "@/components/common/Link";
import { useTranslations } from "@/context/I18nContext";

/**
 * Image-free provider identity: a monogram ("PP" for Pragmatic Play) on a
 * gradient picked deterministically from the name, so each studio keeps the
 * same colour everywhere (and server/client renders match).
 */

const ACCENTS: [string, string][] = [
  ["#1475e1", "#4aa3ff"], // brand blue
  ["#3b5bdb", "#7c8cff"], // indigo
  ["#0e9fb3", "#5ee0ef"], // cyan
  ["#0f9d74", "#4fd1a5"], // emerald
  ["#7c4ddb", "#b28cff"], // violet
  ["#d9822b", "#ffb866"], // amber
  ["#d6336c", "#ff7aa8"], // rose
  ["#2f80ed", "#56ccf2"], // sky
];

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

export function providerAccent(name: string): [string, string] {
  return ACCENTS[hash(name.trim().toLowerCase()) % ACCENTS.length];
}

export function providerInitials(name: string): string {
  const words = name.replace(/[^\p{L}\p{N}\s\-_.]/gu, "").split(/[\s\-_.]+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  const word = words[0];
  if (/^[A-Z0-9]{2,3}$/.test(word)) return word; // EGT, BTG
  const caps = word.match(/[A-Z0-9]/g);
  if (caps && caps.length >= 2) return (caps[0] + caps[1]).toUpperCase(); // KaGaming -> KG
  return word.slice(0, 2).toUpperCase();
}

/** CSS variables consumed by the monogram / card styles. */
export function accentStyle(name: string): CSSProperties {
  const [a, b] = providerAccent(name);
  return { "--accent": a, "--accent-2": b } as CSSProperties;
}

const MONO_SIZES = {
  xs: "h-6 w-6 rounded-md text-[10px]",
  sm: "h-9 w-9 rounded-[10px] text-[13px]",
  md: "h-11 w-11 rounded-xl text-[15px]",
  lg: "h-20 w-20 rounded-2xl text-[28px] md:h-24 md:w-24 md:text-[32px]",
} as const;

export function ProviderMonogram({
  name,
  size = "md",
  className = "",
}: {
  name: string;
  size?: keyof typeof MONO_SIZES;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      style={accentStyle(name)}
      className={`flex shrink-0 items-center justify-center bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] font-extrabold tracking-[-0.02em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_18px_-8px_var(--accent)] ${MONO_SIZES[size]} ${className}`}
    >
      {providerInitials(name)}
    </span>
  );
}

/**
 * Provider card: monogram, name and game count, with a soft accent glow and a
 * large initials watermark. "sm" is the compact version for carousels.
 */
const RANK_COLORS = ["#ffc83d", "#c7d0de", "#d98b4a"] as const;

export function ProviderCard({
  name,
  href,
  count,
  size = "md",
  rank,
  onClick,
  className = "",
}: {
  name: string;
  href: string;
  count?: number;
  size?: "sm" | "md";
  /** 1-based popularity rank; 1–3 get a crown badge */
  rank?: number;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}) {
  const t = useTranslations("CasinoPage");
  const small = size === "sm";
  const rankColor = rank && rank <= 3 ? RANK_COLORS[rank - 1] : null;

  return (
    <Link
      href={href}
      onClick={onClick}
      title={name}
      style={accentStyle(name)}
      className={`group relative isolate flex items-center overflow-hidden border border-[var(--background-secondary)] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--bar-background-color)_82%,var(--accent)),var(--bar-background-color)_62%)] shadow-[0_8px_20px_-14px_rgba(0,0,0,0.8)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-20px_var(--accent)] focus-visible:outline-none ${
        small ? "h-[64px] gap-2.5 rounded-xl px-3" : "h-[88px] gap-3.5 rounded-2xl ps-3.5 pe-3"
      } ${className}`}
    >
      {/* gradient outline on hover / focus */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-[linear-gradient(135deg,var(--accent-2),var(--accent)_45%,transparent_80%)] p-[1.5px] opacity-0 transition-opacity duration-300 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      {/* light sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -start-1/2 z-10 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)] transition-transform duration-700 ease-out group-hover:translate-x-[420%] rtl:group-hover:-translate-x-[420%]"
      />
      {/* accent glow + initials watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -end-10 -top-12 h-28 w-28 rounded-full bg-[var(--accent)] opacity-[0.14] blur-2xl transition-opacity duration-300 group-hover:opacity-35"
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute -bottom-5 end-8 select-none font-black italic leading-none tracking-[-0.06em] text-white/[0.04] transition-colors duration-300 group-hover:text-[color-mix(in_srgb,var(--accent)_18%,transparent)] ${
          small ? "text-[48px]" : "text-[76px]"
        }`}
      >
        {providerInitials(name)}
      </span>
      {/* growing accent line */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 start-0 h-[2px] w-0 bg-[linear-gradient(90deg,var(--accent),var(--accent-2))] transition-[width] duration-500 ease-out group-hover:w-full"
      />

      {/* monogram with halo */}
      <span
        className={`relative z-10 shrink-0 rounded-[14px] p-[3px] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${
          small ? "" : "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
        }`}
      >
        <ProviderMonogram name={name} size={small ? "sm" : "md"} />
      </span>

      <span className="relative z-10 flex min-w-0 flex-1 flex-col gap-1">
        <span className={`truncate font-extrabold leading-tight text-white ${small ? "text-[13px]" : "text-[15px]"}`}>
          {name}
        </span>
        {typeof count === "number" && count > 0 && (
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full font-semibold tabular-nums text-[var(--text-muted-color)] ${
              small ? "text-[11px]" : "bg-black/20 px-2 py-0.5 text-[12px]"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
            {t("provider_games", { count: count.toLocaleString("en-US") })}
          </span>
        )}
      </span>

      {rankColor && (
        <span
          aria-label={`#${rank}`}
          style={{ "--rank": rankColor } as CSSProperties}
          className="absolute end-2 top-2 z-10 inline-flex items-center gap-0.5 rounded-full bg-[color-mix(in_srgb,var(--rank)_18%,transparent)] px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--rank)] ring-1 ring-[color-mix(in_srgb,var(--rank)_45%,transparent)]"
        >
          <Crown size={10} strokeWidth={2.6} />
          {rank}
        </span>
      )}

      {!small && (
        <span
          aria-hidden
          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-[var(--text-muted-color)] transition-colors duration-300 group-hover:bg-[var(--accent)] group-hover:text-white ${
            rankColor ? "mt-5" : ""
          }`}
        >
          <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </span>
      )}
    </Link>
  );
}
