/**
 * Offline / CI-safe fonts: avoids `next/font/google`, which downloads from
 * Google during `next build` and fails when fonts.googleapis.com is unreachable.
 *
 * Replace:
 *   import { Inter, Fira_Code } from "next/font/google";
 * with:
 *   import { inter, firaCode } from "@/config/fonts";
 * (or your alias path to this file)
 *
 * Keep the same usage in layout.tsx, e.g. className={inter.className} and
 * `${inter.variable} ${firaCode.variable}` on <html> or <body>.
 */

const interStack =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const monoStack =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

type NextFontLike = {
  className: string;
  variable: string;
  style: { fontFamily: string };
};

export const inter = {
  className: "font-fallback-sans",
  variable: "font-fallback-sans",
  style: { fontFamily: interStack },
} satisfies NextFontLike;

export const firaCode = {
  className: "font-fallback-mono",
  variable: "font-fallback-mono",
  style: { fontFamily: monoStack },
} satisfies NextFontLike;
