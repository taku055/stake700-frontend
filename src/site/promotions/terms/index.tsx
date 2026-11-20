"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "@/components/common/Link";
import { useTranslations } from "@/context/I18nContext";
import { apiGetPromotions } from "@/api/ledger/apiPromotions";
import { apiGetGameById } from "@/api/common/apiGetGameById";
import { apiGetCashbackSettings, type tCashbackSettings } from "@/api/cashback/apiGetCashback";
import {
  formatEligibility,
  formatVipRange,
  isDepositPromoType,
  isNoDepositPromoType,
  isPlayerVisiblePromotion,
} from "@/config/promoConstants";
import { capitalize } from "@/helpers/capitalize";
import { currencyState } from "@/state/currencyState";
import { useLocale } from "@/router";
import { userState } from "@/state/userState";
import type { tLedgerPromotion } from "@/types/tUserLedger";
import {
  KIND_LOOK,
  money,
  promoBonusValue,
  promoHeadline,
  promoKind,
  promoMaxBonus,
  promoMinDeposit,
  termsAnchor,
  weekdayName,
} from "../promoDisplay";

const UPDATED = Date.UTC(2026, 10, 19);

/** Platform rules mirrored from backend settings (configurations table defaults). */
const RULES = {
  dust: 0.1,
  cashbackPercent: 10,
  cashbackCap: 500,
  cashbackMin: 0.5,
  vipMultiplier: 40,
  vipSpinValue: 0.5,
  vipSpinDays: 7,
  welcome: { count: 50, value: 0.2, cap: 20, x: 40 },
};

type Section = { id: string; title: string };

function Clause({ children }: { children: ReactNode }) {
  return <li className="relative ps-5 before:absolute before:start-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--primary-color)]">{children}</li>;
}

function TermsSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="mb-4 text-[20px] font-extrabold text-white md:text-[22px]">{title}</h2>
      {children}
    </section>
  );
}

function ClauseList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3 text-[15px] leading-relaxed text-[var(--text-muted-color)]">
      {items.map((item, i) => (
        <Clause key={i}>{item}</Clause>
      ))}
    </ul>
  );
}

/** One offer's full terms as a definition table. */
export function OfferTerms({ promo, gameName }: { promo: tLedgerPromotion; gameName?: string }) {
  const t = useTranslations("BonusTerms");
  const tp = useTranslations("PromotionsPage");
  const kind = promoKind(promo);
  const { Icon, accent, accent2 } = KIND_LOOK[kind];
  const locale = String(useLocale());
  const value = promoBonusValue(promo);
  const max = promoMaxBonus(promo);
  const minDeposit = promoMinDeposit(promo);
  const spinValue = Number(promo.perSpinCost) || 0;
  const winCap = (promo as tLedgerPromotion & { freeSpinWinCap?: string | number | null }).freeSpinWinCap;
  const vipRange = formatVipRange(promo.minVipLevel, promo.maxVipLevel, tp);
  const weekly = promo.eligibility === "WEEKLY_ONCE";

  const rows: [string, ReactNode][] = [
    [t("row_code"), <span className="font-mono tracking-wider">{promo.code}</span>],
    [t("row_reward"), promoHeadline(promo, tp)],
    [
      t("row_who"),
      [
        promo.eligibility && promo.eligibility !== "ALL" && !weekly ? formatEligibility(promo.eligibility, tp) : t("who_all"),
        vipRange,
      ]
        .filter(Boolean)
        .join(" · "),
    ],
  ];
  if (minDeposit > 0) rows.push([t("row_min_deposit"), money(minDeposit)]);
  if (value > 0) rows.push([t("row_bonus"), promo.isPercentBonus ? t("bonus_percent", { value: String(value) }) : money(value)]);
  if (max > 0) rows.push([t("row_max_bonus"), money(max)]);
  if (promo.freeSpins > 0) {
    rows.push([t("row_spins"), t("spins_value", { count: String(promo.freeSpins), value: money(spinValue) })]);
    if (gameName) rows.push([t("row_game"), gameName]);
    rows.push([
      t("row_win_cap"),
      winCap != null && Number(winCap) > 0 ? money(Number(winCap)) : isDepositPromoType(promo.type) ? t("win_cap_deposit") : "—",
    ]);
  }
  if (promo.wageringMultiplier > 0) rows.push([t("row_wagering"), t("wagering_value", { x: String(promo.wageringMultiplier) })]);
  rows.push([
    t("row_release"),
    promo.wageringMaxWithdrawMultiplier > 1
      ? t("release_value", { x: String(promo.wageringMaxWithdrawMultiplier) })
      : t("release_start"),
  ]);
  rows.push([
    t("row_days"),
    promo.validDays?.length ? promo.validDays.map((d) => weekdayName(d, locale)).join(", ") : t("any_day"),
  ]);
  rows.push([t("row_limit"), weekly ? t("limit_weekly") : t("limit_once")]);
  if (promo.expiresAfterhours > 0) {
    const h = promo.expiresAfterhours;
    rows.push([t("row_time"), h % 24 === 0 ? t("time_days", { days: String(h / 24) }) : t("time_value", { hours: String(h) })]);
  }
  if (isDepositPromoType(promo.type)) rows.push([t("row_how"), t("how_deposit")]);

  return (
    <article
      id={termsAnchor(promo.code)}
      style={{ "--accent": accent, "--accent-2": accent2 } as CSSProperties}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] target:border-[var(--accent)]"
    >
      <header className="relative flex items-center gap-3 overflow-hidden border-b border-[var(--background-secondary)] p-4 md:p-5">
        <span aria-hidden className="absolute inset-y-0 start-0 w-1 bg-[linear-gradient(var(--accent),var(--accent-2))]" />
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-[#0c1a25]">
          <Icon size={18} strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-extrabold text-white">{promo.name}</h3>
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--accent)]">{tp(`kind_${kind}`)}</p>
        </div>
      </header>
      <dl className="grid text-[14px] sm:grid-cols-2">
        {rows.map(([label, val], i) => (
          <div key={i} className="flex flex-col gap-0.5 border-b border-white/[0.05] px-4 py-3 md:px-5 sm:odd:border-e">
            <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted-color)]">{label}</dt>
            <dd className="font-semibold text-white">{val}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default function BonusTermsPage() {
  const t = useTranslations("BonusTerms");
  const site = capitalize(process.env.NEXT_PUBLIC_SITE_NAME);
  const locale = String(useLocale());
  const [promos, setPromos] = useState<tLedgerPromotion[] | null>(null);
  const [welcome, setWelcome] = useState<tLedgerPromotion | null>(null);
  const [games, setGames] = useState<Record<string, string>>({});
  const [cashback, setCashback] = useState<tCashbackSettings>({
    enabled: true,
    percent: RULES.cashbackPercent,
    dailyCap: RULES.cashbackCap,
    minAmount: RULES.cashbackMin,
  });

  // Live cashback rules (back office settings)
  useEffect(() => {
    let alive = true;
    apiGetCashbackSettings()
      .then((s) => alive && s && typeof s.percent === "number" && setCashback(s))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    apiGetPromotions("NORMAL", userState.value?.id ?? "", currencyState.value.unit)
      .then((list) => {
        if (!alive) return;
        const all = (list?.promotions ?? []).filter((p) => p.isActive);
        setPromos(all.filter(isPlayerVisiblePromotion));
        setWelcome(all.find((p) => isNoDepositPromoType(p.type) && p.freeSpins > 0) ?? null);
      })
      .catch(() => alive && setPromos([]));
    return () => {
      alive = false;
    };
  }, [userState.value?.id, currencyState.value.unit]);

  // Free-spin game names
  useEffect(() => {
    const ids = [...new Set((promos ?? []).map((p) => p.freeSpinGameId).filter((id): id is string => !!id))];
    ids.forEach((id) =>
      apiGetGameById(id)
        .then((g) => setGames((prev) => ({ ...prev, [id]: g.name })))
        .catch(() => undefined),
    );
  }, [promos]);

  // Deep link (#offer-code) once the offers are on the page
  useEffect(() => {
    if (promos === null || !window.location.hash) return;
    document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ block: "start" });
  }, [promos]);

  const w = {
    count: welcome?.freeSpins || RULES.welcome.count,
    value: Number(welcome?.perSpinCost) || RULES.welcome.value,
    cap: Number((welcome as { freeSpinWinCap?: unknown } | null)?.freeSpinWinCap) || RULES.welcome.cap,
    x: welcome?.wageringMultiplier || RULES.welcome.x,
  };

  const sections: Section[] = useMemo(
    () => [
      { id: "general", title: t("s_general") },
      { id: "balances", title: t("s_balances") },
      { id: "wagering", title: t("s_wagering") },
      { id: "free-spins", title: t("s_spins") },
      { id: "offers", title: t("s_offers") },
      { id: "welcome", title: t("s_welcome") },
      { id: "cashback", title: t("s_cashback") },
      { id: "vip", title: t("s_vip") },
      { id: "fair-play", title: t("s_fair") },
    ],
    [t],
  );
  const title = (id: string) => {
    const i = sections.findIndex((s) => s.id === id);
    return `${i + 1}. ${sections[i].title}`;
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-3 py-6 md:px-6 md:py-10">
      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl border border-[var(--background-secondary)] p-6 md:p-10">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(120deg,#16305e,#11233a_45%,var(--bar-background-color))]" />
        <div aria-hidden className="absolute -end-20 -top-24 h-72 w-72 rounded-full bg-[var(--primary-color)] opacity-25 blur-[90px]" />
        <div className="relative">
          <Link
            href="/promotions"
            className="flex w-fit items-center gap-1.5 text-[13px] font-semibold text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} className="rtl:rotate-180" />
            {t("back")}
          </Link>
          <p className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7eb6ff]">
            <FileText size={13} />
            {t("kicker")}
          </p>
          <h1 className="mt-2 text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-white md:text-[42px]">{t("title")}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/65">{t("intro", { site })}</p>
          <p className="mt-4 text-[12px] font-semibold text-white/40">
            {t("updated", { date: new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(UPDATED) })}
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* Table of contents */}
        <nav aria-label={t("toc")} className="max-lg:hidden">
          <div className="sticky top-24">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted-color)]">{t("toc")}</p>
            <ol className="space-y-0.5 border-s border-[var(--background-secondary)]">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ms-px block border-s-2 border-transparent py-1.5 ps-4 text-[13px] font-medium text-[var(--text-muted-color)] transition-colors hover:border-[var(--primary-color)] hover:text-white"
                  >
                    <span className="me-1.5 tabular-nums text-white/30">{i + 1}.</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="flex min-w-0 flex-col gap-12">
          <TermsSection id="general" title={title("general")}>
            <ClauseList items={[t("general_1"), t("general_2"), t("general_3"), t("general_4")]} />
          </TermsSection>

          <TermsSection id="balances" title={title("balances")}>
            <ClauseList
              items={[t("balances_1"), t("balances_2"), t("balances_3"), t("balances_4"), t("balances_5", { amount: money(RULES.dust) })]}
            />
          </TermsSection>

          <TermsSection id="wagering" title={title("wagering")}>
            <ClauseList
              items={[t("wagering_1"), t("wagering_2"), t("wagering_3"), t("wagering_4"), t("wagering_5"), t("wagering_6")]}
            />
          </TermsSection>

          <TermsSection id="free-spins" title={title("free-spins")}>
            <ClauseList items={[t("spins_1"), t("spins_2"), t("spins_3"), t("spins_4")]} />
          </TermsSection>

          <TermsSection id="offers" title={title("offers")}>
            <p className="mb-5 text-[15px] leading-relaxed text-[var(--text-muted-color)]">{t("offers_intro")}</p>
            {promos === null ? (
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div key={i} className="h-[260px] animate-pulse rounded-2xl bg-[var(--bar-background-color)]" />
                ))}
              </div>
            ) : promos.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--background-secondary)] p-6 text-center text-[14px] text-[var(--text-muted-color)]">
                {t("offers_empty")}
              </p>
            ) : (
              <div className="space-y-4">
                {promos.map((p) => (
                  <OfferTerms key={p.id} promo={p} gameName={p.freeSpinGameId ? games[p.freeSpinGameId] : undefined} />
                ))}
              </div>
            )}
          </TermsSection>

          <TermsSection id="welcome" title={title("welcome")}>
            <ClauseList
              items={[
                t("welcome_1", { count: String(w.count), value: money(w.value) }),
                t("welcome_2", { cap: money(w.cap), x: String(w.x) }),
                t("welcome_3"),
              ]}
            />
          </TermsSection>

          <TermsSection id="cashback" title={title("cashback")}>
            <ClauseList
              items={[
                ...(cashback.enabled ? [] : [<strong className="text-amber-200/90">{t("cashback_off")}</strong>]),
                cashback.dailyCap > 0
                  ? t("cashback_1", { percent: String(cashback.percent), cap: money(cashback.dailyCap) })
                  : t("cashback_1_nocap", { percent: String(cashback.percent) }),
                t("cashback_2"),
                t("cashback_3", { min: money(cashback.minAmount) }),
                t("cashback_4"),
              ]}
            />
          </TermsSection>

          <TermsSection id="vip" title={title("vip")}>
            <ClauseList
              items={[
                t("vip_1"),
                t("vip_2", { x: String(RULES.vipMultiplier) }),
                t("vip_3", { value: money(RULES.vipSpinValue), days: String(RULES.vipSpinDays) }),
              ]}
            />
          </TermsSection>

          <TermsSection id="fair-play" title={title("fair-play")}>
            <ClauseList items={[t("fair_1"), t("fair_2"), t("fair_3"), t("fair_4")]} />
          </TermsSection>
        </div>
      </div>
    </div>
  );
}
