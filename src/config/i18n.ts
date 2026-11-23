/**
 * Locale configuration shared by the server (proxy, layouts, metadata) and the client.
 * Must stay free of browser APIs so it can run anywhere.
 */
// "ar" is Arabic, so Argentina uses "es" (Spanish) and Brazil "pt" (Portuguese).
export const LOCALES = ["en", "ar", "de", "fr", "ru", "tr", "mn", "pt", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const RTL_LOCALES: readonly Locale[] = ["ar"];

/** Language picker entries, in display order. `flag` is a flag-icons country code. */
export const LOCALE_OPTIONS: readonly { label: string; value: Locale; flag: string }[] = [
  { label: "English", value: "en", flag: "us" },
  { label: "العربية", value: "ar", flag: "ae" },
  { label: "Deutsch", value: "de", flag: "de" },
  { label: "Français", value: "fr", flag: "fr" },
  { label: "Русский", value: "ru", flag: "ru" },
  { label: "Türkçe", value: "tr", flag: "tr" },
  { label: "Монгол", value: "mn", flag: "mn" },
  { label: "Português (Brasil)", value: "pt", flag: "br" },
  { label: "Español (Argentina)", value: "es", flag: "ar" },
];

/** BCP-47 tags used for hreflang and <html lang>. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  ar: "ar",
  de: "de",
  fr: "fr",
  ru: "ru",
  tr: "tr",
  mn: "mn",
  pt: "pt-BR",
  es: "es-AR",
};

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_AR",
  de: "de_DE",
  fr: "fr_FR",
  ru: "ru_RU",
  tr: "tr_TR",
  mn: "mn_MN",
  pt: "pt_BR",
  es: "es_AR",
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
