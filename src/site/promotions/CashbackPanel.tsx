"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { BadgeDollarSign, Clock3, Info, PauseCircle, RotateCcw } from "lucide-react";
import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import { useTranslations } from "@/context/I18nContext";
import {
  apiGetCashback,
  apiGetCashbackSettings,
  type tCashbackSettings,
  type tCashbackSummary,
} from "@/api/cashback/apiGetCashback";
import { currencyState } from "@/state/currencyState";
import { localeState } from "@/state/localeState";
import { registerOpenedState } from "@/state/registerOpenedState";
import { userState } from "@/state/userState";
import { money } from "./promoDisplay";

const ACCENT = { "--accent": "#3ddc97", "--accent-2": "#6ef2ff" } as CSSProperties;

/** "05:12:33" until `target`; ticks on the client only. */
function useCountdown(target: string | undefined) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (!target || now === null) return "--:--:--";
  const left = Math.max(0, new Date(target).getTime() - now);
  const s = Math.floor(left / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

function formatDay(day: string, locale: string) {
  const d = new Date(`${day}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? day
    : new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" }).format(d);
}

/**
 * Daily slot cashback: the rules for guests; for players also today's running
 * estimate, the countdown to the next payout and (optionally) payout history.
 */
export default function CashbackPanel({ showHistory = false }: { showHistory?: boolean }) {
  const t = useTranslations("Cashback");
  const userId = userState.value?.id;
  const currency = currencyState.value.unit;
  const locale = String(localeState.value);
  const [settings, setSettings] = useState<tCashbackSettings | null>(null);
  const [summary, setSummary] = useState<tCashbackSummary | null>(null);
  const countdown = useCountdown(summary?.nextPayoutAt);

  useEffect(() => {
    let alive = true;
    setSummary(null);
    (async () => {
      try {
        if (userId) {
          const s = await apiGetCashback(currency);
          if (!alive || !s?.settings) return;
          setSummary(s);
          setSettings(s.settings);
        } else {
          const s = await apiGetCashbackSettings();
          if (alive && s && typeof s.percent === "number") setSettings(s);
        }
      } catch {
        /* panel stays hidden */
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId, currency]);

  if (!settings) return null;
  const hasHistory = (summary?.history.length ?? 0) > 0;
  if (!settings.enabled && !(showHistory && hasHistory)) return null;

  const facts = [
    settings.dailyCap > 0 ? t("cap", { amount: money(settings.dailyCap) }) : null,
    t("cash_no_wagering"),
    t("paid_daily"),
  ].filter(Boolean) as string[];

  return (
    <section
      aria-labelledby="cashback-title"
      style={ACCENT}
      className="relative isolate overflow-hidden rounded-[26px] border border-[color-mix(in_srgb,var(--accent)_25%,var(--background-secondary))] bg-[#0c1a25]"
    >
      {/* backdrop */}
      <span aria-hidden className="absolute -start-24 -top-28 -z-10 h-72 w-72 rounded-full bg-[var(--accent)] opacity-[0.16] blur-[90px]" />
      <span aria-hidden className="absolute -bottom-32 end-1/4 -z-10 h-72 w-72 rounded-full bg-[var(--accent-2)] opacity-[0.1] blur-[90px]" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_12px)]" />

      <div className="flex flex-col gap-6 p-5 md:p-7 lg:flex-row lg:items-center">
        {/* Pitch */}
        <div className="flex min-w-0 flex-1 items-start gap-4 md:gap-5">
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-[#0c1a25] shadow-[0_12px_30px_-10px_var(--accent)] md:h-20 md:w-20">
            <RotateCcw size={30} strokeWidth={2.4} className="md:hidden" />
            <RotateCcw size={36} strokeWidth={2.4} className="max-md:hidden" />
            <span className="absolute -bottom-2 -end-2 rounded-full border-2 border-[#0c1a25] bg-white px-1.5 py-0.5 text-[11px] font-black text-[#0c1a25]">
              {settings.percent}%
            </span>
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--accent)]">{t("kicker")}</p>
            <h2 id="cashback-title" className="mt-1 text-[22px] font-black leading-tight text-white md:text-[26px]">
              {t("title", { percent: String(settings.percent) })}
            </h2>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-white/60 md:text-[14px]">{t("pitch")}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {facts.map((f) => (
                <li
                  key={f}
                  className="rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2.5 py-1 text-[11px] font-bold text-[var(--accent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Player status / guest CTA */}
        {summary ? (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:w-[440px]">
            <div className="flex flex-1 flex-col justify-between rounded-2xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/[0.07]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">{t("estimate")}</p>
              <p className="mt-1 bg-[linear-gradient(180deg,#fff_30%,var(--accent))] bg-clip-text text-[34px] font-black leading-none tracking-[-0.02em] text-transparent tabular-nums">
                {money(summary.today.estimate)}
              </p>
              <p className="mt-2 text-[12px] text-white/50">
                {t("today_loss", { amount: money(summary.today.loss) })}
              </p>
            </div>
            <div className="flex flex-1 flex-col justify-between rounded-2xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/[0.07]">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">
                <Clock3 size={13} />
                {t("next_payout")}
              </p>
              <p className="mt-1 font-mono text-[28px] font-bold leading-none text-white tabular-nums" suppressHydrationWarning>
                {countdown}
              </p>
              {summary.paused ? (
                <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-snug text-amber-200/90">
                  <PauseCircle size={14} className="mt-px shrink-0" />
                  {t("paused")}
                </p>
              ) : !settings.enabled ? (
                <p className="mt-2 text-[12px] text-white/45">{t("disabled")}</p>
              ) : (
                <Link
                  href={routes.promotionTerms("cashback")}
                  className="mt-2 inline-flex w-fit items-center gap-1 text-[12px] font-semibold text-white/50 transition-colors hover:text-white"
                >
                  <Info size={13} />
                  {t("how_it_works")}
                </Link>
              )}
            </div>
          </div>
        ) : (
          !userId && (
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => (registerOpenedState.value = true)}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] px-6 text-[15px] font-black text-[#0c1a25] shadow-[0_12px_28px_-12px_var(--accent)] transition-[filter] hover:brightness-110"
              >
                <BadgeDollarSign size={18} strokeWidth={2.4} />
                {t("register")}
              </button>
              <Link
                href={routes.promotionTerms("cashback")}
                className="inline-flex h-12 items-center gap-1.5 px-2 text-[13px] font-semibold text-white/60 transition-colors hover:text-white"
              >
                <Info size={15} />
                {t("how_it_works")}
              </Link>
            </div>
          )
        )}
      </div>

      {/* History */}
      {showHistory && summary && (
        <div className="border-t border-white/[0.06] px-5 py-4 md:px-7">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[14px] font-extrabold text-white">{t("history_title")}</h3>
            <p className="text-[12px] text-white/50">
              {t("total_received", { amount: money(summary.totalReceived), count: String(summary.payouts) })}
            </p>
          </div>
          {hasHistory ? (
            <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {summary.history.map((h) => (
                <li
                  key={h.id}
                  className="flex shrink-0 flex-col rounded-xl bg-white/[0.04] px-3.5 py-2.5 ring-1 ring-inset ring-white/[0.06]"
                >
                  <span className="text-[11px] font-semibold text-white/45">{formatDay(h.rewardDate, locale)}</span>
                  <span className="text-[15px] font-extrabold text-[var(--accent)] tabular-nums">+{money(h.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-white/45">{t("empty_history")}</p>
          )}
        </div>
      )}
    </section>
  );
}
