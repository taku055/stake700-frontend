/**
 * Locale configuration shared by the server (proxy, layouts, metadata) and the client.
 * Must stay free of browser APIs so it can run anywhere.
 */
export const LOCALES = ["ar", "en", "de", "fr", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const RTL_LOCALES: readonly Locale[] = ["ar"];

/** BCP-47 tags used for hreflang / og:locale. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  ar: "ar",
  en: "en",
  de: "de",
  fr: "fr",
  ru: "ru",
};

export const OG_LOCALE: Record<Locale, string> = {
  ar: "ar_AR",
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  ru: "ru_RU",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function isRtlLocale(locale: string): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}

/** "/ar/casino/new" -> { locale: "ar", path: "/casino/new" }. Path without a locale returns locale: null. */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const [, first, ...rest] = (pathname || "/").split("/");
  if (isLocale(first)) {
    const path = "/" + rest.join("/");
    return { locale: first, path: path === "/" ? "/" : path.replace(/\/+$/, "") || "/" };
  }
  return { locale: null, path: pathname || "/" };
}

/** Prefixes an internal href with a locale. External links, anchors and already-prefixed hrefs are returned unchanged. */
export function localizeHref(href: string, locale: string): string {
  if (!href) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return href; // http:, mailto:, tel:, //cdn, #hash
  if (!href.startsWith("/")) return href; // relative — leave alone
  const { locale: existing } = splitLocale(href.split(/[?#]/)[0]);
  if (existing) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/?") || href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}
