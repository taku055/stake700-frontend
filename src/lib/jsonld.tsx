import type { Locale } from "@/config/i18n";
import { SITE_NAME, siteUrl } from "@/lib/seo";

/**
 * schema.org structured data (JSON-LD) for rich search results.
 * Server-only helpers: render <JsonLd data={...} /> inside a page or layout.
 */

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe once "<" is escaped (prevents </script> breakouts)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function absoluteUrl(lang: Locale, path: string): string {
  return new URL(`/${lang}${path === "/" ? "" : path}`, siteUrl()).toString();
}

const LOGO = `https://tekio.s3.eu-north-1.amazonaws.com/${SITE_NAME.toLowerCase()}/logo.png`;

export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl().origin}/#organization`,
    name: SITE_NAME,
    url: siteUrl().origin,
    logo: LOGO,
  };
}

export function websiteLd(lang: Locale, description: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl().origin}/#website`,
    name: SITE_NAME,
    url: absoluteUrl(lang, "/"),
    inLanguage: lang,
    description,
    publisher: { "@id": `${siteUrl().origin}/#organization` },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(lang: Locale, crumbs: Crumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(lang, c.path),
    })),
  };
}

export function itemListLd(lang: Locale, name: string, items: { name: string; path: string; image?: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(lang, it.path),
      name: it.name,
      ...(it.image ? { image: it.image } : {}),
    })),
  };
}

export function gameLd(
  lang: Locale,
  game: { name: string; path: string; image?: string; description: string; provider?: string; genre?: string },
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.name,
    url: absoluteUrl(lang, game.path),
    description: game.description,
    inLanguage: lang,
    gamePlatform: ["Web browser", "Mobile"],
    applicationCategory: "Game",
    ...(game.image ? { image: game.image } : {}),
    ...(game.genre ? { genre: game.genre } : {}),
    ...(game.provider ? { publisher: { "@type": "Organization", name: game.provider } } : {}),
  };
}

export function faqLd(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}
