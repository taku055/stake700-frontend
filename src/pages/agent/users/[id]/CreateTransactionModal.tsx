import {
  apiAgentCreateUserTransaction,
  tSubuserCreateTxRes,
} from "@/api/agent/apiAgentCreateUserTransaction";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "preact/hooks";
import { FaComment, FaDollarSign } from "react-icons/fa";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import CurrencySelector from "@/components/CurrencySelector";
import { eTransactionCurrency } from "@/types/tTransaction";
import { tCurrencyBalance, tLedger } from "@/types/tCurrencyBalance";
import { cashDetailAmountForUnit } from "@/helpers/multipleBalance";

interface CreateTransactionModalProps {
  userBalance: tLedger[];
  agentBalance: (tCurrencyBalance | tLedger)[];
  userId: string;
  isDeposit: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (balance: tSubuserCreateTxRes) => void;
}

export default function CreateTransactionModal({
  userBalance,
  agentBalance,
  userId,
  isDeposit,
  isOpen,
  onClose,
  onCreated,
}: CreateTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [cash, setCash] = useState("");
  const [note, setNote] = useState("");
  const t = useTranslations("Agent");
  const toastT = useTranslations("ToastMessages");
  const [currency, setCurrency] = useState<eTransactionCurrency>(
    eTransactionCurrency.USD
  );

  useEffect(() => {
    setCash("");
    setNote("");
  }, [isOpen]);

  const onCreate = useCallback(async () => {
    if (!cash || isNaN(+cash) || +cash <= 0) {
      toast.error(t("Please enter a valid amount"));
      return;
    }

    const agentCurrencyBalance = cashDetailAmountForUnit(
      agentBalance,
      currency
    );
    const userCurrencyBalance = Number(
      userBalance.find((b) => b.currencyCode === currency)?.cashBalance ?? 0
    );

    if (
      (isDeposit && agentCurrencyBalance < +cash) ||
      (!isDeposit && userCurrencyBalance < +cash)
    ) {
      toast.error(toastT("validation.balance_low"));
      return;
    }

    try {
      setLoading(true);
      const balance = await apiAgentCreateUserTransaction(
        userId,
        currency,
        +cash,
        isDeposit,
        note
      );
      onCreated(balance);
      toast.success(toastT("success.transaction_created"));
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.error(ex.response);
        toast.error(ex.response?.data?.message?.message);
      } else {
        console.error(ex);
        toast.error(toastT("error.create_agent"));
      }
    }
    setLoading(false);
  }, [
    userId,
    cash,
    note,
    agentBalance,
    isDeposit,
    onCreated,
    userBalance,
    currency,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="bottom-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isDeposit ? t("Deposit") : t("Withdraw")}
            </ModalHeader>
            <ModalBody className="flex flex-col">
              <div className="flex items-center gap-2">
                <CurrencySelector
                  value={currency}
                  onChange={(currency) => setCurrency(currency)}
                />
                <Input
                  autoFocus
                  label={t("Amount")}
                  placeholder={t("Enter the amount")}
                  variant="bordered"
                  disabled={loading}
                  value={cash}
                  onChange={(e) =>
                    setCash((e.target as HTMLInputElement).value)
                  }
                  classNames={{
                    input: "text-[16px]",
                  }}
                />
              </div>
              <Input
                endContent={<FaComment size={20} />}
                label={t("Note")}
                placeholder={t("Enter the note")}
                variant="bordered"
                disabled={loading}
                value={note}
                onChange={(e) => setNote((e.target as HTMLInputElement).value)}
                classNames={{
                  input: "text-[16px]",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                {t("Close")}
              </Button>
              <Button color="primary" onPress={onCreate} isLoading={loading}>
                {isDeposit ? t("Deposit") : t("Withdraw")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
