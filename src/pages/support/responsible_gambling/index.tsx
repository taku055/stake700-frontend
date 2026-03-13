/** ResponsibleGamblingPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 */
import { FunctionalComponent, h } from "preact";
import { useMemo, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";

export const BRAND_NAME = "Betalarab";

type ToolConfig = {
  id: string;
  titleKey: string;
  descKey: string;
  pointKeys: string[];
  ctaLabelKey: string;
  onCta: () => void;
};

type FaqConfig = { qKey: string; aKey: string };

const ResponsibleGamblingPage: FunctionalComponent = () => {
  const t = useTranslations("ResponsibleGambling");
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const tools = useMemo<ToolConfig[]>(
    () => [
      {
        id: "deposit-limits",
        titleKey: "DepositLimitsTitle",
        descKey: "DepositLimitsDesc",
        pointKeys: ["DepositLimitsPoint1", "DepositLimitsPoint2", "DepositLimitsPoint3"],
        ctaLabelKey: "SetDepositLimits",
        onCta: () => alert("Open deposit limits settings…"),
      },
      {
        id: "loss-limits",
        titleKey: "LossLimitsTitle",
        descKey: "LossLimitsDesc",
        pointKeys: ["LossLimitsPoint1", "LossLimitsPoint2", "LossLimitsPoint3"],
        ctaLabelKey: "SetLossLimits",
        onCta: () => alert("Open loss limits settings…"),
      },
      {
        id: "session-timer",
        titleKey: "SessionTimerTitle",
        descKey: "SessionTimerDesc",
        pointKeys: ["SessionTimerPoint1", "SessionTimerPoint2", "SessionTimerPoint3"],
        ctaLabelKey: "EnableTimer",
        onCta: () => alert("Enable session timer…"),
      },
      {
        id: "cooling-off",
        titleKey: "CoolingOffTitle",
        descKey: "CoolingOffDesc",
        pointKeys: ["CoolingOffPoint1", "CoolingOffPoint2", "CoolingOffPoint3"],
        ctaLabelKey: "StartCoolingOff",
        onCta: () => alert("Start cooling-off period…"),
      },
      {
        id: "self-exclusion",
        titleKey: "SelfExclusionTitle",
        descKey: "SelfExclusionDesc",
        pointKeys: ["SelfExclusionPoint1", "SelfExclusionPoint2", "SelfExclusionPoint3"],
        ctaLabelKey: "SelfExclude",
        onCta: () => alert("Open self-exclusion flow…"),
      },
      {
        id: "reality-check",
        titleKey: "RealityCheckTitle",
        descKey: "RealityCheckDesc",
        pointKeys: ["RealityCheckPoint1", "RealityCheckPoint2", "RealityCheckPoint3"],
        ctaLabelKey: "TurnOnRealityChecks",
        onCta: () => alert("Enable reality checks…"),
      },
    ],
    []
  );

  const faqs = useMemo<FaqConfig[]>(
    () => [
      { qKey: "Faq1Q", aKey: "Faq1A" },
      { qKey: "Faq2Q", aKey: "Faq2A" },
      { qKey: "Faq3Q", aKey: "Faq3A" },
      { qKey: "Faq4Q", aKey: "Faq4A" },
      { qKey: "Faq5Q", aKey: "Faq5A" },
    ],
    []
  );

  const toggleFaq = (idx: number) => setOpen((p) => ({ ...p, [idx]: !p[idx] }));

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background glow */}
      <div class="pointer-events-none fixed inset-0 -z-10">
        <div class="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />
        <div class="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* Header */}
      <header class="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 text-zinc-950 font-black shadow-lg shadow-violet-500/10">
              ♥
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
              href="#tools"
              class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
            >
              {t("SaferPlayTools")}
            </a>
            <a
              href="#self-check"
              class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
            >
              {t("SelfCheck")}
            </a>
            <a
              href="#support"
              class="inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:brightness-110"
            >
              {t("GetSupport")}
            </a>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 pb-12">
        {/* Hero */}
        <section class="py-6">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/40 p-6 shadow-2xl shadow-black/40">
            <div class="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-center">
              <div>
                <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {t("PlayForFunTitle")}
                </h1>
                <p class="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
                  {t("PlayForFunDesc", { brand: BRAND_NAME })}
                </p>

                <div class="mt-5 flex flex-wrap gap-2">
                  <a
                    href="#tools"
                    class="inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-base font-extrabold text-zinc-950 shadow-lg shadow-violet-500/15 hover:brightness-110"
                  >
                    {t("ExploreSaferPlayTools")}
                  </a>
                  <a
                    href="#support"
                    class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-base font-extrabold hover:bg-zinc-900/70"
                  >
                    {t("FindSupportResources")}
                  </a>
                </div>

                <div class="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-base text-amber-200/90">
                  <div class="font-extrabold">{t("ImportantNote")}</div>
                  <div class="mt-1 text-sm leading-relaxed text-amber-200/80">
                    {t("ImportantNoteDesc")}
                  </div>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <InfoCard
                  title={t("SetLimitsTitle")}
                  text={t("SetLimitsText")}
                />
                <InfoCard
                  title={t("TakeBreaksTitle")}
                  text={t("TakeBreaksText")}
                />
                <InfoCard
                  title={t("GetSupportTitle")}
                  text={t("GetSupportText")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" class="py-4">
          <div class="mb-3">
            <h2 class="text-lg font-extrabold tracking-wide">
              {t("SaferPlayTools")}
            </h2>
            <p class="mt-1 text-sm leading-relaxed text-zinc-400">
              {t("SaferPlayToolsDesc")}
            </p>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.id}
                class="rounded-3xl border border-white/10 bg-zinc-900/35 p-5"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-base font-extrabold">{t(tool.titleKey)}</div>
                    <div class="mt-1 text-sm leading-relaxed text-zinc-400">
                      {t(tool.descKey)}
                    </div>
                  </div>
                  <span class="rounded-full border border-white/10 bg-zinc-950/20 px-3 py-1 text-xs text-zinc-400">
                    {t("Account")}
                  </span>
                </div>

                <ul class="mt-4 space-y-2">
                  {tool.pointKeys.map((key) => (
                    <li
                      key={key}
                      class="flex gap-2 text-sm leading-relaxed text-zinc-300"
                    >
                      <span class="mt-[2px] h-4 w-4 shrink-0 rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/20" />
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={tool.onCta}
                  class="mt-5 inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:brightness-110"
                >
                  {t(tool.ctaLabelKey)}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Self-check */}
        <section id="self-check" class="py-8">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/55 to-zinc-900/25 p-6">
            <h2 class="text-lg font-extrabold tracking-wide">
              {t("QuickSelfCheckTitle")}
            </h2>
            <p class="mt-1 text-sm leading-relaxed text-zinc-400">
              {t("QuickSelfCheckDesc")}
            </p>

            <div class="mt-5 grid gap-3 md:grid-cols-2">
              <CheckItem text={t("Check1")} />
              <CheckItem text={t("Check2")} />
              <CheckItem text={t("Check3")} />
              <CheckItem text={t("Check4")} />
              <CheckItem text={t("Check5")} />
              <CheckItem text={t("Check6")} />
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <a
                href="#support"
                class="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:brightness-110"
              >
                {t("IWantHelp")}
              </a>
              <a
                href="#tools"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("SetLimitsNow")}
              </a>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section class="py-2">
          <div class="mb-3">
            <h2 class="text-lg font-extrabold tracking-wide">{t("FaqsTitle")}</h2>
            <p class="mt-1 text-sm leading-relaxed text-zinc-400">
              {t("FaqsDesc")}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            {faqs.map((f, idx) => {
              const isOpen = !!open[idx];
              return (
                <div
                  key={idx}
                  class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/30"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-violet-500/5"
                  >
                    <span class="text-base font-extrabold">{t(f.qKey)}</span>
                    <span class="text-zinc-400" aria-hidden="true">
                      {isOpen ? "▾" : "▸"}
                    </span>
                  </button>
                  {isOpen ? (
                    <div class="px-4 pb-4 text-base leading-relaxed text-zinc-400">
                      {t(f.aKey)}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* Support */}
        <section id="support" class="py-8">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/65 to-zinc-900/30 p-6">
            <h2 class="text-lg font-extrabold tracking-wide">{t("GetSupport")}</h2>
            <p class="mt-1 text-sm leading-relaxed text-zinc-400">
              {t("GetSupportDesc", { brand: BRAND_NAME })}
            </p>

            <div class="mt-5 grid gap-3 lg:grid-cols-3">
              <SupportCard
                title={t("ContactSiteSupportTitle")}
                desc={t("ContactSiteSupportDesc")}
                actionLabel={t("ChatWithSupport")}
                onAction={() => alert("Open support chat…")}
                hint={t("DontSharePassword")}
              />
              <SupportCard
                title={t("ProfessionalHelpTitle")}
                desc={t("ProfessionalHelpDesc")}
                actionLabel={t("FindLocalResources")}
                onAction={() => alert("Open resources directory…")}
                hint={t("ReplaceWithLinks")}
              />
              <SupportCard
                title={t("ConcernedAboutSomeoneTitle")}
                desc={t("ConcernedAboutSomeoneDesc")}
                actionLabel={t("ShareResources")}
                onAction={() =>
                  navigator
                    ?.share?.({
                      title: t("Title"),
                      text: t("ShareResourcesText"),
                    })
                    .catch(() => alert("Copy/share…"))
                }
                hint={t("YoureNotAlone")}
              />
            </div>

            <div class="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
              <div class="text-base font-extrabold text-rose-200/90">
                {t("UrgentSafety")}
              </div>
              <div class="mt-1 text-sm leading-relaxed text-rose-200/80">
                {t("UrgentSafetyText")}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResponsibleGamblingPage;

/* ---------- Small components ---------- */

const InfoCard = ({ title, text }: { title: string; text: string }) => (
  <div class="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
    <div class="text-base font-extrabold">{title}</div>
    <div class="mt-1 text-sm leading-relaxed text-zinc-400">{text}</div>
  </div>
);

const CheckItem = ({ text }: { text: string }) => (
  <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
    <div class="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/20" />
    <div class="text-sm leading-relaxed text-zinc-200">{text}</div>
  </div>
);

const SupportCard = ({
  title,
  desc,
  actionLabel,
  onAction,
  hint,
}: {
  title: string;
  desc: string;
  actionLabel: string;
  onAction: () => void;
  hint?: string;
}) => (
  <div class="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
    <div class="text-base font-extrabold">{title}</div>
    <div class="mt-1 text-sm leading-relaxed text-zinc-400">{desc}</div>
    <button
      type="button"
      onClick={onAction}
      class="mt-3 inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:brightness-110"
    >
      {actionLabel}
    </button>
    {hint ? <div class="mt-2 text-xs text-zinc-500">{hint}</div> : null}
  </div>
);
