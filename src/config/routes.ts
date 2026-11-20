/**
 * Every internal URL is built here. Paths are locale-less ("/casino/new");
 * <Link> and useLocation().route() add the active locale prefix automatically.
 */
import { slugify, type CatalogSection } from "./catalog";

const GAME_ID = /^[0-9a-f]{40}$/i;

export const routes = {
  home: () => "/",

  casino: () => "/casino",
  casinoAll: () => "/casino/games",
  liveCasino: () => "/live-casino",
  liveCasinoAll: () => "/live-casino/games",

  section: (section: CatalogSection) => (section === "casino" ? "/casino" : "/live-casino"),
  sectionAll: (section: CatalogSection) => `${routes.section(section)}/games`,
  category: (section: CatalogSection, slug: string) => `${routes.section(section)}/${slug}`,

  providers: () => "/providers",
  provider: (slugOrId: string) => `/providers/${encodeURIComponent(slugOrId)}`,

  /** "/game/sweet-bonanza-<id>" when the name is known, "/game/<id>" otherwise */
  game: (id: string, name?: string) => {
    const slug = name && GAME_ID.test(id) ? slugify(name) : "";
    return `/game/${slug ? `${slug}-${id}` : encodeURIComponent(id)}`;
  },
  favorites: () => "/favorites",
  promotions: () => "/promotions",
  promotion: (id: string) => `/promotions/${encodeURIComponent(id)}`,
  promotionTerms: (anchor?: string) => `/promotions/terms${anchor ? `#${anchor}` : ""}`,
  /** One page per live offer: "/promotions/offer/sunday50" */
  promotionOffer: (code: string) => `/promotions/offer/${encodeURIComponent(code.toLowerCase())}`,

  blog: (opts: { category?: string; page?: number } = {}) => {
    const q = new URLSearchParams();
    if (opts.category) q.set("category", opts.category.toLowerCase());
    if (opts.page && opts.page > 1) q.set("page", String(opts.page));
    const qs = q.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  },
  blogPost: (slug: string) => `/blog/${encodeURIComponent(slug)}`,
  /** Most played games: latest month at "/best-slots", archive at "/best-slots/2026-10" */
  bestSlots: (month?: string) => (month ? `/best-slots/${month}` : "/best-slots"),
  vip: () => "/vip",

  sports: () => "/sports",
  racing: (kind?: "greyhound" | "harness") => (kind ? `/sports/racing/${kind}` : "/sports/racing"),

  myBets: (tab: "casino" | "sports" = "casino") => `/my-bets/${tab}`,
  affiliate: (tab?: string) => (tab ? `/affiliate/${tab}` : "/affiliate"),

  provablyFair: (tab?: string) => (tab ? `/provably-fair/${tab}` : "/provably-fair"),
  faq: () => "/faq",
  contactUs: () => "/contact-us",
  helpCenter: () => "/support/help-center",
  responsibleGambling: () => "/support/responsible-gambling",
  gamblingHelpline: () => "/support/gambling-helpline",
  selfExclusion: () => "/support/self-exclusion",
  lawEnforcement: () => "/support/law-enforcement-request",
  privacyPolicy: () => "/privacy-policy",
  amlPolicy: () => "/about-us/aml-policy",
  otherRules: () => "/other-rules",

  agent: (sub = "") => `/agent${sub}`,
  superagent: (sub = "") => `/superagent${sub}`,
  areaManager: (sub = "") => `/area_manager${sub}`,
} as const;

/** Parses the [id] segment of /game/[id]: "sweet-bonanza-<40 hex>" or a bare id. */
export function parseGameParam(param: string): { id: string; slug: string | null } {
  const value = decodeURIComponent(param);
  const match = value.match(/^(.*)-([0-9a-f]{40})$/i);
  return match ? { id: match[2], slug: match[1] } : { id: value, slug: null };
}
