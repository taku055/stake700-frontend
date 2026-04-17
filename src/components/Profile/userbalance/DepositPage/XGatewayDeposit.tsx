import { useCallback, useState } from "preact/hooks";
import { Button, Input } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { apiXGatewayCreateInvoice } from "@/api/wallet/apiXGatewayCreateInvoice";
import { toast } from "@/helpers/toast";
import axios from "axios";

const PAYMENT_LOGO_URL = "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/payment_logos/xgateway_logo.svg";

export default function XGatewayDeposit() {
  const t = useTranslations("UserBalancePage");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = useCallback(async () => {
    setError("");
    const num = Number.parseFloat(amount.replace(",", "."));
    if (!Number.isFinite(num) || num <= 0) {
      setError(t("XGateway_invalid_amount"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiXGatewayCreateInvoice(num);
      if (res.success && res.data) {
        window.open(res.data, "_blank", "noopener,noreferrer");
      } else {
        const msg = t("XGateway_invoice_failed");
        setError(msg);
        toast.error(msg);
      }
    } catch (err: unknown) {
      let message = t("XGateway_error");
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
        <img
          src={PAYMENT_LOGO_URL}
          alt=""
          className="h-12 w-auto max-w-full object-contain"
        />
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
