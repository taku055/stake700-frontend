import { apiWithdrawWithAries } from "@/api/wallet/apiWithdrawWithAries";
import { useTranslations } from "@/context/I18nContext";
import { validateCardPan } from "@/helpers/validateCardPan";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { userState } from "@/state/userState";
import { Button, Input } from "@heroui/react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-preact";
import { useCallback, useState } from "preact/hooks";

const AriesWithdraw = () => {
  const t = useTranslations("AriesWithdraw");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = useCallback(
    async (e: Event) => {
      e.preventDefault();
      if (!userState.value?.id) {
        setError(t("Please login to withdraw."));
        return;
      }

      setError("");
      setSuccess("");

      const parsedAmount = Number(amount);
      if (!parsedAmount || parsedAmount <= 0) {
        setError(t("Please enter a valid amount."));
        return;
      }

      const currency = currencyState.value;
      const availableBalance = Number(
        balanceState.value?.[currency.code]?.cash?.balance ?? 0
      );
      if (parsedAmount > availableBalance) {
        setError(t("Insufficient balance for this withdraw amount."));
        return;
      }

      const panError = validateCardPan(cardNumber);
      if (panError) {
        setError(panError);
        return;
      }
      const panDigits = cardNumber.replace(/\D/g, "");

      setIsSubmitting(true);
      try {
        const res = await apiWithdrawWithAries({
          amount: parsedAmount,
          pan: panDigits,
        });

        if (res.status) {
          setSuccess(res.message || t("Withdraw request created successfully."));
          setAmount("");
          setCardNumber("");
          return;
        }

        setError(res.message || t("Withdraw could not be created."));
      } catch (err: unknown) {

        if (axios.isAxiosError(err)) {
          console.log(err.response);
          setError(t(err.response?.data.errorCode || "Something went wrong."));
        } else {
          setError(t("Something went wrong."));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      amount,
      cardNumber,
      userState.value?.id,
      currencyState.value,
      balanceState.value,
      t,
    ]
  );

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <Input
        type="number"
        label={t("Amount")}
        placeholder={t("Enter amount")}
        value={amount}
        onValueChange={(value) => setAmount(value.replace(/[^\d.]/g, ""))}
        min={0}
        step="any"
        isRequired
      />
      <Input
        type={showCardNumber ? "text" : "password"}
        label={t("Card number")}
        placeholder={t("Enter card number")}
        value={cardNumber}
        onValueChange={(value) => setCardNumber(value.replace(/[^\d\s-]/g, ""))}
        endContent={
          showCardNumber ? (
            <EyeOff
              className="w-5 h-5 text-default-500 transition-colors cursor-pointer"
              onClick={() => setShowCardNumber(false)}
            />
          ) : (
            <Eye
              className="w-5 h-5 text-default-500 transition-colors cursor-pointer"
              onClick={() => setShowCardNumber(true)}
            />
          )
        }
        maxLength={32}
        isRequired
      />
      {error && (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      )}
      {success && <p className="text-success text-sm">{success}</p>}
      <Button
        type="submit"
        color="primary"
        className="mt-2"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        {t("Submit withdraw")}
      </Button>
    </form>
  );
};

export default AriesWithdraw;
