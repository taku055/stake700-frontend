"use client";

import type { CSSProperties, MouseEventHandler } from "react";
import { ChevronRight } from "lucide-react";
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
export function ProviderCard({
  name,
  href,
  count,
  size = "md",
  onClick,
  className = "",
}: {
  name: string;
  href: string;
  count?: number;
  size?: "sm" | "md";
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}) {
  const t = useTranslations("CasinoPage");
  const small = size === "sm";

  return (
    <Link
      href={href}
      onClick={onClick}
      title={name}
      style={accentStyle(name)}
      className={`group relative flex items-center overflow-hidden border border-[var(--background-secondary)] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--bar-background-color)_86%,var(--accent)),var(--bar-background-color)_60%)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_65%,transparent)] hover:shadow-[0_16px_32px_-18px_var(--accent)] focus-visible:border-[var(--accent)] focus-visible:outline-none ${
        small ? "h-[64px] gap-2.5 rounded-xl px-3" : "h-[76px] gap-3 rounded-2xl px-3.5"
      } ${className}`}
    >
      {/* accent glow + initials watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -end-8 -top-10 h-24 w-24 rounded-full bg-[var(--accent)] opacity-[0.12] blur-2xl transition-opacity duration-300 group-hover:opacity-30"
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute -bottom-4 -end-1 select-none font-black leading-none tracking-[-0.06em] text-white/[0.035] transition-colors duration-300 group-hover:text-[color-mix(in_srgb,var(--accent)_16%,transparent)] ${
          small ? "text-[48px]" : "text-[64px]"
        }`}
      >
        {providerInitials(name)}
      </span>

      <ProviderMonogram name={name} size={small ? "sm" : "md"} className="relative" />

      <span className="relative flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={`truncate font-bold leading-tight text-white ${small ? "text-[13px]" : "text-[14px]"}`}>
          {name}
        </span>
        {typeof count === "number" && count > 0 && (
          <span className={`font-semibold tabular-nums text-[var(--text-muted-color)] ${small ? "text-[11px]" : "text-[12px]"}`}>
            {t("provider_games", { count: count.toLocaleString() })}
          </span>
        )}
      </span>

      {!small && (
        <span
          aria-hidden
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--text-muted-color)] transition-colors duration-300 group-hover:bg-[var(--accent)] group-hover:text-white"
        >
          <ChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </span>
      )}
    </Link>
  );
}
