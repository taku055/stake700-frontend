import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  splitLocale,
  type Locale,
} from "./src/config/i18n";
import {
  LEGACY_CATEGORY_PAGES,
  findCategoryByBackendKey,
  type CatalogSection,
} from "./src/config/catalog";

/**
 * 1. Every page lives under /{locale}/… — locale-less requests are redirected
 *    to the visitor's language (cookie → Accept-Language → default).
 * 2. Legacy query-string and broken URLs get a permanent redirect to their clean
 *    equivalent, so old links, bookmarks and indexed pages keep working.
 */

const STATIC_ALIASES: Record<string, string> = {
  "/lobby-casino": "/casino",
  "/lobby-live-casino": "/live-casino",
  "/responsible-gaming": "/support/responsible-gambling",
  "/help": "/support/help-center",
  "/privacy": "/privacy-policy",
  "/privacy_policy/withdrawal_policy": "/privacy-policy",
  "/terms": "/other-rules",
  "/gambling-helpline": "/support/gambling-helpline",
  "/law-enforcement-request": "/support/law-enforcement-request",
  "/self-exclusion": "/support/self-exclusion",
  "/affiliates": "/affiliate",
  "/profile/mybets/casino": "/my-bets/casino",
  "/profile/mybets/sports": "/my-bets/sports",
  "/my-bets": "/my-bets/casino",
  "/casino-category": "/casino",
};

// Old "/top-casino" style category paths
for (const [key, target] of Object.entries(LEGACY_CATEGORY_PAGES)) {
  STATIC_ALIASES[`/${key}`] = `/${target.section}/${target.slug}`;
}

const CONSUMED_PARAMS = ["page", "custom", "category", "providerId"];

function withQuery(path: string, params: URLSearchParams, extra?: Record<string, string>) {
  const out = new URLSearchParams();
  params.forEach((value, key) => {
    if (!CONSUMED_PARAMS.includes(key)) out.append(key, value);
  });
  for (const [k, v] of Object.entries(extra ?? {})) out.set(k, v);
  const qs = out.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Returns the clean, locale-less target for a legacy URL, or null when the URL is already canonical. */
function legacyTarget(path: string, params: URLSearchParams): string | null {
  const page = params.get("page");
  const providerId = params.get("providerId")?.trim();
  const custom = params.get("custom") === "1";
  const category = params.get("category");

  // /?page=lobby-casino
  if (path === "/" && page) {
    if (page === "lobby-casino") return withQuery("/casino", params);
    if (page === "lobby-live-casino") return withQuery("/live-casino", params);
    return withQuery("/", params);
  }

  // /casino-category?page=popular-casino
  if (path === "/casino-category") {
    const target = page ? LEGACY_CATEGORY_PAGES[page] : undefined;
    return withQuery(target ? `/${target.section}/${target.slug}` : "/casino", params);
  }

  // /casino/slots, /casino/live-casino, /casino/search, /casino/home (+ query filters)
  const legacyCasino = path.match(/^\/casino\/(slots|live-casino|search|home)(?:\/.*)?$/);
  if (legacyCasino) {
    const pageType = legacyCasino[1];
    const section: CatalogSection = pageType === "live-casino" ? "live-casino" : "casino";
    const providerIds = (providerId || "").split(",").map((s) => s.trim()).filter(Boolean);

    if (custom && category) {
      const cat = findCategoryByBackendKey(category, section);
      const base = cat ? `/${cat.section}/${cat.slug}` : `/${section}`;
      return withQuery(base, params, providerIds.length ? { providers: providerIds.join(",") } : undefined);
    }
    if (providerIds.length === 1) return withQuery(`/providers/${providerIds[0]}`, params);
    if (providerIds.length > 1) {
      return withQuery(`/${section}/games`, params, { providers: providerIds.join(",") });
    }
    if (pageType === "home") return withQuery("/casino", params);
    return withQuery(`/${section}/games`, params);
  }

  // /gallery/all?providerId=X
  if (path.startsWith("/gallery")) {
    return withQuery(providerId ? `/providers/${providerId}` : "/providers", params);
  }

  // /support/fairness/* -> /provably-fair/*
  if (path === "/support/fairness" || path.startsWith("/support/fairness/")) {
    return withQuery(path.replace("/support/fairness", "/provably-fair"), params);
  }

  if (STATIC_ALIASES[path]) return withQuery(STATIC_ALIASES[path], params);

  return null;
}

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") || "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of preferred) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { locale, path } = splitLocale(pathname);
  const normalizedPath = path !== "/" ? path.replace(/\/+$/, "") : path;

  const legacy = legacyTarget(normalizedPath, searchParams);

  if (!locale) {
    const target = detectLocale(request);
    const dest = legacy ?? withQueryAll(normalizedPath, searchParams);
    const url = new URL(`/${target}${dest === "/" ? "" : dest}`, request.url);
    // Legacy URLs moved permanently; plain locale-less URLs depend on the visitor's language
    return NextResponse.redirect(url, legacy ? 308 : 307);
  }

  if (legacy) {
    const url = new URL(`/${locale}${legacy === "/" ? "" : legacy}`, request.url);
    return NextResponse.redirect(url, 308);
  }

  // Canonicalise trailing slashes: /ar/casino/ -> /ar/casino
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return response;
}

function withQueryAll(path: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export const config = {
  matcher: [
    // Everything except Next internals, API routes, metadata files and files with an extension
    "/((?!_next/|api/|sitemap\\.xml|robots\\.txt|manifest\\.json|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
