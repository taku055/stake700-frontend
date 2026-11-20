import type { MetadataRoute } from "next";
import { CATALOG } from "@/config/catalog";
import { routes } from "@/config/routes";
import { DEFAULT_LOCALE, LOCALES, LOCALE_HREFLANG } from "@/config/i18n";
import { getCustomCategoryCount, getProviders } from "@/lib/server-data";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

const STATIC: Entry[] = [
  { path: routes.home(), priority: 1, changeFrequency: "daily" },
  { path: routes.casino(), priority: 0.9, changeFrequency: "daily" },
  { path: routes.casinoAll(), priority: 0.8, changeFrequency: "daily" },
  { path: routes.liveCasino(), priority: 0.9, changeFrequency: "daily" },
  { path: routes.liveCasinoAll(), priority: 0.8, changeFrequency: "daily" },
  { path: routes.providers(), priority: 0.7, changeFrequency: "weekly" },
  { path: routes.promotions(), priority: 0.7, changeFrequency: "daily" },
  { path: routes.promotionTerms(), priority: 0.4, changeFrequency: "weekly" },
  { path: routes.vip(), priority: 0.6, changeFrequency: "monthly" },
  { path: routes.sports(), priority: 0.7, changeFrequency: "daily" },
  { path: routes.racing(), priority: 0.5, changeFrequency: "daily" },
  { path: routes.provablyFair(), priority: 0.4, changeFrequency: "yearly" },
  { path: routes.faq(), priority: 0.5, changeFrequency: "monthly" },
  { path: routes.contactUs(), priority: 0.4, changeFrequency: "yearly" },
  { path: routes.helpCenter(), priority: 0.4, changeFrequency: "monthly" },
  { path: routes.responsibleGambling(), priority: 0.4, changeFrequency: "yearly" },
  { path: routes.gamblingHelpline(), priority: 0.3, changeFrequency: "yearly" },
  { path: routes.selfExclusion(), priority: 0.3, changeFrequency: "yearly" },
  { path: routes.lawEnforcement(), priority: 0.2, changeFrequency: "yearly" },
  { path: routes.privacyPolicy(), priority: 0.3, changeFrequency: "yearly" },
  { path: routes.amlPolicy(), priority: 0.3, changeFrequency: "yearly" },
  { path: routes.otherRules(), priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const abs = (lang: string, path: string) => new URL(`/${lang}${path === "/" ? "" : path}`, base).toString();

  const providers = (await getProviders()).filter((p) => !p.gameType?.every((t) => t === "SPORT"));
  // Only list curated categories that actually contain games
  const categories = (
    await Promise.all(
      CATALOG.map(async (c) => (c.isCustom && (await getCustomCategoryCount(c.category)) === 0 ? null : c)),
    )
  ).filter((c): c is (typeof CATALOG)[number] => c !== null);

  const entries: Entry[] = [
    ...STATIC,
    ...categories.map((c) => ({
      path: routes.category(c.section, c.slug),
      priority: c.tab ? 0.8 : 0.6,
      changeFrequency: "daily" as const,
    })),
    ...providers.map((p) => ({ path: routes.provider(p.slug), priority: 0.6, changeFrequency: "weekly" as const })),
  ];

  const now = new Date();
  return entries.flatMap(({ path, priority, changeFrequency }) => {
    const languages: Record<string, string> = Object.fromEntries(
      LOCALES.map((l) => [LOCALE_HREFLANG[l], abs(l, path)]),
    );
    languages["x-default"] = abs(DEFAULT_LOCALE, path);
    return LOCALES.map((lang) => ({
      url: abs(lang, path),
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
