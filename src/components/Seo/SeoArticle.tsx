import { Link } from "@/components/common/Link";
import type { Locale } from "@/config/i18n";
import { JsonLd, faqLd } from "@/lib/jsonld";
import { seoUi, type SeoArticleData } from "@/lib/seo-content";
import SeoCollapse from "./SeoCollapse";

export type SeoLinkGroup = { title: string; items: { name: string; path: string }[] };

/**
 * Server-rendered descriptive copy shown below a page's main content:
 * heading, intro, collapsible sections, internal link groups and an FAQ
 * (with FAQPage structured data). Gives search engines real text to rank.
 */
export default function SeoArticle({
  lang,
  article,
  links = [],
  headingLevel = 2,
  className = "",
  faqHeading = true,
}: {
  lang: Locale;
  article: SeoArticleData;
  links?: SeoLinkGroup[];
  /** Use 1 on pages that have no other H1 (e.g. the sportsbook). */
  headingLevel?: 1 | 2;
  /** Horizontal margin classes; defaults to the catalog page gutter. */
  className?: string;
  /** Show the "Frequently asked questions" sub-heading (off when it is the article title). */
  faqHeading?: boolean;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const groups = links.filter((g) => g.items.length > 0);
  return (
    <section
      className={`mb-8 mt-6 rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-5 md:p-7 ${className || "mx-2 md:mx-3"}`}
    >
      <Heading className="text-[20px] font-bold leading-tight text-white md:text-[24px]">{article.title}</Heading>
      {article.intro && (
        <p className="mt-3 max-w-4xl text-[14px] leading-relaxed text-[var(--text-muted-color)]">{article.intro}</p>
      )}

      {article.sections.length > 0 && (
        <div className="mt-4">
          <SeoCollapse moreLabel={seoUi(lang, "read_more")} lessLabel={seoUi(lang, "show_less")}>
            <div className="flex max-w-4xl flex-col gap-4">
              {article.sections.map((s) => (
                <div key={s.h}>
                  <h3 className="text-[16px] font-semibold text-white">{s.h}</h3>
                  {s.p.map((p, i) => (
                    <p key={i} className="mt-1.5 text-[14px] leading-relaxed text-[var(--text-muted-color)]">
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </SeoCollapse>
        </div>
      )}

      {groups.map((g) => (
        <nav key={g.title} aria-label={g.title} className="mt-6">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--background-tertiary)]">{g.title}</h3>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {g.items.map((it) => (
              <li key={it.path}>
                <Link
                  href={it.path}
                  prefetch={false}
                  className="inline-block rounded-full border border-[var(--background-secondary)] px-3 py-1.5 text-[13px] text-white transition-colors hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
                >
                  {it.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}

      {article.faq.length > 0 && (
        <div className={groups.length || article.sections.length || article.intro ? "mt-7" : "mt-4"}>
          {faqHeading && <h3 className="text-[16px] font-semibold text-white">{seoUi(lang, "faq_title")}</h3>}
          <div className="mt-3 flex flex-col divide-y divide-[var(--background-secondary)] rounded-xl border border-[var(--background-secondary)]">
            {article.faq.map((f) => (
              <details key={f.q} className="group px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-white">
                  {f.q}
                  <span aria-hidden className="text-[var(--text-muted-color)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-muted-color)]">{f.a}</p>
              </details>
            ))}
          </div>
          <JsonLd data={faqLd(article.faq.map((f) => ({ question: f.q, answer: f.a })))} />
        </div>
      )}
    </section>
  );
}
