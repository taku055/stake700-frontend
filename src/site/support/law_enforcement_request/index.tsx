/** LawEnforcementRequestPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 */
import { type FC as FunctionalComponent, createElement as h } from "react";
import { useMemo } from "react";
import { useTranslations } from "@/context/I18nContext";
import { capitalize } from "@/helpers/capitalize";

export const BRAND_NAME = capitalize(process.env.NEXT_PUBLIC_SITE_NAME);

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* header */}
      <header className="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 text-zinc-950 text-xl font-black shadow-lg shadow-violet-500/10">
                ⚖️
              </div>
              <div>
                <div className="text-base font-extrabold tracking-wide">
                  {t("Title")}
                </div>
                <div className="text-sm text-zinc-400">
                  {t("Subtitle")}{" "}
                  <span className="font-semibold text-zinc-200">{BRAND_NAME}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/privacy"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("Privacy")}
              </a>
              <a
                href="/help"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("HelpCenter")}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {/* hero */}
        <section className="py-7">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/35 p-6 shadow-2xl shadow-black/40">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("RequestingTitle")}
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              {t("RequestingDesc")}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
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
        <section className="grid gap-3">
          {sections.map((s) => (
            <article
              key={s.titleKey}
              className="rounded-3xl border border-white/10 bg-zinc-900/35 p-6"
            >
              <h2 className="text-xl font-extrabold tracking-wide">
                {t(s.titleKey)}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-zinc-300">
                {s.bodyKey === "OverviewBody" || s.bodyKey === "ImportantNotesBody"
                  ? t(s.bodyKey, { brand: BRAND_NAME })
                  : t(s.bodyKey)}
              </p>

              {s.bulletKeys?.length ? (
                <ul className="mt-4 space-y-2 text-base text-zinc-200">
                  {s.bulletKeys.map((key) => (
                    <li key={key} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400/40" />
                      <span className="leading-relaxed">{t(key)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        {/* disclaimer */}
        <section className="mt-6">
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <div className="text-base font-extrabold text-amber-200/90">
              {t("DisclaimerTitle")}
            </div>
            <div className="mt-2 text-sm leading-relaxed text-amber-200/80">
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
  <div className="rounded-3xl border border-white/10 bg-zinc-950/15 p-5">
    <div className="text-lg font-extrabold">{title}</div>
    <div className="mt-2 text-sm leading-relaxed text-zinc-300">{text}</div>
  </div>
);
