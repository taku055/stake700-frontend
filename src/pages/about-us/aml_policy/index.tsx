/** AMLPolicyPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 *
 * NOTE: Replace placeholders (company name/entity, contact emails, jurisdictions, retention periods)
 * with your real details and have counsel/MLRO review before publishing.
 */
import { FunctionalComponent, h } from "preact";
import { useTranslations } from "@/context/I18nContext";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { capitalize } from "@/helpers/capitalize";

export const BRAND_NAME = capitalize(import.meta.env.VITE_SITE_NAME);

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
      class="min-h-screen bg-zinc-950 text-zinc-100 text-start"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* background glow */}
      <div class="pointer-events-none fixed inset-0 -z-10">
        <div class="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />
        <div class="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* header */}
      <header class="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div class="mx-auto max-w-6xl px-4 py-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:text-start">
            <div class="flex items-center gap-3">
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 text-zinc-950 text-xl font-black shadow-lg shadow-violet-500/10">
                🧾
              </div>
              <div>
                <div class="text-base font-extrabold tracking-wide">
                  {t("header_title")}
                </div>
                <div class="text-sm text-zinc-400">
                  {t("header_subtitle", { brand: BRAND_NAME })}
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <a
                href="/terms"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("nav_terms")}
              </a>
              <a
                href="/privacy"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("nav_privacy")}
              </a>
              <a
                href="/law-enforcement-request"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("nav_law_enforcement")}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 pb-12 text-start">
        {/* hero */}
        <section class="py-7">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/35 p-6 shadow-2xl shadow-black/40">
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("hero_title")}
            </h1>
            <p class="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              {t("hero_lead")}
            </p>

            <div class="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div class="text-base font-extrabold text-amber-200/90">
                {t("important_title")}
              </div>
              <div class="mt-1 text-sm leading-relaxed text-amber-200/80">
                {t("important_body")}
              </div>
            </div>
          </div>
        </section>

        {/* sections */}
        <section class="grid gap-3">
          {SECTION_DEFS.map((s) => (
            <article
              key={s.key}
              class="rounded-3xl border border-white/10 bg-zinc-900/35 p-6"
            >
              <h2 class="text-xl font-extrabold tracking-wide">
                {t(`${s.key}_title`)}
              </h2>
              <p class="mt-2 text-base leading-relaxed text-zinc-300">
                {t(`${s.key}_body`, { brand: BRAND_NAME })}
              </p>

              {s.bulletCount > 0 ? (
                <ul class="mt-4 space-y-2 text-base text-zinc-200">
                  {Array.from({ length: s.bulletCount }, (_, i) => {
                    const n = i + 1;
                    return (
                      <li key={n} class="flex gap-3 items-start">
                        <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400/40" />
                        <span class="min-w-0 flex-1 leading-relaxed">
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
        <section class="mt-6">
          <div class="rounded-3xl border border-white/10 bg-zinc-900/35 p-6">
            <div class="text-xl font-extrabold tracking-wide">
              {t("footer_block_title")}
            </div>
            <div class="mt-2 text-base leading-relaxed text-zinc-300">
              {t("footer_compliance_label")}{" "}
              <span class="font-extrabold text-zinc-100">
                compliance@betalarab.com
              </span>
            </div>
            <div class="mt-1 text-base leading-relaxed text-zinc-300">
              {t("footer_mlro_label")}{" "}
              <span class="font-extrabold text-zinc-100">mlro@betalarab.com</span>
            </div>
            <div class="mt-1 text-sm text-zinc-400">{t("footer_tip")}</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AMLPolicyPage;
