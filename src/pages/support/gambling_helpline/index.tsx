/** GamblingHelplinePage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Bigger font sizing + simpler content
 * Brand name is a variable: BRAND_NAME
 */
import { FunctionalComponent, h } from "preact";
import { useMemo } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { capitalize } from "@/helpers/capitalize";

export const BRAND_NAME = capitalize(import.meta.env.VITE_SITE_NAME);

type Helpline = {
  regionKey: string;
  nameKey: string;
  phone?: string;
  textKey?: string;
  websiteLabelKey: string;
  websiteHref: string;
  hoursKey: string;
};

const GamblingHelplinePage: FunctionalComponent = () => {
  const t = useTranslations("GamblingHelpline");

  const helplines = useMemo<Helpline[]>(
    () => [
      {
        regionKey: "region_us",
        nameKey: "name_ncpg",
        phone: "1-800-GAMBLER",
        textKey: "text_800gam",
        websiteLabelKey: "VisitHelpSite",
        websiteHref: "https://www.ncpgambling.org/help-treatment/",
        hoursKey: "hours_us",
      },
      {
        regionKey: "region_uk",
        nameKey: "name_gamcare",
        phone: "0808 8020 133",
        websiteLabelKey: "VisitHelpSite",
        websiteHref: "https://www.gamcare.org.uk/",
        hoursKey: "hours_uk",
      },
      {
        regionKey: "region_ca",
        nameKey: "name_ca_provincial",
        websiteLabelKey: "FindProvincialResources",
        websiteHref: "https://www.problemgambling.ca/",
        hoursKey: "hours_ca",
      },
      {
        regionKey: "region_au",
        nameKey: "name_au",
        phone: "1800 858 858",
        websiteLabelKey: "VisitHelpSite",
        websiteHref: "https://www.gamblinghelponline.org.au/",
        hoursKey: "hours_au",
      },
      {
        regionKey: "region_nz",
        nameKey: "name_nz",
        phone: "0800 654 655",
        websiteLabelKey: "VisitHelpSite",
        websiteHref: "https://gamblinghelpline.co.nz/",
        hoursKey: "hours_nz",
      },
      {
        regionKey: "region_intl",
        nameKey: "name_find_local",
        websiteLabelKey: "SearchInternationalResources",
        websiteHref: "https://www.gamblersanonymous.org/",
        hoursKey: "hours_intl",
      },
    ],
    []
  );

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      {/* background glow */}
      <div class="pointer-events-none fixed inset-0 -z-10">
        <div class="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />
        <div class="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* header */}
      <header class="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div class="mx-auto max-w-6xl px-4 py-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 text-zinc-950 text-xl font-black shadow-lg shadow-violet-500/10">
                ☎
              </div>
              <div>
                <div class="text-base font-extrabold tracking-wide">
                  {t("Title")}
                </div>
                <div class="text-sm text-zinc-400">
                  {t("Subtitle")}{" "}
                  <span class="font-semibold text-zinc-200">{BRAND_NAME}</span>{" "}
                  {t("Players")}
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <a
                href="/responsible-gaming"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("ResponsibleGaming")}
              </a>
              <a
                href="/support/help-center"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("HelpCenter")}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 pb-12">
        {/* hero */}
        <section class="py-7">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/35 p-6 shadow-2xl shadow-black/40">
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("NeedHelpTitle")}
            </h1>
            <p class="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              {t("NeedHelpDesc")}
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <a
                href="#list"
                class="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-base font-extrabold text-zinc-950 hover:brightness-110"
              >
                {t("ViewHelplines")}
              </a>
              <a
                href="/responsible-gaming"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-5 py-3 text-base font-extrabold hover:bg-zinc-900/70"
              >
                {t("SaferPlayTools")}
              </a>
            </div>

            <div class="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
              <div class="text-base font-extrabold text-rose-200/90">
                {t("Emergency")}
              </div>
              <div class="mt-1 text-sm leading-relaxed text-rose-200/80">
                {t("EmergencyText")}
              </div>
            </div>
          </div>
        </section>

        {/* list */}
        <section id="list" class="py-3">
          <div class="mb-3">
            <h2 class="text-xl font-extrabold tracking-wide">
              {t("HelplinesByRegion")}
            </h2>
            <p class="mt-1 text-base leading-relaxed text-zinc-300">
              {t("HelplinesByRegionDesc")}
            </p>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            {helplines.map((hLine) => (
              <div
                key={`${hLine.regionKey}-${hLine.nameKey}`}
                class="rounded-3xl border border-white/10 bg-zinc-900/35 p-5"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-sm font-extrabold text-zinc-400">
                      {t(hLine.regionKey)}
                    </div>
                    <div class="mt-1 text-lg font-extrabold">
                      {t(hLine.nameKey)}
                    </div>
                  </div>
                  <span class="rounded-full border border-white/10 bg-zinc-950/20 px-3 py-1 text-xs text-zinc-400">
                    {t("Confidential")}
                  </span>
                </div>

                <div class="mt-4 space-y-2 text-base text-zinc-200">
                  {hLine.phone ? (
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-zinc-400">{t("Phone")}</span>
                      <a
                        class="font-extrabold hover:underline"
                        href={`tel:${normalizeTel(hLine.phone)}`}
                      >
                        {hLine.phone}
                      </a>
                    </div>
                  ) : null}

                  {hLine.textKey ? (
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-zinc-400">{t("Text")}</span>
                      <span class="font-semibold">{t(hLine.textKey)}</span>
                    </div>
                  ) : null}

                  {hLine.hoursKey ? (
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-zinc-400">{t("Hours")}</span>
                      <span class="font-semibold">{t(hLine.hoursKey)}</span>
                    </div>
                  ) : null}
                </div>

                {hLine.websiteHref ? (
                  <a
                    class="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-base font-extrabold text-zinc-950 hover:brightness-110"
                    href={hLine.websiteHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(hLine.websiteLabelKey)}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* simple steps */}
        <section class="py-8">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/55 to-zinc-900/25 p-6">
            <h2 class="text-xl font-extrabold tracking-wide">
              {t("ThreeQuickSteps")}
            </h2>

            <div class="mt-4 grid gap-3 md:grid-cols-3">
              <StepCard
                num="1"
                title={t("Step1Title")}
                text={t("Step1Text")}
              />
              <StepCard
                num="2"
                title={t("Step2Title")}
                text={t("Step2Text")}
              />
              <StepCard
                num="3"
                title={t("Step3Title")}
                text={t("Step3Text")}
              />
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <a
                href="/responsible-gaming"
                class="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-base font-extrabold text-zinc-950 hover:brightness-110"
              >
                {t("OpenSaferPlayTools")}
              </a>
              <a
                href="/help"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-5 py-3 text-base font-extrabold hover:bg-zinc-900/70"
              >
                {t("ContactSupport")}
              </a>
            </div>

            <div class="mt-4 text-sm text-zinc-400">{t("Tip")}</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GamblingHelplinePage;

/* ---------------- helpers ---------------- */

const StepCard = ({
  num,
  title,
  text,
}: {
  num: string;
  title: string;
  text: string;
}) => (
  <div class="rounded-3xl border border-white/10 bg-zinc-950/20 p-5">
    <div class="flex items-center gap-3">
      <div class="grid h-10 w-10 place-items-center rounded-2xl bg-violet-500 text-zinc-950 text-lg font-black">
        {num}
      </div>
      <div class="text-lg font-extrabold">{title}</div>
    </div>
    <div class="mt-3 text-base leading-relaxed text-zinc-300">{text}</div>
  </div>
);

function normalizeTel(input: string): string {
  const trimmed = input.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  const digits = trimmed.replace(/[^\d]/g, "");
  return plus + digits;
}
