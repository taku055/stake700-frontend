import { useCallback, useState } from "preact/hooks";
import { Button, Input } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { apiGetNeonpaySaleForm } from "@/api/wallet/apiGetNeonpaySaleForm";
import { localeState } from "@/state/localeState";
import { toast } from "@/helpers/toast";
import axios from "axios";

function NeonpayLogo() {
  return (
    <div
      className="flex justify-center select-none"
      aria-hidden
    >
      <div className="relative flex items-center justify-center rounded-xl px-8 py-2.5 border border-cyan-400/45 bg-gradient-to-br from-[#0c1628]/90 to-[#0a1220]/95 shadow-[0_0_24px_rgba(34,211,238,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <span className="text-[22px] font-bold tracking-tight leading-none font-sans">
          <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.75)]">Neon</span>
          <span className="text-white/95">pay</span>
        </span>
      </div>
    </div>
  );
}

export default function NeonpayDeposit() {
  const t = useTranslations("UserBalancePage");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = useCallback(async () => {
    setError("");
    const num = Number.parseFloat(amount.replace(",", "."));
    if (!Number.isFinite(num) || num <= 0) {
      setError(t("Neonpay_invalid_amount"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiGetNeonpaySaleForm(num, localeState.value || "en");
      if (res.success && res.redirect_url) {
        window.open(res.redirect_url, "_blank", "noopener,noreferrer");
      } else {
        const msg = t("Neonpay_redirect_failed");
        setError(msg);
        toast.error(msg);
      }
    } catch (err: unknown) {
      let message = t("Neonpay_error");
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
      <NeonpayLogo />

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
        color="primary"
        className="w-full"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        onPress={handleDeposit}
      >
        {t("Deposit")}
      </Button>
    </div>
  );
}
