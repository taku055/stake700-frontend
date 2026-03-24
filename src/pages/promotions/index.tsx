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
                className="flex flex-col group rounded-[10px] border p-5 transition hover:-translate-y-0.5"
                style={{
                  borderColor: "#1e3328",
                  background: "#13201a",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3
                    className="text-lg font-bold leading-snug font-['Montserrat',sans-serif]"
                    style={{ color: "#a0c8b0" }}
                  >
                    {promo.name}
                  </h3>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs"
                    style={{
                      background: "rgba(46,125,79,0.25)",
                      color: "#8aab96",
                    }}
                  >
                    {promo.type}
                  </span>
                </div>

                <p
                  className="text-sm leading-relaxed line-clamp-3 mb-auto"
                  style={{ color: "#8aab96" }}
                >
                  {promo.description}
                </p>

                <div className="mt-4 text-xs" style={{ color: "#4a6a56" }}>
                  Valid {promo.validFrom} – {promo.validTo}
                </div>

                {(promo.type === "DEPOSIT" || promo.type === "DEPOSIT_BONUS") && (
                  <button
                    onClick={() => {
                      history.pushState(null, "", `?promo=${promo.id}`);
                      profileOpenedState.value = { isOpen: true, defaultTab: "/balance-management/deposit", bonusId: String(promo.id) };
                    }}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{
                      background: "linear-gradient(145deg, #2e7d4f, #1a4d30)",
                      boxShadow: "0 0 24px #2e7d4f44, 0 4px 12px #000",
                      border: "2px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {ctaLabel(promo.type)}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
