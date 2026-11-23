import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import { apiGetPromotions } from "@/api/ledger/apiPromotions";
import { isDepositPromoType, isPlayerVisiblePromotion } from "@/config/promoConstants";
import { currentUserHasActiveBonusCycle } from "@/helpers/hasActiveBonusCycle";
import { ineligibleNote } from "@/site/promotions/PromoOfferCard";
import { currencyState } from "@/state/currencyState";
import { depositPromoIdState, setDepositPromo } from "@/state/depositPromoState";
import { userState } from "@/state/userState";
import type { tLedgerPromotion } from "@/types/tUserLedger";

/**
 * Promo code for the next deposit. Shows the code of the offer the wallet was
 * opened for; a typed code is looked up in the player's offers and, when it can
 * be claimed, attached to the next deposit (the deposit panel tells the backend).
 */
const AcceptPromoCode = () => {
  const t = useTranslations("Profile");
  const tPromo = useTranslations("PromotionsPage");
  const [promos, setPromos] = useState<tLedgerPromotion[] | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const promoId = depositPromoIdState.value;
  const userId = userState.value?.id ?? "";
  const currency = currencyState.value.unit;

  useEffect(() => {
    let alive = true;
    apiGetPromotions("NORMAL", userId, currency, 1, 100)
      .then((list) => {
        if (alive) setPromos((list?.promotions ?? []).filter((p) => p.isActive && isPlayerVisiblePromotion(p)));
      })
      .catch(() => {
        if (alive) setPromos([]);
      });
    return () => {
      alive = false;
    };
  }, [userId, currency]);

  const applied = promoId ? promos?.find((p) => String(p.id) === promoId) : undefined;

  // Fill in the code of the offer that is attached to the next deposit
  useEffect(() => {
    if (!applied) return;
    setCode(applied.code);
    setError("");
  }, [applied?.id]);

  const onApply = () => {
    const wanted = code.trim().toLowerCase();
    if (!wanted || !promos) return;
    const promo = promos.find((p) => p.code.toLowerCase() === wanted);
    if (!promo || !isDepositPromoType(promo.type)) return setError(t("promo_invalid"));
    if (currentUserHasActiveBonusCycle()) return setError(t("promo_active_bonus"));
    if (!promo.available) return setError(ineligibleNote(promo, tPromo));
    setError("");
    setDepositPromo(String(promo.id));
  };

  const onRemove = () => {
    setDepositPromo(undefined);
    setCode("");
    setError("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-row gap-2">
        <div className="relative flex-1">
          <input
            className={`h-10 w-full rounded-md border bg-[#1a2c38] px-3 font-mono text-sm uppercase text-white placeholder:font-sans placeholder:normal-case placeholder:text-[#557086] focus:outline-none ${
              applied ? "border-[var(--green-color)] pe-9" : error ? "border-red-400/70" : "border-[#2f4553] focus:border-[#1475e1]"
            }`}
            type="text"
            value={code}
            readOnly={!!applied}
            placeholder={t("Promo Code")}
            aria-invalid={!!error}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onApply();
            }}
          />
          {applied && (
            <Check size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--green-color)]" />
          )}
        </div>
        {applied ? (
          <button
            type="button"
            className="h-10 rounded-md border border-[#2f4553] px-4 text-sm font-semibold text-[#b1bad3] transition-colors hover:border-[#557086] hover:text-white"
            onClick={onRemove}
          >
            {t("promo_remove")}
          </button>
        ) : (
          <button
            type="button"
            className="h-10 rounded-md bg-[#1475e1] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0f62c2] disabled:opacity-60"
            onClick={onApply}
            disabled={!promos || !code.trim()}
          >
            {t("Apply")}
          </button>
        )}
      </div>
      {applied ? (
        <p className="text-xs text-[var(--green-color)]">{t("promo_applied", { name: applied.name })}</p>
      ) : (
        error && <p className="text-xs text-red-300">{error}</p>
      )}
    </div>
  );
};

export default AcceptPromoCode;
