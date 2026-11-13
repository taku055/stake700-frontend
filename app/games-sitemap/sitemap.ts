import type { MetadataRoute } from "next";
import { routes } from "@/config/routes";
import { DEFAULT_LOCALE, LOCALES, LOCALE_HREFLANG } from "@/config/i18n";
import { getGamesPage } from "@/lib/server-data";
import { siteUrl } from "@/lib/seo";
import { GAMES_PER_SITEMAP, MAX_GAME_SITEMAPS } from "@/config/sitemaps";

/**
 * Game pages, split into /games-sitemap/sitemap/{n}.xml files of
 * GAMES_PER_SITEMAP games (x5 languages = 10k URLs, well under Google's 50k).
 * The slot count is fixed so the build never depends on the API being up;
 * robots.txt only advertises the files that currently contain games.
 */
export const revalidate = 3600;

export function generateSitemaps() {
  return Array.from({ length: MAX_GAME_SITEMAPS }, (_, id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id) || 0;
  const page = await getGamesPage(id * GAMES_PER_SITEMAP, GAMES_PER_SITEMAP);
  if (!page) return [];

  const base = siteUrl();
  const abs = (lang: string, path: string) => new URL(`/${lang}${path}`, base).toString();

  return page.games
    .filter((g) => !g.href && !g.is_deleted)
    .flatMap((game) => {
      const path = routes.game(game.id, game.name);
      const languages: Record<string, string> = Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], abs(l, path)]),
      );
      languages["x-default"] = abs(DEFAULT_LOCALE, path);
      return LOCALES.map((lang) => ({
        url: abs(lang, path),
        changeFrequency: "weekly" as const,
        priority: 0.5,
        alternates: { languages },
        ...(game.img_custom || game.img ? { images: [game.img_custom || game.img] } : {}),
      }));
    });
}
