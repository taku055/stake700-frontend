"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { FileText, Gift, Percent, Sparkles, Ticket } from "lucide-react";
import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import { apiGetPromotions } from "@/api/ledger/apiPromotions";
import { isNoDepositPromoType, isPlayerVisiblePromotion } from "@/config/promoConstants";
import { currencyState } from "@/state/currencyState";
import { userState } from "@/state/userState";
import type { tLedgerPromotion } from "@/types/tUserLedger";
import { useLocation } from "@/router";
import { openAccountDialog } from "@/state/accountDialogs";
import { loginOpenedState } from "@/state/loginOpenedState";
import { requireLogin } from "@/helpers/requireAuth";
import WageringPage from "@/site/wagering";
import { useTranslations } from "@/context/I18nContext";
import PromoOfferCard from "./PromoOfferCard";
import CashbackPanel from "./CashbackPanel";
import EarnedOffers from "./EarnedOffers";
import { KIND_LOOK, promoKind, type PromoKind } from "./promoDisplay";

type PromoTab = "offers" | "active";
type Filter = "all" | PromoKind;

function getTabFromQuery(tab: string | string[] | undefined): PromoTab {
  const value = Array.isArray(tab) ? tab[0] : tab;
  return value === "active" ? "active" : "offers";
}

const FILTERS: Filter[] = ["all", "deposit", "spins", "vip"];

export default function PromoPage() {
  const t = useTranslations("PromotionsPage");
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<PromoTab>(() => getTabFromQuery(location.query?.tab));
  const [filter, setFilter] = useState<Filter>("all");
  const [promos, setPromos] = useState<tLedgerPromotion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(getTabFromQuery(location.query?.tab));
  }, [location.query?.tab]);

  useEffect(() => {
    if (activeTab === "active" && !userState.value?.id) {
      loginOpenedState.value = true;
    }
  }, [activeTab]);

  const switchTab = (tab: PromoTab) => {
    if (tab === "active" && !requireLogin()) return;
    setActiveTab(tab);
    location.route(tab === "active" ? "/promotions?tab=active" : "/promotions");
  };

  const claim = useCallback((promo: tLedgerPromotion) => {
    if (isNoDepositPromoType(promo.type) || !promo.available) return;
    if (!requireLogin()) return;
    history.pushState(null, "", `?promo=${promo.id}`);
    openAccountDialog("/balance-management/deposit", String(promo.id));
  }, []);

  useEffect(() => {
    if (activeTab !== "offers") return;
    let alive = true;
    (async () => {
      try {
        setError(null);
        setPromos(null);
        const list = await apiGetPromotions("NORMAL", userState.value?.id ?? "", currencyState.value.unit);
        if (!alive) return;
        // The backend answers errors as { hasError, message } without `data`
        if (!list) throw new Error(t("load_error"));
        setPromos((list.promotions ?? []).filter((p) => p.isActive && isPlayerVisiblePromotion(p)));
      } catch (e: any) {
        if (!alive) return;
        setError(t("load_error"));
        setPromos([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [activeTab, userState.value?.id, currencyState.value.unit]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: 0, deposit: 0, spins: 0, vip: 0 };
    for (const p of promos ?? []) {
      c.all += 1;
      c[promoKind(p)] += 1;
    }
    return c;
  }, [promos]);

  const visible = useMemo(
    () => (promos ?? []).filter((p) => filter === "all" || promoKind(p) === filter),
    [promos, filter],
  );
  const availableCount = (promos ?? []).filter((p) => p.available).length;

  return (
    <div className="flex w-full flex-col gap-6 p-2 md:gap-8">
      {/* Hero */}
      <section className="relative rounded-3xl border border-[var(--background-secondary)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,#1d2f6b_0%,#14284a_40%,var(--bar-background-color)_75%)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.035)_0_2px,transparent_2px_22px)]" />
          <div className="absolute -end-16 -top-24 h-80 w-80 rounded-full bg-[#b28cff] opacity-20 blur-[100px]" />
          <div className="absolute -bottom-28 start-1/3 h-72 w-72 rounded-full bg-[var(--primary-color)] opacity-20 blur-[100px]" />
        </div>

        <div className="relative flex items-center gap-8 p-6 md:p-10">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
              <Ticket size={13} className="text-[#b28cff]" />
              {t("hero_kicker")}
            </span>
            <h1 className="mt-4 text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white md:text-[44px]">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[var(--text-muted-color)] md:text-[15px]">
              {activeTab === "offers" ? t("subtitle_offers") : t("subtitle_active")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-2xl border border-white/10 bg-black/25 p-1 backdrop-blur">
                {(["offers", "active"] as const).map((tab) => {
                  const on = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => switchTab(tab)}
                      aria-pressed={on}
                      className={`h-10 rounded-xl px-4 text-[14px] font-bold transition-colors md:px-5 ${
                        on
                          ? "bg-white text-[#0f212e] shadow-[0_8px_20px_-10px_rgba(255,255,255,0.6)]"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {tab === "offers" ? t("tab_offers") : t("tab_mine")}
                    </button>
                  );
                })}
              </div>
              <Link
                href={routes.promotionTerms()}
                className="inline-flex h-12 items-center gap-2 rounded-2xl px-3 text-[13px] font-semibold text-white/70 transition-colors hover:text-white"
              >
                <FileText size={16} />
                {t("terms_link")}
              </Link>
            </div>
          </div>

          {/* Stat bubbles */}
          {activeTab === "offers" && (
            <div className="grid shrink-0 grid-cols-2 gap-3 max-md:hidden">
              {[
                { icon: Gift, label: t("stat_offers"), value: promos ? String(counts.all) : "–", color: "#4aa3ff" },
                {
                  icon: Sparkles,
                  label: t("stat_for_you"),
                  value: promos ? (userState.value?.id ? String(availableCount) : "–") : "–",
                  color: "#b28cff",
                },
              ].map(({ icon: StatIcon, label, value, color }) => (
                <div
                  key={label}
                  style={{ "--accent": color } as CSSProperties}
                  className="flex w-[150px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]">
                    <StatIcon size={18} />
                  </span>
                  <span>
                    <span className="block text-[26px] font-extrabold leading-none text-white tabular-nums">{value}</span>
                    <span className="mt-1 block text-[12px] font-semibold text-[var(--text-muted-color)]">{label}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {activeTab === "active" && (
        <>
          <EarnedOffers />
          <CashbackPanel showHistory />
          <WageringPage embedded />
        </>
      )}

      {activeTab === "offers" && (
        <>
          <EarnedOffers />
          <CashbackPanel />

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((f) => {
              const on = filter === f;
              const look = f === "all" ? { Icon: Percent, accent: "#7c8cff" } : KIND_LOOK[f];
              if (f !== "all" && counts[f] === 0) return null;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={on}
                  style={{ "--accent": look.accent } as CSSProperties}
                  className={`flex h-10 shrink-0 items-center gap-2 rounded-full border ps-1.5 pe-4 text-[14px] font-semibold transition-colors ${
                    on
                      ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_16%,var(--bar-background-color))] text-white"
                      : "border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] hover:text-white"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]">
                    <look.Icon size={14} />
                  </span>
                  {t(`filter_${f}`)}
                  <span className="text-[12px] font-bold tabular-nums text-[var(--text-muted-color)]">{counts[f]}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="rounded-2xl border border-red-400/20 bg-red-500/[0.08] p-5 text-center text-[14px] text-red-100/90">{error}</p>
          )}

          {promos === null ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[440px] animate-pulse rounded-[26px] bg-[var(--bar-background-color)]" />
              ))}
            </div>
          ) : visible.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--background-secondary)] px-6 py-16 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bar-background-color)] text-[var(--background-tertiary)]">
                <Gift size={26} />
              </span>
              <p className="text-[16px] font-semibold text-white">{t("empty")}</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4">
              {visible.map((promo) => (
                <PromoOfferCard key={promo.id} promo={promo} onClaim={() => claim(promo)} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
