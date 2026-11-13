import { signal } from "@preact/signals-react";
import { DEFAULT_LOCALE, splitLocale } from "@/config/i18n";

/**
 * Active UI language. The URL prefix (/ar/…, /en/…) is the source of truth:
 * the [lang] layout seeds this signal on every render, and <LocaleUrlSync>
 * navigates to the matching URL when code changes it (language pickers).
 */
function initialLocale(): string {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  return splitLocale(window.location.pathname).locale ?? DEFAULT_LOCALE;
}

export const localeState = signal<string>(initialLocale());
