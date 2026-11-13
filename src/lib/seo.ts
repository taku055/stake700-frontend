import type { Metadata } from "next";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_HREFLANG,
  OG_LOCALE,
  isLocale,
  type Locale,
} from "@/config/i18n";
import ar from "@/assets/i18n/ar.json";
import en from "@/assets/i18n/en.json";
import de from "@/assets/i18n/de.json";
import fr from "@/assets/i18n/fr.json";
import ru from "@/assets/i18n/ru.json";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Stake700";
const DEFAULT_OG_IMAGE = "/og.png";

const DICTIONARIES: Record<Locale, Record<string, any>> = { ar, en, de, fr, ru };

/** Absolute site origin, used for canonical/hreflang/sitemap URLs. */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "localhost:3000";
  const isLocal = /^(localhost|127\.|0\.0\.0\.0)/.test(domain);
  return new URL(`${isLocal ? "http" : "https"}://${domain}`);
}

function lookup(dict: Record<string, any>, key: string): string | undefined {
  const value = key.split(".").reduce<any>((acc, part) => (acc == null ? acc : acc[part]), dict);
  return typeof value === "string" ? value : undefined;
}

/** Server-side translation with {placeholder} interpolation, falling back to English then the key. */
export function translate(lang: Locale, key: string, values?: Record<string, string | number>): string {
  let text = lookup(DICTIONARIES[lang], key) ?? lookup(DICTIONARIES.en, key) ?? key;
  for (const [k, v] of Object.entries({ site: SITE_NAME, ...values })) {
    text = text.split(`{${k}}`).join(String(v));
  }
  return text;
}

export async function resolveLang(params: Promise<{ lang: string }> | { lang: string }): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

export type SeoInput = {
  lang: Locale;
  /** Locale-less path of the page, e.g. "/casino/new" */
  path: string;
  title: string;
  description?: string;
  noindex?: boolean;
  image?: string;
  /** Use the title as-is instead of the "%s | Site" template */
  absoluteTitle?: boolean;
};

export function buildMetadata({ lang, path, title, description, noindex, image, absoluteTitle }: SeoInput): Metadata {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_HREFLANG[l]] = `/${l}${clean}`;
  languages["x-default"] = `/${DEFAULT_LOCALE}${clean}`;

  const desc = description ?? translate(lang, "Seo.site_description");
  // Pages without their own artwork share the branded default (app/og.png/route.tsx)
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: noindex ? undefined : { canonical: `/${lang}${clean}`, languages },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: desc,
      url: `/${lang}${clean}`,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [image ? { url: ogImage } : { url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

type PageParams = { params: Promise<{ lang: string }> };

/**
 * Shorthand for static pages: `export const generateMetadata = seoFor("faq", "/faq")`
 * reads Seo.faq_title / Seo.faq_description from the translation files.
 */
export function seoFor(key: string, path: string, options: { noindex?: boolean } = {}) {
  return async ({ params }: PageParams): Promise<Metadata> => {
    const lang = await resolveLang(params);
    const description = lookup(DICTIONARIES[lang], `Seo.${key}_description`) ?? lookup(DICTIONARIES.en, `Seo.${key}_description`);
    return buildMetadata({
      lang,
      path,
      title: translate(lang, `Seo.${key}_title`),
      description: description ? translate(lang, `Seo.${key}_description`) : undefined,
      noindex: options.noindex,
    });
  };
}
