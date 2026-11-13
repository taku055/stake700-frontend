import type { MetadataRoute } from "next";
import { LOCALES } from "@/config/i18n";
import { siteUrl } from "@/lib/seo";
import { getGamesTotal } from "@/lib/server-data";
import { GAMES_PER_SITEMAP, MAX_GAME_SITEMAPS } from "@/config/sitemaps";

export const revalidate = 3600;

/** Private areas (dashboards, payments, account flows) are kept out of the index. */
const PRIVATE = [
  "/agent",
  "/superagent",
  "/area_manager",
  "/affiliate",
  "/my-bets",
  "/favorites",
  "/payment",
  "/profile",
  "/verify-email",
  "/reset-password",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = siteUrl();
  const total = await getGamesTotal();
  const gameSitemaps = Math.min(MAX_GAME_SITEMAPS, Math.ceil(total / GAMES_PER_SITEMAP));

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", ...LOCALES.flatMap((l) => PRIVATE.map((p) => `/${l}${p}`))],
      },
    ],
    sitemap: [
      new URL("/sitemap.xml", base).toString(),
      ...Array.from({ length: gameSitemaps }, (_, i) => new URL(`/games-sitemap/sitemap/${i}.xml`, base).toString()),
    ],
    host: base.origin,
  };
}
