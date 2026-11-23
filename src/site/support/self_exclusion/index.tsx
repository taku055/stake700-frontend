"use client";

/** SelfExclusionPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * No footer (per request)
 * Brand name is a variable: BRAND_NAME
 */
import { type FC as FunctionalComponent, createElement as h } from "react";
import { useMemo, useState } from "react";
import { useTranslations } from "@/context/I18nContext";
import { capitalize } from "@/helpers/capitalize";
import { Link } from "@/components/common";

export const BRAND_NAME = capitalize(process.env.NEXT_PUBLIC_SITE_NAME);

type Period = {
  id: string;
  labelKey: string;
  descKey: string;
  recommended?: boolean;
};

const SelfExclusionPage: FunctionalComponent = () => {
  const t = useTranslations("SelfExclusion");

  const periods = useMemo<Period[]>(
    () => [
      {
        id: "7d",
        labelKey: "Period7d",
        descKey: "Period7dDesc",
      },
      {
        id: "30d",
        labelKey: "Period30d",
        descKey: "Period30dDesc",
        recommended: true,
      },
      {
        id: "6m",
        labelKey: "Period6m",
        descKey: "Period6mDesc",
      },
      {
        id: "1y",
        labelKey: "Period1y",
        descKey: "Period1yDesc",
      },
    ],
    []
  );

  const [selected, setSelected] = useState<string>("30d");
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [confirm3, setConfirm3] = useState(false);

  const canSubmit = confirm1 && confirm2 && confirm3;

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
                ⛔
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
              <Link
                href="/support/responsible-gambling"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("ResponsibleGaming")}
              </Link>
              <Link
                href="/support/gambling-helpline"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                {t("Helplines")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {/* hero */}
        <section className="py-7">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/35 p-6 shadow-2xl shadow-black/40">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("TakeABreakTitle")}
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              {t("TakeABreakDesc")}
            </p>

            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="text-base font-extrabold text-amber-200/90">
                {t("PleaseRead")}
              </div>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-amber-200/80">
                <li>• {t("Bullet1")}</li>
                <li>• {t("Bullet2")}</li>
                <li>• {t("Bullet3")}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_420px]">
          {/* left: selection + explanation */}
          <div className="space-y-4">
            {/* period selection */}
            <div
              className="rounded-3xl border border-white/10 bg-zinc-900/35 p-6"
              aria-label={t("ChoosePeriod")}
            >
              <h2 className="text-xl font-extrabold tracking-wide">
                {t("ChoosePeriod")}
              </h2>
              <p className="mt-1 text-base leading-relaxed text-zinc-300">
                {t("ChoosePeriodDesc")}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {periods.map((p) => {
                  const active = selected === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(p.id)}
                      aria-pressed={active}
                      className={
                        "w-full rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 " +
                        (active
                          ? "border-violet-400/60 bg-zinc-950/20 ring-4 ring-violet-500/10"
                          : "border-white/10 bg-zinc-950/10 hover:border-violet-400/30 hover:bg-zinc-950/20")
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-extrabold">{t(p.labelKey)}</div>
                          <div className="mt-1 text-sm leading-relaxed text-zinc-400">
                            {t(p.descKey)}
                          </div>
                        </div>
                        {p.recommended ? (
                          <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-extrabold text-emerald-200/90">
                            {t("Recommended")}
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-zinc-950/20 px-3 py-1 text-xs text-zinc-400">
                            {t("Option")}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* what happens */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/35 p-6">
              <h2 className="text-xl font-extrabold tracking-wide">
                {t("WhatHappensTitle")}
              </h2>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoCard
                  title={t("AccessBlockedTitle")}
                  text={t("AccessBlockedText")}
                />
                <InfoCard
                  title={t("WithdrawalsTitle")}
                  text={t("WithdrawalsText")}
                />
                <InfoCard
                  title={t("MarketingReducedTitle")}
                  text={t("MarketingReducedText")}
                />
                <InfoCard
                  title={t("SupportAvailableTitle")}
                  text={t("SupportAvailableText")}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
                <div className="text-base font-extrabold text-rose-200/90">
                  {t("IfYouFeelUnsafe")}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-rose-200/80">
                  {t("IfYouFeelUnsafeText")}
                </div>
              </div>
            </div>
          </div>

          {/* right: confirmation */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/65 to-zinc-900/30 p-6">
              <h2 className="text-xl font-extrabold tracking-wide">
                {t("ConfirmTitle")}
              </h2>
              <p className="mt-1 text-base leading-relaxed text-zinc-300">
                {t("YouSelected")}{" "}
                <span className="font-extrabold text-zinc-100">
                  {periods.find((p) => p.id === selected)
                    ? t(periods.find((p) => p.id === selected)!.labelKey)
                    : ""}
                </span>
              </p>

              <div className="mt-4 space-y-3">
                <CheckRow
                  checked={confirm1}
                  onToggle={() => setConfirm1((v) => !v)}
                  text={t("Confirm1")}
                />
                <CheckRow
                  checked={confirm2}
                  onToggle={() => setConfirm2((v) => !v)}
                  text={t("Confirm2")}
                />
                <CheckRow
                  checked={confirm3}
                  onToggle={() => setConfirm3((v) => !v)}
                  text={t("Confirm3")}
                />
              </div>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => alert("Submit self-exclusion request…")}
                className={
                  "mt-5 w-full rounded-full px-5 py-3 text-base font-extrabold transition " +
                  (canSubmit
                    ? "bg-violet-500 text-zinc-950 hover:brightness-110"
                    : "cursor-not-allowed bg-zinc-800 text-zinc-400")
                }
              >
                {t("StartSelfExclusion")}
              </button>

              <div className="mt-3 text-sm text-zinc-400">
                {t("NeedHelpChoosing")}{" "}
                <Link
                  className="font-extrabold text-zinc-200 hover:underline"
                  href="/support/gambling-helpline"
                >
                  {t("ViewHelplines")}
                </Link>{" "}
                {t("or")}{" "}
                <Link
                  className="font-extrabold text-zinc-200 hover:underline"
                  href="/support/help-center"
                >
                  {t("ContactSupport")}
                </Link>
                .
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/15 p-4">
                <div className="text-sm font-extrabold">
                  {t("PreferLighterOption")}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-zinc-400">
                  {t("PreferLighterOptionDescBefore")}
                  <Link
                    className="font-extrabold text-zinc-200 hover:underline"
                    href="/support/responsible-gambling"
                  >
                    {t("PreferLighterOptionLink")}
                  </Link>
                  {t("PreferLighterOptionDescAfter")}
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default SelfExclusionPage;

/* ---------------- small components ---------------- */

const InfoCard = ({ title, text }: { title: string; text: string }) => (
  <div className="rounded-3xl border border-white/10 bg-zinc-950/15 p-5">
    <div className="text-lg font-extrabold">{title}</div>
    <div className="mt-2 text-sm leading-relaxed text-zinc-300">{text}</div>
  </div>
);

const CheckRow = ({
  checked,
  onToggle,
  text,
}: {
  checked: boolean;
  onToggle: () => void;
  text: string;
}) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/15 p-4">
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      className="mt-1 h-5 w-5 accent-violet-500"
    />
    <span className="text-sm leading-relaxed text-zinc-200">{text}</span>
  </label>
);
