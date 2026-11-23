/**
 * Game sitemap sizing.
 *
 * Every game is listed once per language, each URL carrying its hreflang
 * alternates, so one game costs ~1.7 KB x 9 languages ≈ 15 KB of XML.
 * Vercel refuses ISR pages over 20 MB (FALLBACK_BODY_TOO_LARGE): 500 games
 * per file is ~7.5 MB, which leaves room for more languages or longer names.
 */
export const GAMES_PER_SITEMAP = 500;
/**
 * Fixed number of game sitemap slots, so the build never depends on the API
 * being up. 40 x 500 = 20,000 games (the catalogue is ~5,800); empty slots are
 * cheap, and robots.txt only lists the ones that contain games.
 */
export const MAX_GAME_SITEMAPS = 40;
