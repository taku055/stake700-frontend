import { useCallback, useState } from "preact/hooks";
import { Button, Input } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { apiGetFineraSaleForm } from "@/api/wallet/apiGetFineraSaleForm";
import { localeState } from "@/state/localeState";
import { toast } from "@/helpers/toast";
import { resolveDepositPromoId } from "@/helpers/hasActiveBonusCycle";
import axios from "axios";

type FineraDepositProps = {
  type: "card" | "googlepay" | "applepay";
  minAmount?: number;
};

export default function FineraDeposit({
  type,
  minAmount = 1,
}: FineraDepositProps) {
  const t = useTranslations("UserBalancePage");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const methodLabel =
    type === "googlepay"
      ? t("Pay with Google Pay")
      : type === "applepay"
        ? t("Pay with Apple Pay")
        : t("Pay with card");

  const handleDeposit = useCallback(async () => {
    setError("");
    const num = Number.parseFloat(amount.replace(",", "."));
    if (!Number.isFinite(num) || num <= 0) {
      setError(t("Finera_invalid_amount"));
      return;
    }
    if (num < minAmount) {
      setError(
        t("Finera_amount_below_minimum", {
          amount: String(minAmount),
        }),
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const promoId = resolveDepositPromoId();
      const res = await apiGetFineraSaleForm(
        num,
        type,
        localeState.value || "en",
        promoId,
      );
      if (res.success && res.redirect_url) {
        window.location.assign(res.redirect_url);
      } else {
        const msg = t("Finera_redirect_failed");
        setError(msg);
        toast.error(msg);
      }
    } catch (err: unknown) {
      let message = t("Finera_error");
      if (axios.isAxiosError(err)) {
        const d = err.response?.data as { message?: string } | undefined;
        message = d?.message ?? err.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, minAmount, t, type]);

  const parsedAmount = Number.parseFloat(amount.replace(",", "."));
  const isBelowMinimum =
    amount.trim() !== "" &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount < minAmount;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto gap-6 py-2">
      <div className="text-center text-sm font-semibold text-white/90">
        Finera — {methodLabel}
      </div>

      <Input
        type="number"
        label={t("Amount")}
        placeholder={String(minAmount)}
        value={amount}
        onValueChange={setAmount}
        min={minAmount}
        step="any"
        isRequired
        isInvalid={isBelowMinimum || !!error}
        classNames={{ input: "text-start" }}
      />

      <p className="text-sm text-white/60">
        {t("Finera_minimum_deposit", { amount: String(minAmount) })}
      </p>

      {error || isBelowMinimum ? (
        <p className="text-danger text-sm" role="alert">
          {error ||
            t("Finera_amount_below_minimum", {
              amount: String(minAmount),
            })}
        </p>
      ) : null}

      <Button
        className="w-full bg-[var(--green-color)] text-white hover:bg-[var(--green-color)]/90"
        isLoading={isSubmitting}
        isDisabled={
          isSubmitting ||
          !amount.trim() ||
          !Number.isFinite(parsedAmount) ||
          parsedAmount < minAmount
        }
        onPress={handleDeposit}
      >
        {t("Deposit")}
      </Button>
    </div>
  );
}
