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
import tr from "@/assets/i18n/tr.json";
import mn from "@/assets/i18n/mn.json";
import pt from "@/assets/i18n/pt.json";
import es from "@/assets/i18n/es.json";

export { SITE_NAME } from "@/config/site";
import { SITE_NAME } from "@/config/site";
const DEFAULT_OG_IMAGE = "/og.png";

const DICTIONARIES: Record<Locale, Record<string, any>> = { ar, en, de, fr, ru, tr, mn, pt, es };

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
  /** Languages the page exists in (hreflang); defaults to every locale */
  languages?: Locale[];
  /** With noindex: still let crawlers follow the page's links (paginated lists) */
  follow?: boolean;
  /** Canonical locale-less path when it differs from `path` */
  canonicalPath?: string;
  /** Article pages: Open Graph type "article" with dates */
  article?: { publishedTime?: string; modifiedTime?: string; section?: string };
};

export function buildMetadata({
  lang,
  path,
  title,
  description,
  noindex,
  image,
  absoluteTitle,
  languages: available,
  follow,
  canonicalPath,
  article,
}: SeoInput): Metadata {
  const clean = path === "/" ? "" : path;
  const canonical = canonicalPath === undefined ? clean : canonicalPath === "/" ? "" : canonicalPath;
  const locales = available?.length ? LOCALES.filter((l) => available.includes(l)) : LOCALES;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[LOCALE_HREFLANG[l]] = `/${l}${canonical}`;
  const xDefault = locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales.includes("en") ? "en" : locales[0];
  if (xDefault) languages["x-default"] = `/${xDefault}${canonical}`;

  const desc = description ?? translate(lang, "Seo.site_description");
  // Pages without their own artwork share the branded default (app/og.png/route.tsx)
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: noindex ? undefined : { canonical: `/${lang}${canonical}`, languages },
    robots: noindex ? { index: false, follow: !!follow } : { index: true, follow: true },
    openGraph: {
      ...(article
        ? {
            type: "article" as const,
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            section: article.section,
          }
        : { type: "website" as const }),
      siteName: SITE_NAME,
      title,
      description: desc,
      url: `/${lang}${canonical}`,
      locale: OG_LOCALE[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
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
