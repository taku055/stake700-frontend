import type { tProvider } from "@/types/tProvider";
import type { tGame } from "@/types/tGame";
import type { tCustomGame } from "@/types/tCustomGame";
import { buildProviderSlugs } from "@/config/catalog";
import { matchesCustomCategory } from "@/config/customGameCategories";

/**
 * Server-side reads for routing and metadata (provider slugs, game titles).
 * Uses fetch caching so pages don't hit the backend on every request.
 */
const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1`;
const REVALIDATE = 300;
/** Give up quickly so a slow/down backend never stalls page rendering. */
const TIMEOUT_MS = 5000;
/** Log each failing endpoint at most once per minute. */
const LOG_INTERVAL_MS = 60_000;
const lastLogged = new Map<string, number>();

function errorCode(err: unknown): string {
  const e = err as { name?: string; code?: string; message?: string; cause?: any };
  if (e?.name === "TimeoutError") return `timeout after ${TIMEOUT_MS}ms`;
  const cause = e?.cause;
  const codes = new Set<string>(
    [cause?.code, ...(cause?.errors ?? []).map((x: any) => x?.code)].filter(Boolean),
  );
  return codes.size ? [...codes].join("/") : (e?.message ?? String(err));
}

function logFailure(path: string, reason: string) {
  const now = Date.now();
  if (now - (lastLogged.get(path) ?? 0) < LOG_INTERVAL_MS) return;
  lastLogged.set(path, now);
  console.warn(`[server-data] ${API}${path} unavailable (${reason}); rendering without it`);
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: REVALIDATE },
      headers: { "ngrok-skip-browser-warning": "true" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      // 4xx (e.g. unknown game id) is a normal "not found", not an outage
      if (res.status >= 500) logFailure(path, `HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    logFailure(path, errorCode(err));
    return null;
  }
}

export type ProviderWithSlug = tProvider & { slug: string };

/** All visible providers with stable, unique URL slugs. */
export async function getProviders(): Promise<ProviderWithSlug[]> {
  const list = ((await getJson<tProvider[]>("/game/providers?category=")) ?? []).filter((p) => p.added_slot);
  const slugs = buildProviderSlugs(list);
  return list
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name))
    .map((p) => ({ ...p, slug: slugs.get(p.id) ?? p.id }));
}

/** Resolve "/providers/[slugOrId]". Returns the provider and whether the URL used the raw id. */
export async function findProvider(slugOrId: string) {
  const providers = await getProviders();
  const bySlug = providers.find((p) => p.slug === slugOrId);
  if (bySlug) return { provider: bySlug, byId: false };
  const byId = providers.find((p) => p.id === slugOrId);
  return byId ? { provider: byId, byId: true } : null;
}

export async function getGame(id: string): Promise<tGame | null> {
  return getJson<tGame>(`/game/${encodeURIComponent(id)}`);
}

export type InitialGames = { games: tGame[]; total: number };

/** A stable (non-random) page of the full game list, for sitemaps. */
export async function getGamesPage(offset: number, limit: number): Promise<InitialGames | null> {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  const res = await getJson<{ data: tGame[]; total: number }>(`/game/games?${params}`);
  return res ? { games: res.data, total: res.total } : null;
}

/** Total number of games (cached), used to size the game sitemaps. */
export async function getGamesTotal(): Promise<number> {
  return (await getGamesPage(0, 1))?.total ?? 0;
}

/** All curated ("custom") game entries; small enough to cache whole. */
async function getCustomGames(): Promise<tCustomGame[] | null> {
  const res = await getJson<{ data: tCustomGame[] }>("/game/custom-games?category=&offset=0&limit=10000");
  return res?.data ?? null;
}

/**
 * Curated games for seeding lobby pages: at most `perCategory` entries per
 * category (rows show up to 30) and only the fields game cards use.
 */
export async function getCustomGamesSeed(perCategory = 30): Promise<tCustomGame[]> {
  const all = (await getCustomGames()) ?? [];
  const counts = new Map<string, number>();
  const seed: tCustomGame[] = [];
  for (const entry of all) {
    if (!entry.Game) continue;
    const n = counts.get(entry.category) ?? 0;
    if (n >= perCategory) continue;
    counts.set(entry.category, n + 1);
    const g = entry.Game;
    seed.push({
      id: entry.id,
      gameId: entry.gameId,
      category: entry.category,
      order: entry.order,
      Game: {
        id: g.id,
        name: g.name,
        img: g.img,
        img_custom: g.img_custom,
        providerId: g.providerId,
        gameType: g.gameType,
        href: g.href,
      } as tGame,
    });
  }
  return seed;
}

/** Game counts for several curated categories, keyed by backend category (null if unavailable). */
export async function getCustomCategoryCounts(categories: string[]): Promise<Record<string, number> | null> {
  const all = await getCustomGames();
  if (!all) return null;
  const counts: Record<string, number> = {};
  for (const category of categories) {
    counts[category] = all.filter((c) => c.Game && matchesCustomCategory(c.category, category)).length;
  }
  return counts;
}

/** Number of games in a curated category (aliases included). */
export async function getCustomCategoryCount(category: string): Promise<number | null> {
  const all = await getCustomGames();
  if (!all) return null;
  return all.filter((c) => c.Game && matchesCustomCategory(c.category, category)).length;
}

const FIRST_PAGE = 24;

/**
 * First page of a game grid, rendered on the server so crawlers see real game
 * names and links. The client grid continues paging from here.
 */
export async function getInitialGames(opts: {
  isCustom: boolean;
  category?: string;
  gameType?: "SLOT" | "LIVECASINO" | null;
  provider?: string;
}): Promise<InitialGames | undefined> {
  if (opts.isCustom && opts.category) {
    const custom = await getCustomGames();
    if (!custom) return undefined;
    const all = custom.filter(
      (c) =>
        c.Game &&
        matchesCustomCategory(c.category, opts.category!) &&
        (!opts.provider || opts.provider.includes(c.Game.providerId)),
    );
    return { games: all.slice(0, FIRST_PAGE).map((c) => c.Game as tGame), total: all.length };
  }

  const params = new URLSearchParams({ limit: String(FIRST_PAGE), offset: "0", randomOrderby: "true" });
  if (opts.category) params.set("category", opts.category);
  if (opts.provider) params.set("provider", opts.provider);
  if (opts.gameType) params.set("gameType", opts.gameType);
  const res = await getJson<{ data: tGame[]; total: number }>(`/game/games?${params}`);
  return res ? { games: res.data, total: res.total } : undefined;
}
