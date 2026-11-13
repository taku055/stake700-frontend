/** AMLPolicyPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 *
 * NOTE: Replace placeholders (company name/entity, contact emails, jurisdictions, retention periods)
 * with your real details and have counsel/MLRO review before publishing.
 */
import { type FC as FunctionalComponent, createElement as h } from "react";
import { useTranslations } from "@/context/I18nContext";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { capitalize } from "@/helpers/capitalize";
import { getRootDomain } from "@/helpers/getRootDomain";

export const BRAND_NAME = capitalize(process.env.NEXT_PUBLIC_SITE_NAME);

type SectionDef = { key: string; bulletCount: number };

const SECTION_DEFS: SectionDef[] = [
  { key: "purpose", bulletCount: 0 },
  { key: "scope", bulletCount: 0 },
  { key: "approach", bulletCount: 4 },
  { key: "cdd", bulletCount: 4 },
  { key: "edd", bulletCount: 3 },
  { key: "prohibited", bulletCount: 5 },
  { key: "monitoring", bulletCount: 4 },
  { key: "sanctions", bulletCount: 3 },
  { key: "reporting", bulletCount: 0 },
  { key: "account_actions", bulletCount: 5 },
  { key: "recordkeeping", bulletCount: 4 },
  { key: "user_resp", bulletCount: 4 },
  { key: "contact", bulletCount: 2 },
];

const AMLPolicyPage: FunctionalComponent = () => {
  const t = useTranslations("AMLPolicy");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100 text-start"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* header */}
      <header className="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:text-start">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 text-zinc-950 text-xl font-black shadow-lg shadow-violet-500/10">
                🧾
              </div>
              <div>
                <div className="text-base font-extrabold tracking-wide">
                  {t("header_title")}
                </div>
                <div className="text-sm text-zinc-400">
                  {t("header_subtitle", { brand: BRAND_NAME })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/terms"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("nav_terms")}
              </a>
              <a
                href="/privacy"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("nav_privacy")}
              </a>
              <a
                href="/law-enforcement-request"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("nav_law_enforcement")}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 text-start">
        {/* hero */}
        <section className="py-7">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/35 p-6 shadow-2xl shadow-black/40">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("hero_title")}
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              {t("hero_lead")}
            </p>

            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="text-base font-extrabold text-amber-200/90">
                {t("important_title")}
              </div>
              <div className="mt-1 text-sm leading-relaxed text-amber-200/80">
                {t("important_body")}
              </div>
            </div>
          </div>
        </section>

        {/* sections */}
        <section className="grid gap-3">
          {SECTION_DEFS.map((s) => (
            <article
              key={s.key}
              className="rounded-3xl border border-white/10 bg-zinc-900/35 p-6"
            >
              <h2 className="text-xl font-extrabold tracking-wide">
                {t(`${s.key}_title`)}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-zinc-300">
                {t(`${s.key}_body`, { brand: BRAND_NAME })}
              </p>

              {s.bulletCount > 0 ? (
                <ul className="mt-4 space-y-2 text-base text-zinc-200">
                  {Array.from({ length: s.bulletCount }, (_, i) => {
                    const n = i + 1;
                    return (
                      <li key={n} className="flex gap-3 items-start">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400/40" />
                        <span className="min-w-0 flex-1 leading-relaxed">
                          {t(`${s.key}_bullet_${n}`)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        {/* contact block */}
        <section className="mt-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/35 p-6">
            <div className="text-xl font-extrabold tracking-wide">
              {t("footer_block_title")}
            </div>
            <div className="mt-2 text-base leading-relaxed text-zinc-300">
              {t("footer_compliance_label")}{" "}
              <span className="font-extrabold text-zinc-100">
                compliance@{getRootDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN)}
              </span>
            </div>
            <div className="mt-1 text-base leading-relaxed text-zinc-300">
              {t("footer_mlro_label")}{" "}
              <span className="font-extrabold text-zinc-100">mlro@{getRootDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN)}</span>
            </div>
            <div className="mt-1 text-sm text-zinc-400">{t("footer_tip")}</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AMLPolicyPage;
