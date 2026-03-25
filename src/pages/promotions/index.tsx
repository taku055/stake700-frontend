import { apiGetPromotions } from "@/api/ledger/apiPromotions";
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="relative flex flex-col group rounded-[10px] border transition hover:-translate-y-0.5 overflow-hidden"
                style={{
                  borderColor: "#1e3328",
                  background: "#13201a",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              >
                {/* Availability ribbon */}
                <div
                  className="absolute top-[16px] right-[-30px] rotate-45 px-10 py-0.5 text-[10px] font-bold uppercase tracking-wider z-10"
                  style={promo.available
                    ? { background: "#2e7d4f", color: "#d4f5e2" }
                    : { background: "#5a2020", color: "#f5a0a0" }
                  }
                >
                  {promo.available ? "Available" : "Unavailable"}
                </div>

                {/* Header */}
                <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: "#1e3328" }}>
                  <div className="flex items-start justify-between gap-2 pr-10">
                    <div>
                      <h3
                        className="text-base font-bold leading-snug"
                        style={{ fontFamily: "Montserrat, sans-serif", color: "#a0c8b0" }}
                      >
                        {promo.name}
                      </h3>
                      <span className="text-[11px]" style={{ color: "#4a6a56" }}>Code: <span style={{ color: "#6b9c80" }}>{promo.code}</span></span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(46,125,79,0.2)", color: "#8aab96" }}>
                      {promo.type}
                    </span>
                    {promo.eligibility && promo.eligibility !== "ALL" && (
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(180,130,20,0.2)", color: "#c8a84a" }}>
                        {promo.eligibility}
                      </span>
                    )}
                    {promo.forWhom && promo.forWhom !== "ALL" && (
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(60,80,160,0.25)", color: "#8aaad4" }}>
                        {promo.forWhom}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="px-5 py-3">
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#7a9a88" }}>
                    {promo.description}
                  </p>
                </div>

                {/* Bonus highlights */}
                <div className="px-5 py-3 border-b border-t grid grid-cols-2 gap-x-4 gap-y-2 mt-auto" style={{ borderColor: "#1e3328" }}>
                  {promo.isPercentBonus && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Bonus</div>
                      <div className="text-sm font-bold" style={{ color: "#4caf78" }}>{promo.bonusValue}%</div>
                    </div>
                  )}
                  {parseFloat(promo.maxBonusLimit) > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Max Bonus</div>
                      <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{promo.maxBonusLimit} {promo.currency}</div>
                    </div>
                  )}
                  {promo.wageringMultiplier > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Wagering</div>
                      <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{promo.wageringMultiplier}x <span className="text-[10px] font-normal" style={{ color: "#4a6a56" }}>({promo.wageringBase})</span></div>
                    </div>
                  )}
                  {promo.wageringMaxWithdrawMultiplier > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Max Withdraw</div>
                      <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{promo.wageringMaxWithdrawMultiplier}x bonus</div>
                    </div>
                  )}
                  {promo.freeSpins > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Free Spins</div>
                      <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{promo.freeSpins} <span className="text-[10px] font-normal" style={{ color: "#4a6a56" }}>@ {promo.perSpinCost} {promo.currency}</span></div>
                    </div>
                  )}
                  {promo.expiresAfterhours > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#4a6a56" }}>Expires After</div>
                      <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{promo.expiresAfterhours}h</div>
                    </div>
                  )}
                </div>

                {/* Validity */}
                <div className="px-5 py-2.5 border-b text-[11px]" style={{ borderColor: "#1e3328", color: "#4a6a56" }}>
                  <div>Valid: <span style={{ color: "#6b8c78" }}>{promo.validFrom} – {promo.validTo}</span></div>
                  {promo.validDays && promo.validDays.length > 0 && (
                    <div className="mt-0.5">Days: <span style={{ color: "#6b8c78" }}>{promo.validDays.join(", ")}</span></div>
                  )}
                </div>

                {/* CTA */}
                <div className="px-5 py-4">
                  {(promo.type === "DEPOSIT" || promo.type === "DEPOSIT_BONUS") && (
                    <button
                      disabled={!promo.available}
                      onClick={() => {
                        if (!promo.available) return;
                        history.pushState(null, "", `?promo=${promo.id}`);
                        profileOpenedState.value = { isOpen: true, defaultTab: "/balance-management/deposit", bonusId: String(promo.id) };
                      }}
                      className="inline-flex w-full items-center justify-center rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition"
                      style={promo.available ? {
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
                      {ctaLabel(promo.type)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
