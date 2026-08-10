import { apiWithdrawWithFinera } from "@/api/wallet/apiWithdrawWithFinera";
import { useTranslations } from "@/context/I18nContext";
import { validateCardPan } from "@/helpers/validateCardPan";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { userState } from "@/state/userState";
import { Button, Input } from "@heroui/react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-preact";
import { useCallback, useState } from "preact/hooks";
import { tFineraWithdrawMethod } from "@/api/wallet/apiGetPaymentProviders";

export default function FineraWithdraw({
  method,
}: {
  method: tFineraWithdrawMethod;
}) {
  const t = useTranslations("FineraWithdraw");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expireMonth, setExpireMonth] = useState("");
  const [expireYear, setExpireYear] = useState("");
  const [cardRefId, setCardRefId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
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
        balanceState.value?.[currency.code]?.cash?.balance ?? 0,
      );
      if (parsedAmount > availableBalance) {
        setError(t("Insufficient balance for this withdraw amount."));
        return;
      }

      const body: Parameters<typeof apiWithdrawWithFinera>[0] = {
        amount: parsedAmount,
        method,
      };

      if (method === "card") {
        const panError = validateCardPan(cardNumber);
        if (panError) {
          setError(panError);
          return;
        }
        body.credit_card_number = cardNumber.replace(/\D/g, "");
        body.card_printed_name = cardName.trim();
        body.expire_month = expireMonth.trim();
        body.expire_year = expireYear.trim();
      } else if (method === "card_ref") {
        if (!cardRefId.trim()) {
          setError(t("Card reference ID is required."));
          return;
        }
        body.destination_card_ref_id = cardRefId.trim();
      } else {
        if (!accountNumber.trim()) {
          setError(t("Account number is required."));
          return;
        }
        body.account_number = accountNumber.trim();
        body.account_name = accountName.trim() || undefined;
        body.routing_number = routingNumber.trim() || undefined;
      }

      setIsSubmitting(true);
      try {
        const res = await apiWithdrawWithFinera(body);
        if (res.success) {
          setSuccess(res.message || t("Withdraw request created successfully."));
          setAmount("");
          setCardNumber("");
          setCardRefId("");
          setAccountNumber("");
          return;
        }
        setError(res.message || t("Withdraw could not be created."));
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const d = err.response?.data as { message?: string } | undefined;
          setError(d?.message || t("Something went wrong."));
        } else {
          setError(t("Something went wrong."));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      accountName,
      accountNumber,
      amount,
      cardName,
      cardNumber,
      cardRefId,
      expireMonth,
      expireYear,
      method,
      routingNumber,
      t,
    ],
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

      {method === "card" ? (
        <>
          <Input
            label={t("Cardholder name")}
            value={cardName}
            onValueChange={setCardName}
            isRequired
          />
          <Input
            type={showCardNumber ? "text" : "password"}
            label={t("Card number")}
            value={cardNumber}
            onValueChange={(value) =>
              setCardNumber(value.replace(/[^\d\s-]/g, ""))
            }
            endContent={
              showCardNumber ? (
                <EyeOff
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setShowCardNumber(false)}
                />
              ) : (
                <Eye
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setShowCardNumber(true)}
                />
              )
            }
            isRequired
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t("Expire month")}
              value={expireMonth}
              onValueChange={setExpireMonth}
              isRequired
            />
            <Input
              label={t("Expire year")}
              value={expireYear}
              onValueChange={setExpireYear}
              isRequired
            />
          </div>
        </>
      ) : null}

      {method === "card_ref" ? (
        <Input
          label={t("Destination card reference ID")}
          value={cardRefId}
          onValueChange={setCardRefId}
          isRequired
        />
      ) : null}

      {method === "bank" ? (
        <>
          <Input
            label={t("Account number")}
            value={accountNumber}
            onValueChange={setAccountNumber}
            isRequired
          />
          <Input
            label={t("Account name")}
            value={accountName}
            onValueChange={setAccountName}
          />
          <Input
            label={t("Routing number")}
            value={routingNumber}
            onValueChange={setRoutingNumber}
          />
        </>
      ) : null}

      {error ? (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {success ? <p className="text-success text-sm">{success}</p> : null}

      <Button type="submit" color="primary" isLoading={isSubmitting}>
        {t("Submit withdraw")}
      </Button>
    </form>
  );
}
