import { apiAdminCreateSuperTransaction } from "@/api/agent/area_manager/apiAdminCreateSuperTransaction";
import { userState } from "@/state/userState";
import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@/components/common";
import axios from "axios";
import { useCallback, useEffect, useState } from "preact/hooks";
import { FaComment } from "react-icons/fa";
import { toast } from "@/helpers/toast";

import { useTranslations } from "@/context/I18nContext";
import { Button } from "@heroui/react";
import { eTransactionCurrency } from "@/types/tTransaction";
import CurrencySelector from "@/components/CurrencySelector";
import { tCurrencyBalance } from "@/types/tCurrencyBalance";
import { cashDetailAmountForUnit } from "@/helpers/multipleBalance";
import { tSuperAgentTransaction } from "@/types/tSuperAgentTransaction";

interface CreateTransactionModalProps {
  agentId: string;
  isDeposit: boolean;
  isOpen: boolean;
  agentBalance: tCurrencyBalance[];
  onClose: () => void;
  onCreated: (
    newAgent: tCurrencyBalance,
    newSuperagent: tCurrencyBalance,
    transaction: tSuperAgentTransaction
  ) => void;
}

export default function CreateTransactionModal({
  agentId,
  isDeposit,
  isOpen,
  agentBalance,
  onClose,
  onCreated,
}: CreateTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [cash, setCash] = useState("");
  const [note, setNote] = useState("");
  const toastT = useTranslations("ToastMessages");
  const [currency, setCurrency] = useState<eTransactionCurrency>(
    eTransactionCurrency.USD
  );

  useEffect(() => {
    setCash("");
    setNote("");
  }, [isOpen]);

  const onCreate = useCallback(async () => {
    if (!userState.value?.id) {
      toast.error(toastT("error.login_first"));
      return;
    }

    if (!cash || isNaN(+cash) || +cash <= 0) {
      toast.error(toastT("validation.valid_amount"));
      return;
    }

    const superagentCurrencyBalance = cashDetailAmountForUnit(
      userState.value.cashDetails,
      currency
    );
    const agentCurrencyBalance =
      Number(agentBalance.find((b) => b.currency === currency)?.amount ?? 0);

    if (!isDeposit && agentCurrencyBalance < +cash) {
      toast.error(toastT("validation.balance_low"));
      return;
    }

    if (isDeposit && superagentCurrencyBalance < +cash) {
      toast.error(toastT("validation.balance_low"));
      return;
    }

    try {
      setLoading(true);
      const res = await apiAdminCreateSuperTransaction(
        agentId,
        currency,
        +cash,
        isDeposit,
        note,
        userState.value.id!
      );
      onCreated(res.newAreaManager, res.newSuperAgent, res.transaction);
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
  }, [agentId, cash, note, currency]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-[var(--background)]">
        <ModalHeader className="flex flex-col gap-1">
          {isDeposit ? "Deposit" : "Withdraw"}
        </ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CurrencySelector
              value={currency}
              onChange={(currency) => setCurrency(currency)}
            />
            <Input
              autoFocus
              label="Amount"
              placeholder="Enter the amount"
              variant="bordered"
              disabled={loading}
              value={cash}
              onChange={(e) => setCash((e.target as HTMLInputElement).value)}
            />
          </div>
          <Input
            endContent={<FaComment size={16} />}
            label="Note"
            placeholder="Enter the note"
            variant="bordered"
            disabled={loading}
            value={note}
            onChange={(e) => setNote((e.target as HTMLInputElement).value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={onCreate} isLoading={loading}>
            {isDeposit ? "Deposit" : "Withdraw"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
