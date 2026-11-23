import type { Locale } from "@/config/i18n";
import { SITE_NAME } from "@/lib/seo";
import { getGamesTotal, getProviders, type ProviderWithSlug } from "@/lib/server-data";
import en from "@/assets/seo/en.json";
import ar from "@/assets/seo/ar.json";
import de from "@/assets/seo/de.json";
import fr from "@/assets/seo/fr.json";
import ru from "@/assets/seo/ru.json";
import tr from "@/assets/seo/tr.json";
import mn from "@/assets/seo/mn.json";
import pt from "@/assets/seo/pt.json";
import es from "@/assets/seo/es.json";

/**
 * Long-form, crawlable page copy (intro, sections, FAQ) per locale.
 * Server-only: these files are imported here and never by client components,
 * so they stay out of the browser bundle.
 */

type Section = { h: string; p: string[] };
type Faq = { q: string; a: string };
type RawArticle = { title?: string; intro?: string; sections?: Section[]; faq?: Faq[] };
type Content = typeof en;

const CONTENT: Record<Locale, Content> = {
  en,
  ar: ar as Content,
  de: de as Content,
  fr: fr as Content,
  ru: ru as Content,
  tr: tr as Content,
  mn: mn as Content,
  pt: pt as Content,
  es: es as Content,
};

export type SeoArticleData = { title: string; intro?: string; sections: Section[]; faq: Faq[] };
export type Vars = Record<string, string | number>;

export type PageKey = keyof Content["pages"];

function fill(text: string, vars: Vars): string {
  let out = text;
  for (const [k, v] of Object.entries({ site: SITE_NAME, ...vars })) out = out.split(`{${k}}`).join(String(v));
  return out;
}

function fillArticle(raw: RawArticle, vars: Vars, fallbackTitle = ""): SeoArticleData {
  return {
    title: fill(raw.title ?? fallbackTitle, vars),
    intro: raw.intro ? fill(raw.intro, vars) : undefined,
    sections: (raw.sections ?? []).map((s) => ({ h: fill(s.h, vars), p: s.p.map((p) => fill(p, vars)) })),
    faq: (raw.faq ?? []).map((f) => ({ q: fill(f.q, vars), a: fill(f.a, vars) })),
  };
}

const content = (lang: Locale) => CONTENT[lang] ?? CONTENT.en;

export function seoUi(lang: Locale, key: keyof Content["ui"], vars: Vars = {}): string {
  return fill(content(lang).ui?.[key] ?? CONTENT.en.ui[key], vars);
}

type SectionKey = "blog" | "top" | "promo_page";

/** A copy section for a locale, falling back to English key by key. */
export function seoSection<K extends SectionKey>(lang: Locale, key: K): Content[K] {
  const local = (content(lang) as Partial<Content>)[key];
  return { ...CONTENT.en[key], ...(local ?? {}) } as Content[K];
}

/** Fills {placeholders} ({site} is always available). */
export function seoFill(text: string, vars: Vars = {}): string {
  return fill(text, vars);
}

/** Site-wide numbers used in copy: game total and provider count (non-sports). */
export async function siteVars(): Promise<Vars> {
  const [games, providers] = await Promise.all([getGamesTotal(), getProviders()]);
  const studios = providers.filter((p) => !p.gameType?.every((t) => t === "SPORT")).length;
  // Round down so "{games}+" stays true as the catalogue changes
  const rounded = games >= 1000 ? Math.floor(games / 100) * 100 : games >= 100 ? Math.floor(games / 10) * 10 : games;
  return { games: rounded.toLocaleString("en-US"), providers: studios || "50" };
}

export function pageArticle(lang: Locale, key: PageKey, vars: Vars): SeoArticleData {
  const raw = (content(lang).pages?.[key] ?? CONTENT.en.pages[key]) as RawArticle;
  return fillArticle(raw, vars);
}

export function categoryArticle(
  lang: Locale,
  section: string,
  slug: string,
  vars: Vars & { category: string; section: string },
): SeoArticleData {
  const c = content(lang);
  const id = `${section}:${slug}` as keyof Content["categories"];
  const intro = c.categories?.[id] ?? CONTENT.en.categories[id];
  const template = (c.category_template ?? CONTENT.en.category_template) as RawArticle;
  return fillArticle({ ...template, intro: intro ?? template.intro }, vars);
}

export function providerArticle(lang: Locale, vars: Vars & { provider: string; count: number | string }): SeoArticleData {
  const raw = (content(lang).provider_template ?? CONTENT.en.provider_template) as RawArticle;
  return fillArticle(raw, vars);
}

export function gameArticle(lang: Locale, vars: Vars & { game: string; provider: string }): SeoArticleData {
  const raw = (content(lang).game_template ?? CONTENT.en.game_template) as RawArticle;
  return fillArticle(raw, vars);
}

/** Providers with the most games, optionally limited to a game type. */
export function topProviders(
  providers: ProviderWithSlug[],
  type: "SLOT" | "LIVECASINO" | null,
  limit: number,
): ProviderWithSlug[] {
  return providers
    .filter((p) => !p.gameType?.every((t) => t === "SPORT"))
    .filter((p) => !type || p.gameType?.includes(type))
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    // Several feeds can share a studio name; link the biggest one once
    .filter((p, i, list) => list.findIndex((x) => x.name.trim().toLowerCase() === p.name.trim().toLowerCase()) === i)
    .slice(0, limit);
}
