import { apiGetPromotions } from "@/api/ledger/apiPromotions";
import { apiGetGameById } from "@/api/common/apiGetGameById";
import {
  formatEligibility,
  formatVipRange,
  isDepositSequenceEligibility,
} from "@/config/promoConstants";
import { currencyState } from "@/state/currencyState";
import { userState } from "@/state/userState";
import { tLedgerPromotion } from "@/types/tUserLedger";
import { useEffect, useState } from "preact/hooks";
import { profileOpenedState } from "@/state/profileOpenedState";

type PromoResponse = {
  promotions: tLedgerPromotion[];
  total: number;
};

function ctaLabel(type: string) {
  switch (type) {
    case "DEPOSIT":
    case "DEPOSIT_BONUS":
      return "DEPOSIT NOW";
    case "SIGNUP":
      return "SIGN UP NOW";
    default:
      return "CLAIM OFFER";
  }
}

export default function PromoPage() {
  const [data, setData] = useState<PromoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalPromo, setModalPromo] = useState<tLedgerPromotion | null>(null);
  const [freeSpinGameName, setFreeSpinGameName] = useState<string | null>(null);

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
        setError(e?.message ?? "Failed to load promotions.");
        setData(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [userState.value?.id, currencyState.value.unit]);

  const promos = data?.promotions ?? [];

  return (
    <div
      className="min-h-screen text-white flex flex-col gap-3 overflow-none"
      style={{ background: "#0f1a13" }}
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
            Promotions
          </h1>
          <div
            className="flex-1 h-[2px]"
            style={{
              background: "linear-gradient(270deg, transparent, #2e7d4f)",
            }}
          />
        </div>

        <p className="text-center text-sm mb-6 -mt-2" style={{ color: "#6b8c78" }}>
          Grab limited-time offers and boost your play.
        </p>

        <div className="hidden md:flex justify-center mb-4">
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{ background: "rgba(46,125,79,0.25)", color: "#a0c8b0" }}
          >
            Total: {data?.total ?? 0}
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
            Loading promotions…
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
            No promotions available right now.
          </div>
        )}

        {!loading && !error && promos.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-serif">
              {promos.map((promo) => (
                <div key={promo.id} className="overflow-hidden max-w-[561px] mx-auto shadow-lg">
                  <div className="w-full">
                    <img
                      src={promo.imageUrl || "/images/new-promo.svg"}
                      alt="Promo"
                      className="w-full h-full object-contain block"
                    />
                  </div>
                  <div className="px-5 pt-6 pb-5 bg-[#0C0C0C]">
                    <div className="font-bold text-[20px] text-[#CEA30E] mb-2 tracking-wide text-center line-clamp-2">
                      {promo.description}
                    </div>
                    <div className="border-b border-[1.35px] border-[#CEA30E] my-3" />
                    <div className="text-white font-semibold text-[16px] mb-2 ">
                      DEPOSIT CODE : <span className="text-[#CEA30E]">{promo.code}</span>
                    </div>
                    {!promo.available && promo.ineligibleReason && (
                      <p className="text-xs leading-relaxed text-amber-200/80 mb-2">
                        {promo.ineligibleReason}
                      </p>
                    )}
                    <div className="flex gap-3 mt-5">
                      <button
                        type="button"
                        className={[
                          "flex-1 font-bold text-[16px] rounded-lg py-3 font-serif transition shadow-md",
                          promo.available
                            ? "bg-[#01A825] text-white cursor-pointer shadow-[#01A825] hover:brightness-110"
                            : "bg-[#1e2520] text-white/35 cursor-not-allowed border border-white/10 opacity-80 shadow-none",
                        ].join(" ")}
                        disabled={!promo.available}
                        aria-disabled={!promo.available}
                        onClick={() => {
                          if (!promo.available) return;
                          history.pushState(null, "", `?promo=${promo.id}`);
                          profileOpenedState.value = { isOpen: true, defaultTab: "/balance-management/deposit", bonusId: String(promo.id) };
                        }}
                      >
                        DEPOSIT NOW
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
                          LEARN MORE
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
                      aria-label="Close"
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
                        {modalPromo.available ? "Available" : "Unavailable"}
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
                            Code:{" "}
                            <span style={{ color: "#6b9c80" }}>{modalPromo.code}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(46,125,79,0.2)", color: "#8aab96" }}>
                          {modalPromo.type}
                        </span>
                        {modalPromo.eligibility && modalPromo.eligibility !== "ALL" && (
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(180,130,20,0.2)", color: "#c8a84a" }}>
                            {formatEligibility(modalPromo.eligibility)}
                          </span>
                        )}
                        {formatVipRange(modalPromo.minVipLevel, modalPromo.maxVipLevel) && (
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(120,80,200,0.25)", color: "#c4a8f0" }}>
                            {formatVipRange(modalPromo.minVipLevel, modalPromo.maxVipLevel)}
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
                            Qualifying deposits: {modalPromo.userQualifyingDepositCount} / need{" "}
                            {modalPromo.requiredDepositNumber}
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
                      {modalPromo.isPercentBonus && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Bonus</div>
                          <div className="text-sm font-bold" style={{ color: "#4caf78" }}>{modalPromo.bonusValue}%</div>
                        </div>
                      )}
                      {parseFloat(modalPromo.maxBonusLimit) > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Max Bonus</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{modalPromo.maxBonusLimit} {modalPromo.currency}</div>
                        </div>
                      )}
                      {modalPromo.wageringMultiplier > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Wagering</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{modalPromo.wageringMultiplier}x <span className="text-[10px] font-normal" style={{ color: "#4a6a56" }}>({modalPromo.wageringBase})</span></div>
                        </div>
                      )}
                      {modalPromo.wageringMaxWithdrawMultiplier > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Max Withdraw</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{modalPromo.wageringMaxWithdrawMultiplier}x bonus</div>
                        </div>
                      )}
                      {modalPromo.freeSpins > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Free Spins</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>
                            {modalPromo.freeSpins}{" "}
                            <span className="text-[10px] font-normal" style={{ color: "#4a6a56" }}>
                              @ {modalPromo.perSpinCost} {modalPromo.currency}
                            </span>
                          </div>
                          {modalPromo.freeSpinGameId && (
                            <div className="mt-0.5 text-[10px]" style={{ color: "#4a6a56" }}>
                              Game:{" "}
                              <span style={{ color: "#6b8c78" }}>
                                {freeSpinGameName ?? modalPromo.freeSpinGameId}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {formatVipRange(modalPromo.minVipLevel, modalPromo.maxVipLevel) && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>VIP range</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>
                            {formatVipRange(modalPromo.minVipLevel, modalPromo.maxVipLevel)}
                          </div>
                        </div>
                      )}
                      {isDepositSequenceEligibility(modalPromo.eligibility) && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Deposit tier</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>
                            {formatEligibility(modalPromo.eligibility)}
                          </div>
                        </div>
                      )}
                      {modalPromo.expiresAfterhours > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Expires After</div>
                          <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{modalPromo.expiresAfterhours}h</div>
                        </div>
                      )}
                    </div>

                    {/* Validity */}
                    <div className="px-5 py-2.5 border-b text-[11px]" style={{ borderColor: "#1e3328", color: "#4a6a56" }}>
                      <div>Valid: <span style={{ color: "#6b8c78" }}>{modalPromo.validFrom} – {modalPromo.validTo}</span></div>
                      {modalPromo.validDays && modalPromo.validDays.length > 0 && (
                        <div className="mt-0.5">Days: <span style={{ color: "#6b8c78" }}>{modalPromo.validDays.join(", ")}</span></div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="px-5 py-4">
                      {(modalPromo.type === "DEPOSIT" || modalPromo.type === "DEPOSIT_BONUS") && (
                        <button
                          disabled={!modalPromo.available}
                          onClick={() => {
                            if (!modalPromo.available) return;
                            history.pushState(null, "", `?promo=${modalPromo.id}`);
                            profileOpenedState.value = { isOpen: true, defaultTab: "/balance-management/deposit", bonusId: String(modalPromo.id) };
                          }}
                          className="inline-flex w-full items-center justify-center rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition"
                          style={modalPromo.available ? {
                            background: "linear-gradient(145deg, #2e7d4f, #1a4d30)",
                            boxShadow: "0 0 24px #2e7d4f44, 0 4px 12px #000",
                            border: "2px solid rgba(255,255,255,0.15)",
                            cursor: "pointer",
                          } : {
                            background: "#1e2a22",
                            border: "2px solid #2a3a2e",
                            color: "#4a6a56",
                            cursor: "not-allowed",
                          }}
                        >
                          {ctaLabel(modalPromo.type)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
