import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import { isDepositPromoType } from "@/config/promoConstants";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";
import { seoFill, seoSection, seoUi } from "@/lib/seo-content";
import { findPublicPromotion, getGame, getPublicPromotions } from "@/lib/server-data";
import { offerHeadline } from "@/site/promotions/offerHeadline";
import type { Locale } from "@/config/i18n";
import type { tLedgerPromotion } from "@/types/tUserLedger";
import SeoArticle from "@/components/Seo/SeoArticle";
import OfferStage from "@/site/promotions/OfferStage";

type Props = { params: Promise<{ lang: string; code: string }> };

/** The reward line, unless the offer name already says it ("100 Free Spins on…"). */
function distinctHeadline(lang: Locale, promo: tLedgerPromotion): string | null {
  const headline = offerHeadline(lang, promo);
  return promo.name.toLowerCase().includes(headline.toLowerCase()) ? null : headline;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { code } = await params;
  const promo = await findPublicPromotion(code);
  if (!promo) return {};
  const copy = seoSection(lang, "promo_page");
  const vars = { name: promo.name, headline: distinctHeadline(lang, promo) ?? copy.kicker };
  return buildMetadata({
    lang,
    path: routes.promotionOffer(promo.code),
    title: seoFill(copy.meta_title, vars),
    description: seoFill(copy.meta_description, vars),
    image: promo.imageUrl || undefined,
  });
}

export default async function Page({ params }: Props) {
  const lang = await resolveLang(params);
  const { code } = await params;
  const promo = await findPublicPromotion(code);
  if (!promo) notFound();

  const copy = seoSection(lang, "promo_page");
  const [game, all] = await Promise.all([
    promo.freeSpinGameId ? getGame(promo.freeSpinGameId) : Promise.resolve(null),
    getPublicPromotions(),
  ]);
  const vars = { name: promo.name };
  const headline = distinctHeadline(lang, promo);
  const steps = isDepositPromoType(promo.type) ? copy.steps_deposit : copy.steps_other;
  const others = all.filter((p) => p.code !== promo.code);
  const path = routes.promotionOffer(promo.code);
  const promotionsName = translate(lang, "Seo.promotions_title");

  return (
    <div className="w-full px-4 pb-4 pt-6 md:px-8">
      <JsonLd
        data={breadcrumbLd(lang, [
          { name: translate(lang, "Seo.home"), path: routes.home() },
          { name: promotionsName, path: routes.promotions() },
          { name: promo.name, path },
        ])}
      />
      <header className="mb-6 border-b border-[var(--background-secondary)] pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#ffd76a]">{copy.kicker}</p>
        <h1 className="mt-2 text-[28px] font-extrabold leading-tight text-white md:text-[40px]">{promo.name}</h1>
        {headline && <p className="mt-2 text-[17px] font-semibold text-white/85">{headline}</p>}
        {promo.description && (
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[var(--text-muted-color)]">{promo.description}</p>
        )}
      </header>

      <OfferStage promo={promo} gameName={game?.name?.trim()} />

      <section className="mt-8 rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-5 md:p-7">
        <h2 className="text-[20px] font-bold text-white md:text-[22px]">{seoFill(copy.how_title, vars)}</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[var(--text-muted-color)]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-color)] text-[13px] font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{seoFill(step, vars)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 flex flex-wrap gap-4 text-[14px] font-semibold">
          <Link href={routes.promotionTerms()} className="text-[var(--primary-color)] hover:underline">
            {copy.full_terms}
          </Link>
          <Link href={routes.promotions()} className="text-[var(--primary-color)] hover:underline">
            {copy.all_offers}
          </Link>
        </p>
      </section>

      <SeoArticle
        lang={lang}
        article={{
          title: seoUi(lang, "faq_title"),
          sections: [],
          // The second answer is about free-spin winnings
          faq: copy.faq
            .filter((_, i) => i !== 1 || promo.freeSpins > 0)
            .map((f) => ({ q: seoFill(f.q, vars), a: seoFill(f.a, vars) })),
        }}
        links={[
          {
            title: copy.other_offers,
            items: others.map((p) => ({ name: p.name, path: routes.promotionOffer(p.code) })),
          },
        ]}
        faqHeading={false}
        className="mx-0 md:mx-0"
      />
    </div>
  );
}
