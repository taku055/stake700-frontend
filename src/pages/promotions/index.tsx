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
  const [modalPromo, setModalPromo] = useState<tLedgerPromotion | null>(null);

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
                      src={promo.imageUrl || "/public/images/new-promo.svg"}
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
                    <div className="flex gap-3 mt-5">
                      <button
                        className="flex-1 bg-[#01A825] text-white font-bold text-[16px] rounded-lg py-3 cursor-pointer shadow-md shadow-[#01A825] transition hover:brightness-110 font-serif"
                        disabled={!promo.available}
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={e => {
                  if (e.target === e.currentTarget) setModalPromo(null);
                }}
              >
                <div className="relative bg-[#13201a] rounded-[10px] border border-[#1e3328] shadow-2xl w-full max-w-lg mx-4 animate-fadeIn overflow-hidden">
                  {/* Close button */}
                  <button
                    className="absolute top-3 right-3 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center bg-[#222]/60 hover:bg-[#222]/80 transition"
                    onClick={() => setModalPromo(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  {/* Availability info (moved inside) */}
                  <div className="flex justify-center pt-7 pb-1">
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
                  {/* Header */}
                  <div className="px-5 pt-7 pb-3 border-b" style={{ borderColor: "#1e3328" }}>
                    <div className="flex items-start justify-between gap-2 pr-10">
                      <div>
                        <h3
                          className="text-base font-bold leading-snug"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#a0c8b0" }}
                        >
                          {modalPromo.name}
                        </h3>
                        <span className="text-[11px]" style={{ color: "#4a6a56" }}>Code: <span style={{ color: "#6b9c80" }}>{modalPromo.code}</span></span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(46,125,79,0.2)", color: "#8aab96" }}>
                        {modalPromo.type}
                      </span>
                      {modalPromo.eligibility && modalPromo.eligibility !== "ALL" && (
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(180,130,20,0.2)", color: "#c8a84a" }}>
                          {modalPromo.eligibility}
                        </span>
                      )}
                      {modalPromo.forWhom && modalPromo.forWhom !== "ALL" && (
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgba(60,80,160,0.25)", color: "#8aaad4" }}>
                          {modalPromo.forWhom}
                        </span>
                      )}
                    </div>
                  </div>
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
                        <div className="text-sm font-bold" style={{ color: "#a0c8b0" }}>{modalPromo.freeSpins} <span className="text-[10px] font-normal" style={{ color: "#4a6a56" }}>@ {modalPromo.perSpinCost} {modalPromo.currency}</span></div>
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
