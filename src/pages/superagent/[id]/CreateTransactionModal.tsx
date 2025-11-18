import { apiAdminCreateSuperTransaction } from "@/api/agent/apiAdminCreateSuperTransaction";
import { userState } from "@/state/userState";
import { tAgent } from "@/types/tAgent";
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
import { FaComment, FaDollarSign } from "react-icons/fa";
import { toast } from "@/helpers/toast";

import { useTranslations } from "@/context/I18nContext";
import { Button } from "@heroui/react";

interface CreateTransactionModalProps {
  agentId: string;
  isDeposit: boolean;
  isOpen: boolean;
  balance: number;
  onClose: () => void;
  onCreated: (
    newAgent: tAgent,
    newSuperagent: tAgent,
    statistics: tTransactionStatistics
  ) => void;
}

export default function CreateTransactionModal({
  agentId,
  isDeposit,
  isOpen,
  balance,
  onClose,
  onCreated,
}: CreateTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [cash, setCash] = useState("");
  const [note, setNote] = useState("");
  const toastT = useTranslations("ToastMessages");

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

    if (!isDeposit && balance < +cash) {
      toast.error(toastT("validation.balance_low"));
      return;
    }

    try {
      setLoading(true);
      const res = await apiAdminCreateSuperTransaction(
        agentId,
        +cash,
        isDeposit,
        note,
        userState.value.id!
      );
      onCreated(res.newAgent, res.newSuperagent, res.statistics);
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
  }, [agentId, cash, note]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent  className="bg-[var(--background)]">
        <ModalHeader className="flex flex-col gap-1">
          {isDeposit ? "Deposit" : "Withdraw"}
        </ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <Input
            autoFocus
            endContent={<FaDollarSign size={16} />}
            label="Amount"
            placeholder="Enter the amount"
            variant="bordered"
            disabled={loading}
            value={cash}
            onChange={(e) => setCash((e.target as HTMLInputElement).value)}
          />
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
