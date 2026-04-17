/** LawEnforcementRequestPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 */
import { FunctionalComponent, h } from "preact";
import { useMemo } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { capitalize } from "@/helpers/capitalize";

export const BRAND_NAME = capitalize(import.meta.env.VITE_SITE_NAME);

type SectionConfig = {
  titleKey: string;
  bodyKey: string;
  bulletKeys?: string[];
};

const LawEnforcementRequestPage: FunctionalComponent = () => {
  const t = useTranslations("LawEnforcement");

  const sections = useMemo<SectionConfig[]>(
    () => [
      {
        titleKey: "OverviewTitle",
        bodyKey: "OverviewBody",
      },
      {
        titleKey: "WhereToSendTitle",
        bodyKey: "WhereToSendBody",
        bulletKeys: ["WhereToSendBullet1", "WhereToSendBullet2", "WhereToSendBullet3"],
      },
      {
        titleKey: "WhatToIncludeTitle",
        bodyKey: "WhatToIncludeBody",
        bulletKeys: [
          "WhatToIncludeBullet1",
          "WhatToIncludeBullet2",
          "WhatToIncludeBullet3",
          "WhatToIncludeBullet4",
          "WhatToIncludeBullet5",
        ],
      },
      {
        titleKey: "TypesOfDataTitle",
        bodyKey: "TypesOfDataBody",
        bulletKeys: [
          "TypesOfDataBullet1",
          "TypesOfDataBullet2",
          "TypesOfDataBullet3",
          "TypesOfDataBullet4",
          "TypesOfDataBullet5",
        ],
      },
      {
        titleKey: "EmergencyRequestsTitle",
        bodyKey: "EmergencyRequestsBody",
        bulletKeys: [
          "EmergencyRequestsBullet1",
          "EmergencyRequestsBullet2",
          "EmergencyRequestsBullet3",
        ],
      },
      {
        titleKey: "InternationalRequestsTitle",
        bodyKey: "InternationalRequestsBody",
      },
      {
        titleKey: "ResponseProcessTitle",
        bodyKey: "ResponseProcessBody",
        bulletKeys: [
          "ResponseProcessBullet1",
          "ResponseProcessBullet2",
          "ResponseProcessBullet3",
          "ResponseProcessBullet4",
        ],
      },
      {
        titleKey: "PreservationRequestsTitle",
        bodyKey: "PreservationRequestsBody",
        bulletKeys: [
          "PreservationRequestsBullet1",
          "PreservationRequestsBullet2",
          "PreservationRequestsBullet3",
        ],
      },
      {
        titleKey: "CostFormatTimingTitle",
        bodyKey: "CostFormatTimingBody",
      },
      {
        titleKey: "ImportantNotesTitle",
        bodyKey: "ImportantNotesBody",
        bulletKeys: [
          "ImportantNotesBullet1",
          "ImportantNotesBullet2",
          "ImportantNotesBullet3",
        ],
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
                ⚖️
              </div>
              <div>
                <div class="text-base font-extrabold tracking-wide">
                  {t("Title")}
                </div>
                <div class="text-sm text-zinc-400">
                  {t("Subtitle")}{" "}
                  <span class="font-semibold text-zinc-200">{BRAND_NAME}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <a
                href="/privacy"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("Privacy")}
              </a>
              <a
                href="/help"
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
              {t("RequestingTitle")}
            </h1>
            <p class="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              {t("RequestingDesc")}
            </p>

            <div class="mt-5 grid gap-3 md:grid-cols-3">
              <QuickCard
                title={t("BeSpecificTitle")}
                text={t("BeSpecificText")}
              />
              <QuickCard
                title={t("UseOfficialChannelsTitle")}
                text={t("UseOfficialChannelsText")}
              />
              <QuickCard
                title={t("EmergencyHelpTitle")}
                text={t("EmergencyHelpText")}
              />
            </div>
          </div>
        </section>

        {/* content */}
        <section class="grid gap-3">
          {sections.map((s) => (
            <article
              key={s.titleKey}
              class="rounded-3xl border border-white/10 bg-zinc-900/35 p-6"
            >
              <h2 class="text-xl font-extrabold tracking-wide">
                {t(s.titleKey)}
              </h2>
              <p class="mt-2 text-base leading-relaxed text-zinc-300">
                {s.bodyKey === "OverviewBody" || s.bodyKey === "ImportantNotesBody"
                  ? t(s.bodyKey, { brand: BRAND_NAME })
                  : t(s.bodyKey)}
              </p>

              {s.bulletKeys?.length ? (
                <ul class="mt-4 space-y-2 text-base text-zinc-200">
                  {s.bulletKeys.map((key) => (
                    <li key={key} class="flex gap-3">
                      <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400/40" />
                      <span class="leading-relaxed">{t(key)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        {/* disclaimer */}
        <section class="mt-6">
          <div class="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <div class="text-base font-extrabold text-amber-200/90">
              {t("DisclaimerTitle")}
            </div>
            <div class="mt-2 text-sm leading-relaxed text-amber-200/80">
              {t("DisclaimerBody")}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LawEnforcementRequestPage;

/* ---------------- small components ---------------- */

const QuickCard = ({ title, text }: { title: string; text: string }) => (
  <div class="rounded-3xl border border-white/10 bg-zinc-950/15 p-5">
    <div class="text-lg font-extrabold">{title}</div>
    <div class="mt-2 text-sm leading-relaxed text-zinc-300">{text}</div>
  </div>
);
