import { useCallback, useState } from "preact/hooks";
import { Button, Input } from "@heroui/react";
import axios from "axios";
import { apiCreateEpayclubDeposit } from "@/api/wallet/apiEpayclub";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";

function getCheckoutUrl(res: Awaited<ReturnType<typeof apiCreateEpayclubDeposit>>) {
  const redirectUrl = res.redirect_url ?? res.checkout_url ?? res.data?.redirect_url ?? res.data?.checkout_url;
  if (redirectUrl) {
    return redirectUrl;
  }

  const reference = res.reference ?? res.data?.reference;
  const checkoutToken = res.checkoutToken ?? res.data?.checkoutToken;
  if (!reference || !checkoutToken) {
    return "";
  }

  const url = new URL("/payment/epayclub/card/checkout", window.location.origin);
  url.searchParams.set("reference", reference);
  url.searchParams.set("checkoutToken", checkoutToken);
  return url.toString();
}

export default function EpayclubDeposit() {
  const t = useTranslations("UserBalancePage");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = useCallback(async () => {
    setError("");
    const num = Number.parseFloat(amount.replace(",", "."));
    if (!Number.isFinite(num) || num <= 0) {
      setError(t("EPayClub_invalid_amount"));
      return;
    }

    setIsSubmitting(true);
    try {
      const promoId = new URLSearchParams(window.location.search).get("promo") ?? undefined;
      const res = await apiCreateEpayclubDeposit(num, promoId);
      const checkoutUrl = getCheckoutUrl(res);

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      const msg = res.message || t("EPayClub_checkout_failed");
      setError(msg);
      toast.error(msg);
    } catch (err: unknown) {
      let message = t("EPayClub_error");
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
  }, [amount, t]);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto gap-6 py-2">
      <div className="flex justify-center">
        <div className="flex min-w-[min(100%,280px)] flex-col items-center justify-center rounded-lg border border-emerald-400/35 bg-[#0e1824] px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-[22px] font-bold leading-none text-white">
            ePay<span className="text-[var(--green-color)]">Club</span>
          </span>
          <span className="mt-2 text-sm font-semibold text-white/75">
            {t("EPayClub card checkout")}
          </span>
        </div>
      </div>

      <Input
        type="number"
        label={t("Amount")}
        placeholder="0"
        value={amount}
        onValueChange={setAmount}
        min={0}
        step="any"
        isRequired
        classNames={{ input: "text-start" }}
      />

      {error ? (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        className="w-full bg-[var(--green-color)] text-white hover:bg-[var(--green-color)]/90"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        onPress={handleDeposit}
      >
        {t("Deposit")}
      </Button>
    </div>
  );
}
