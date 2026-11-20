import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/i18n";
import { translate } from "@/lib/seo";
import { JsonLd, breadcrumbLd, itemListLd } from "@/lib/jsonld";
import { seoFill, seoSection, seoUi } from "@/lib/seo-content";
import { categoryLinks, siteLinks } from "@/lib/seo-links";
import { getProviders, getTopGames } from "@/lib/server-data";
import GameTiles from "@/components/Seo/GameTiles";
import SeoArticle from "@/components/Seo/SeoArticle";

/** "2026-11" → "November 2026" in the page language. */
export function monthLabel(lang: Locale, month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Intl.DateTimeFormat(lang, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

/**
 * Monthly "most played" ranking built from real bets. Used by the hub
 * (/best-slots = latest month) and the archive pages (/best-slots/2026-10).
 */
export default async function TopGamesPage({
  lang,
  month,
  months,
  path,
}: {
  lang: Locale;
  month: string;
  months: string[];
  path: string;
}) {
  const copy = seoSection(lang, "top");
  const label = monthLabel(lang, month);
  const [slots, live, providers] = await Promise.all([
    getTopGames(month, "SLOT", 24),
    getTopGames(month, "LIVECASINO", 12),
    getProviders(),
  ]);
  const slotGames = slots?.games ?? [];
  const liveGames = live?.games ?? [];
  const isFinal = slots?.isFinal ?? true;
  const title = seoFill(copy.title, { month: label });
  const blogCopy = seoSection(lang, "blog");

  return (
    <div className="w-full px-4 pb-4 pt-6 md:px-8">
      <JsonLd
        data={[
          breadcrumbLd(lang, [
            { name: translate(lang, "Seo.home"), path: routes.home() },
            { name: seoUi(lang, "best_slots_link"), path: routes.bestSlots() },
            ...(path !== routes.bestSlots() ? [{ name: title, path }] : []),
          ]),
          ...(slotGames.length
            ? [itemListLd(lang, title, slotGames.map((g) => ({ name: g.name.trim(), path: routes.game(g.id, g.name.trim()), image: g.img_custom || g.img || undefined })))]
            : []),
        ]}
      />

      <header className="border-b border-[var(--background-secondary)] pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#ffd76a]">{copy.kicker}</p>
        <h1 className="mt-2 text-[28px] font-extrabold leading-tight text-white md:text-[40px]">{title}</h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--text-muted-color)]">
          {seoFill(isFinal ? copy.intro_final : copy.intro_live, { month: label })}
        </p>
        <span
          className={`mt-4 inline-block rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wider ${
            isFinal ? "bg-white/10 text-white" : "bg-[#3ddc97]/15 text-[#3ddc97]"
          }`}
        >
          {isFinal ? copy.final_badge : copy.latest_badge}
        </span>
      </header>

      {slotGames.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-[var(--text-muted-color)]">{copy.empty}</p>
      ) : (
        <section className="mt-6">
          <h2 className="mb-4 text-[20px] font-bold text-white md:text-[22px]">
            {seoFill(copy.slots_title, { count: slotGames.length, month: label })}
          </h2>
          <GameTiles games={slotGames} providers={providers} ranked playLabel={blogCopy.play} />
        </section>
      )}

      {liveGames.length >= 3 && (
        <section className="mt-10">
          <h2 className="mb-4 text-[20px] font-bold text-white md:text-[22px]">{seoFill(copy.live_title, { month: label })}</h2>
          <GameTiles games={liveGames} providers={providers} ranked playLabel={blogCopy.play} />
        </section>
      )}

      {months.length > 1 && (
        <nav aria-label={copy.archive_title} className="mt-10">
          <h2 className="mb-3 text-[18px] font-bold text-white">{copy.archive_title}</h2>
          <ul className="flex flex-wrap gap-2">
            {months.map((m) => (
              <li key={m}>
                <Link
                  href={m === months[0] ? routes.bestSlots() : routes.bestSlots(m)}
                  prefetch={false}
                  aria-current={m === month ? "page" : undefined}
                  className={`inline-block rounded-full border px-4 py-1.5 text-[13px] font-semibold capitalize transition-colors ${
                    m === month
                      ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-white"
                      : "border-[var(--background-secondary)] text-[var(--text-muted-color)] hover:text-white"
                  }`}
                >
                  {monthLabel(lang, m)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <SeoArticle
        lang={lang}
        article={{
          title: seoUi(lang, "faq_title"),
          sections: [],
          faq: copy.faq.map((f) => ({ q: seoFill(f.q, { month: label }), a: seoFill(f.a, { month: label }) })),
        }}
        links={[categoryLinks(lang, "casino"), siteLinks(lang)]}
        faqHeading={false}
        className="mx-0 md:mx-0"
      />
    </div>
  );
}
