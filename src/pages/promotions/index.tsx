import {
  apiClaimNoDepositBonus,
  apiGetPromotions,
} from "@/api/ledger/apiPromotions";
import { apiGetUserBalance } from "@/api/ledger/apiGetUserBalance";
import { apiGetGameById } from "@/api/common/apiGetGameById";
import {
  formatEligibility,
  formatPromoType,
  formatVipRange,
  isDepositPromoType,
  isDepositSequenceEligibility,
  isNoDepositPromoType,
} from "@/config/promoConstants";
import { currencyState } from "@/state/currencyState";
import { userState } from "@/state/userState";
import { balanceState } from "@/state/balanceState";
import { loginOpenedState } from "@/state/loginOpenedState";
import { tLedgerPromotion } from "@/types/tUserLedger";
import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { profileOpenedState } from "@/state/profileOpenedState";
import WageringPage from "@/pages/wagering";
import { useTranslations } from "@/context/I18nContext";
import { toast } from "@/helpers/toast";

type PromoTab = "offers" | "active";

function getTabFromQuery(tab: string | string[] | undefined): PromoTab {
  const value = Array.isArray(tab) ? tab[0] : tab;
  return value === "active" ? "active" : "offers";
}

type PromoResponse = {
  promotions: tLedgerPromotion[];
  total: number;
};

function ctaLabel(
  type: string,
  t: (key: string, values?: Record<string, string>) => string,
) {
  switch (type) {
    case "DEPOSIT":
    case "DEPOSIT_BONUS":
      return t("deposit_now");
    case "NO_DEPOSIT":
      return t("claim_now");
    case "SIGNUP":
    case "SIGNUP_BONUS":
      return t("sign_up_now");
    default:
      return t("claim_offer");
  }
}

export default function PromoPage() {
  const t = useTranslations("PromotionsPage");
  const tWagering = useTranslations("Wagering");
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<PromoTab>(() =>
    getTabFromQuery(location.query?.tab)
  );
  const [data, setData] = useState<PromoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalPromo, setModalPromo] = useState<tLedgerPromotion | null>(null);
  const [freeSpinGameName, setFreeSpinGameName] = useState<string | null>(null);
  const [claimingPromoId, setClaimingPromoId] = useState<number | null>(null);

  useEffect(() => {
    setActiveTab(getTabFromQuery(location.query?.tab));
  }, [location.query?.tab]);

  const switchTab = (tab: PromoTab) => {
    setActiveTab(tab);
    location.route(tab === "active" ? "/promotions?tab=active" : "/promotions");
  };

  const openDepositForPromo = (promo: tLedgerPromotion) => {
    history.pushState(null, "", `?promo=${promo.id}`);
    profileOpenedState.value = {
      isOpen: true,
      defaultTab: "/balance-management/deposit",
      bonusId: String(promo.id),
    };
  };

  const claimNoDepositPromo = async (promo: tLedgerPromotion) => {
    if (!promo.available || claimingPromoId != null) return;

    const userId = userState.value?.id;
    if (!userId) {
      toast.error(t("login_to_claim"));
      loginOpenedState.value = true;
      return;
    }

    const currencyCode = currencyState.value.unit;
    setClaimingPromoId(promo.id);
    try {
      await apiClaimNoDepositBonus(promo.id, currencyCode);
      try {
        const balance = await apiGetUserBalance(userId, currencyCode);
        balanceState.value = {
          ...balanceState.value,
          [balance.currencyCode]: balance,
        };
      } catch {
        // Socket ledger.updated may still refresh balance.
      }
      toast.success(t("claim_success"));
      setModalPromo(null);
      switchTab("active");
    } catch (e: any) {
      toast.error(e?.message ?? t("claim_error"));
    } finally {
      setClaimingPromoId(null);
    }
  };

  const handlePrimaryCta = (promo: tLedgerPromotion) => {
    if (!promo.available) return;
    if (isNoDepositPromoType(promo.type)) {
      void claimNoDepositPromo(promo);
      return;
    }
    openDepositForPromo(promo);
  };

  useEffect(() => {
    if (!modalPromo?.freeSpinGameId || modalPromo.freeSpins <= 0) {
      setFreeSpinGameName(null);
      return;
    }

    let alive = true;
    apiGetGameById(modalPromo.freeSpinGameId)
      .then((game) => {
        if (alive) setFreeSpinGameName(game.name);
      })
      .catch(() => {
        if (alive) setFreeSpinGameName(null);
      });

    return () => {
      alive = false;
    };
  }, [modalPromo?.id, modalPromo?.freeSpinGameId, modalPromo?.freeSpins]);

  useEffect(() => {
    if (activeTab !== "offers") return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = userState.value?.id ?? "";
        const currencyCode = currencyState.value.unit;
        const promotionList = await apiGetPromotions("NORMAL", userId, currencyCode);
        if (!alive) return;

        setData(promotionList);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? t("load_error"));
        setData(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [activeTab, userState.value?.id, currencyState.value.unit]);

  const promos = data?.promotions ?? [];

  return (
    <div
      className="min-h-screen text-white flex flex-col gap-3 overflow-none"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-center gap-3 w-full mt-4 mb-6">
          <div
            className="flex-1 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, #2e7d4f)",
            }}
          />
          <h1
            className="font-bold uppercase whitespace-nowrap tracking-[0.12em]"
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: "#4caf78",
              fontSize: "1.1rem",
              textShadow: "0 0 18px #2e7d4f66, 0 2px 4px #000",
            }}
          >
            {t("title")}
          </h1>
          <div
            className="flex-1 h-[2px]"
            style={{
              background: "linear-gradient(270deg, transparent, #2e7d4f)",
            }}
          />
        </div>

        <p className="text-center text-sm mb-6 -mt-2" style={{ color: "#6b8c78" }}>
          {activeTab === "offers" ? t("subtitle_offers") : t("subtitle_active")}
        </p>

        <div className="mb-6 flex justify-center">
          <div
            className="inline-flex rounded-full border p-1"
            style={{ borderColor: "#1e3328", background: "rgba(15,26,19,0.9)" }}
          >
            {(
              [
                { key: "offers" as const, label: t("tab_all") },
                { key: "active" as const, label: t("tab_active") },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => switchTab(tab.key)}
                className="rounded-full px-4 py-2 text-sm font-semibold transition"
                style={
                  activeTab === tab.key
                    ? {
                        background: "linear-gradient(145deg, #2e7d4f, #1a4d30)",
                        color: "#d4f5e2",
                        boxShadow: "0 0 16px #2e7d4f44",
                      }
                    : { color: "#6b8c78" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "active" && <WageringPage embedded />}

        {activeTab === "offers" && (
          <>
        <div className="hidden md:flex justify-center mb-4">
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{ background: "rgba(46,125,79,0.25)", color: "#a0c8b0" }}
          >
            {t("total_count", { total: String(data?.total ?? 0) })}
          </span>
        </div>

        {loading && (
          <div
            className="rounded-[10px] border p-6 text-center"
            style={{
              borderColor: "#1e3328",
              background: "rgba(15,26,19,0.9)",
              color: "#8aab96",
            }}
          >
            {t("loading")}
          </div>
        )}

        {!loading && error && (
          <div
            className="rounded-[10px] border p-6 text-center"
            style={{
              borderColor: "#2e7d4f66",
              background: "rgba(15,26,19,0.9)",
              color: "#8aab96",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && promos.length === 0 && (
          <div
            className="rounded-[10px] border p-6 text-center"
            style={{
              borderColor: "#1e3328",
              background: "rgba(15,26,19,0.9)",
              color: "#8aab96",
            }}
          >
            {t("empty")}
          </div>
        )}

        {!loading && !error && promos.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-serif items-stretch">
              {promos.filter(promo => promo.isActive).map((promo) => (
                <div
                  key={promo.id}
                  className="flex h-full w-full max-w-[561px] mx-auto flex-col overflow-hidden shadow-lg"
                >
                  <div className="aspect-[16/9] w-full shrink-0 bg-[#0C0C0C]">
                    <img
                      src={promo.imageUrl || "/images/new-promo.svg"}
                      alt={t("promo_alt")}
                      className="block h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col bg-[#0C0C0C] px-5 pt-6 pb-5">
                    <div className="flex min-h-[148px] flex-1 flex-col">
                      <div className="mb-2 min-h-[3.25rem] text-center text-[20px] font-bold tracking-wide text-[#CEA30E] line-clamp-2">
                        {promo.description}
                      </div>
                      <div className="my-3 shrink-0 border-b border-[1.35px] border-[#CEA30E]" />
                      <div className="mb-2 text-[16px] font-semibold text-white">
                        {isNoDepositPromoType(promo.type)
                          ? t("promo_code")
                          : t("deposit_code")}{" "}
                        <span className="text-[#CEA30E]">{promo.code}</span>
                      </div>
                      <div className="min-h-[2.75rem]">
                        {!promo.available && promo.ineligibleReason && (
                          <p className="text-xs leading-relaxed text-amber-200/80 line-clamp-3">
                            {promo.ineligibleReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto flex shrink-0 gap-3 pt-5">
                      <button
                        type="button"
                        className={[
                          "flex-1 font-bold text-[16px] rounded-lg py-3 font-serif transition shadow-md",
                          promo.available && claimingPromoId !== promo.id
                            ? "bg-[#01A825] text-white cursor-pointer shadow-[#01A825] hover:brightness-110"
                            : "bg-[#1e2520] text-white/35 cursor-not-allowed border border-white/10 opacity-80 shadow-none",
                        ].join(" ")}
                        disabled={!promo.available || claimingPromoId === promo.id}
                        aria-disabled={!promo.available || claimingPromoId === promo.id}
                        onClick={() => handlePrimaryCta(promo)}
                      >
                        {claimingPromoId === promo.id
                          ? t("claiming")
                          : ctaLabel(promo.type, t)}
                      </button>
                      <button
                        className="flex-1 bg-transparent text-[#CEA30E] font-bold text-[16px] border-2 border-[#CEA30E] rounded-lg py-3 cursor-pointer transition hover:bg-yellow-400/10"
                        style={{
                          boxShadow: '0 0 15px 0 #01a8256f',
                        }}
                        onClick={() => setModalPromo(promo)}
                      >
                        <span style={{
                          textShadow: '0px 2px 8px rgba(255,255,255,0.49)',
                          letterSpacing: 2,
                          fontFamily: 'serif',
                          display: 'block',

                        }}>
                          {t("learn_more")}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {modalPromo && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                onClick={e => {
                  if (e.target === e.currentTarget) setModalPromo(null);
                }}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={modalPromo.name}
                  className="relative bg-[#13201a] rounded-[10px] border border-[#1e3328] shadow-2xl w-full max-w-lg animate-fadeIn overflow-hidden max-h-[90vh] flex flex-col"
                >
                  {/* Sticky header (close + availability) */}
                  <div className="sticky top-0 z-10 bg-[#13201a] border-b" style={{ borderColor: "#1e3328" }}>
                    <button
                      className="absolute top-3 right-3 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center bg-[#222]/60 hover:bg-[#222]/80 transition"
                      onClick={() => setModalPromo(null)}
                      aria-label={t("close")}
                    >
                      ×
                    </button>

                    <div className="flex justify-center pt-4 pb-2">
                      <span
                        className="px-3 py-1 rounded-full font-bold uppercase text-xs tracking-wider shadow"
                        style={modalPromo.available
                          ? { background: "#2e7d4f", color: "#d4f5e2" }
                          : { background: "#5a2020", color: "#f5a0a0" }
                        }
                      >
                        {modalPromo.available ? t("available") : t("unavailable")}
                      </span>
                    </div>

                    <div className="px-5 pb-3">
                      <div className="flex items-start justify-between gap-2 pr-10">
                        <div>
                          <h3
                            className="text-base font-bold leading-snug"
                            style={{ fontFamily: "Montserrat, sans-serif", color: "#a0c8b0" }}
                          >
                            {modalPromo.name}
                          </h3>
                          <span className="text-[11px]" style={{ color: "#4a6a56" }}>
                            {t("code")}{" "}
                            <span style={{ color: "#6b9c80" }}>{modalPromo.code}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(46,125,79,0.2)", color: "#8aab96" }}>
                          {formatPromoType(modalPromo.type, t)}
                        </span>
                        {modalPromo.eligibility && modalPromo.eligibility !== "ALL" && (
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(180,130,20,0.2)", color: "#c8a84a" }}>
                            {formatEligibility(modalPromo.eligibility, t)}
                          </span>
                        )}
                        {formatVipRange(modalPromo.minVipLevel, modalPromo.maxVipLevel, t) && (
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(120,80,200,0.25)", color: "#c4a8f0" }}>
                            {formatVipRange(modalPromo.minVipLevel, modalPromo.maxVipLevel, t)}
                          </span>
                        )}
                        {modalPromo.forWhom && modalPromo.forWhom !== "ALL" && (
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(60,80,160,0.25)", color: "#8aaad4" }}>
                            {modalPromo.forWhom}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!modalPromo.available && modalPromo.ineligibleReason && (
                    <div
                      className="mx-5 mb-3 rounded-lg border px-3 py-2.5 text-xs leading-relaxed"
                      style={{
                        borderColor: "#5a4020",
                        background: "rgba(180,130,20,0.12)",
                        color: "#e8c878",
                      }}
                    >
                      {modalPromo.ineligibleReason}
                      {isDepositSequenceEligibility(modalPromo.eligibility) &&
                        modalPromo.requiredDepositNumber != null &&
                        modalPromo.userQualifyingDepositCount != null && (
                          <span className="mt-1 block opacity-80">
                            {t("qualifying_deposits", {
                              current: String(modalPromo.userQualifyingDepositCount),
                              required: String(modalPromo.requiredDepositNumber),
                            })}
                          </span>
                        )}
                    </div>
                  )}

                  {/* Scrollable body */}
                  <div className="overflow-y-auto overscroll-contain">
                    {/* Description */}
                    <div className="px-5 py-3">
                      <p className="text-xs leading-relaxed" style={{ color: "#7a9a88" }}>
                        {modalPromo.description}
                      </p>
                    </div>

                    {/* Bonus highlights */}
                    <div className="px-5 py-3 border-b border-t grid grid-cols-2 gap-x-4 gap-y-2 mt-auto" style={{ borderColor: "#1e3328" }}>
                      {modalPromo.isPercentBonus ? (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>{t("bonus")}</div>
                          <div className="text-sm font-bold" style={{ color: "#4caf78" }}>{modalPromo.bonusValue}%</div>
                        </div>
                      ) : (
                        parseFloat(String(modalPromo.bonusValue)) > 0 && (
                          <div>
                            <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>{t("bonus_amount")}</div>
                            <div className="text-sm font-bold" style={{ color: "#4caf78" }}>
                              {modalPromo.bonusValue} {modalPromo.currency}
                            </div>
                          </div>
                        )
                      )}
                      {parseFloat(modalPromo.maxBonusLimit) > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>{t("max_bonus")}</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{modalPromo.maxBonusLimit} {modalPromo.currency}</div>
                        </div>
                      )}
                      {modalPromo.wageringMultiplier > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>{t("wagering")}</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{modalPromo.wageringMultiplier}x <span className="text-[10px] font-normal" style={{ color: "#4a6a56" }}>({modalPromo.wageringBase})</span></div>
                        </div>
                      )}
                      {modalPromo.wageringMaxWithdrawMultiplier > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>{t("max_withdraw")}</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{t("max_withdraw_multiplier", { multiplier: String(modalPromo.wageringMaxWithdrawMultiplier) })}</div>
                        </div>
                      )}
                      {modalPromo.freeSpins > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>{t("free_spins")}</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>
                            {modalPromo.freeSpins}{" "}
                            <span className="text-[10px] font-normal" style={{ color: "#4a6a56" }}>
                              @ {modalPromo.perSpinCost} {modalPromo.currency}
                            </span>
                          </div>
                          {modalPromo.freeSpinGameId && (
                            <div className="mt-0.5 text-[10px]" style={{ color: "#4a6a56" }}>
                              {t("game")}{" "}
                              <span style={{ color: "#6b8c78" }}>
                                {freeSpinGameName ?? modalPromo.freeSpinGameId}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {formatVipRange(modalPromo.minVipLevel, modalPromo.maxVipLevel, t) && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>{t("vip_range")}</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>
                            {formatVipRange(modalPromo.minVipLevel, modalPromo.maxVipLevel, t)}
                          </div>
                        </div>
                      )}
                      {isDepositSequenceEligibility(modalPromo.eligibility) && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>{t("deposit_tier")}</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>
                            {formatEligibility(modalPromo.eligibility, t)}
                          </div>
                        </div>
                      )}
                      {modalPromo.expiresAfterhours > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>
                            {tWagering("wagering_window_label")}
                          </div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>
                            {tWagering("wagering_window_after_claim", {
                              hours: String(modalPromo.expiresAfterhours),
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Validity */}
                    <div className="px-5 py-2.5 border-b text-[11px]" style={{ borderColor: "#1e3328", color: "#4a6a56" }}>
                      <div>{t("valid")} <span style={{ color: "#6b8c78" }}>{modalPromo.validFrom} – {modalPromo.validTo}</span></div>
                      {modalPromo.validDays && modalPromo.validDays.length > 0 && (
                        <div className="mt-0.5">{t("days")} <span style={{ color: "#6b8c78" }}>{modalPromo.validDays.join(", ")}</span></div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="px-5 py-4">
                      {(isDepositPromoType(modalPromo.type) ||
                        isNoDepositPromoType(modalPromo.type)) && (
                        <button
                          disabled={
                            !modalPromo.available ||
                            claimingPromoId === modalPromo.id
                          }
                          onClick={() => handlePrimaryCta(modalPromo)}
                          className="inline-flex w-full items-center justify-center rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition"
                          style={
                            modalPromo.available &&
                            claimingPromoId !== modalPromo.id
                              ? {
                                  background:
                                    "linear-gradient(145deg, #2e7d4f, #1a4d30)",
                                  boxShadow:
                                    "0 0 24px #2e7d4f44, 0 4px 12px #000",
                                  border: "2px solid rgba(255,255,255,0.15)",
                                  cursor: "pointer",
                                }
                              : {
                                  background: "#1e2a22",
                                  border: "2px solid #2a3a2e",
                                  color: "#4a6a56",
                                  cursor: "not-allowed",
                                }
                          }
                        >
                          {claimingPromoId === modalPromo.id
                            ? t("claiming")
                            : ctaLabel(modalPromo.type, t)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
          </>
        )}
      </div>
    </div>
  );
}
