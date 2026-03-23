import { apiWithdrawWithAries } from "@/api/wallet/apiWithdrawWithAries";
import { validateCardPan } from "@/helpers/validateCardPan";
import { userState } from "@/state/userState";
import { Button, Input } from "@heroui/react";
import { useCallback, useState } from "preact/hooks";

const AriesWithdraw = () => {
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = useCallback(
    async (e: Event) => {
      e.preventDefault();
      if (!userState.value?.id) {
        setError("Please login to withdraw.");
        return;
      }

      setError("");
      setSuccess("");

      const parsedAmount = Number(amount);
      if (!parsedAmount || parsedAmount <= 0) {
        setError("Please enter a valid amount.");
        return;
      }
      const availableBalance = (userState.value?.cashDetails ?? []).reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      );
      if (parsedAmount > availableBalance) {
        setError("Insufficient balance for this withdraw amount.");
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
          setSuccess(res.message || "Withdraw request created successfully.");
          setAmount("");
          setCardNumber("");
          return;
        }

        setError(res.message || "Withdraw could not be created.");
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Something went wrong.";
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [amount, cardNumber, userState.value?.id, userState.value?.cashDetails]
  );

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <Input
        type="number"
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onValueChange={(value) => setAmount(value.replace(/[^\d.]/g, ""))}
        min={0}
        step="any"
        isRequired
      />
      <Input
        type="text"
        label="Card number"
        placeholder="Enter card number"
        value={cardNumber}
        onValueChange={(value) =>
          setCardNumber(value.replace(/[^\d\s-]/g, ""))
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
        Submit withdraw
      </Button>
    </form>
  );
};

export default AriesWithdraw;
