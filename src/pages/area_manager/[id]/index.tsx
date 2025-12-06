import { useCallback, useEffect, useState } from "preact/hooks";
import { Tabs, Tab, Button } from "@heroui/react";
import { tAgent } from "@/types/tAgent";
import TransactionsPage from "./TransactionsPage";
import { toast } from "@/helpers/toast";
import { apiAdminDeleteAgent } from "@/api/agent/apiAdminDeleteAgent";
import CreateTransactionModal from "./CreateTransactionModal";
import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import { userState } from "@/state/userState";
import { apiAdminChangePasswordAgent } from "@/api/agent/apiAdminChangePasswordAgent";
import { apiAdminGetSubAgent } from "@/api/agent/area_manager/apiAdminGetSubAgent";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "preact-iso";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { tCurrencyBalance } from "@/types/tCurrencyBalance";
import { multipleBalance } from "@/helpers/multipleBalance";
import BackButton from "@/components/BackButton";
import { tSuperAgentTransaction } from "@/types/tSuperAgentTransaction";

interface IAgentDetailPageProps {
  agentId: string;
}

export default function AgentDetailPage({ agentId }: IAgentDetailPageProps) {
  const [agent, setAgent] = useState<tAgent>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const location = useLocation();
  const toastT = useTranslations("ToastMessages");

  useEffect(() => {
    if (!userState.value?.id) {
      return;
    }

    (async () => {
      try {
        const res = await apiAdminGetSubAgent(userState.value?.id!, agentId);
        setAgent(res);
      } catch (ex) {
        toast.error(toastT("error.get_agent"));
        console.error(ex);
      }
    })();
  }, [agentId, userState.value?.id]);

  const onDelete = useCallback(async () => {
    if (!window.confirm("Are you sure to delete?")) {
      return;
    }

    try {
      setLoadingDelete(true);
      const res = await apiAdminDeleteAgent(agentId);
      toast.success(toastT("success.agent_removed"));
      location.route("/superagent/agents");
    } catch (ex) {
      toast.error(toastT("error.delete_agent"));
      console.error(ex);
    }
    setLoadingDelete(false);
  }, [agentId]);

  const onTransaction = (deposit: boolean) => {
    setIsDeposit(deposit);
    setOpenModal(true);
  };

  const onCreatedTransaction = (
    newAreaManager: tCurrencyBalance,
    newSuperAgent: tCurrencyBalance,
    transaction: tSuperAgentTransaction
  ) => {
    setAgent((prev) => {
      if (!prev) return prev;
      const newCashDetails = [...prev.cashDetails];
      const i = newCashDetails.findIndex(
        (c) => c.currency === newSuperAgent.currency
      );
      if (i !== -1) {
        newCashDetails[i] = newSuperAgent;
      } else {
        newCashDetails.push(newSuperAgent);
      }
      return { ...prev, cashDetails: newCashDetails };
    });

    if (userState.value?.id) {
      const newCashDetails = [...userState.value.cashDetails];
      const i = newCashDetails.findIndex(
        (c) => c.currency === newAreaManager.currency
      );
      if (i !== -1) {
        newCashDetails[i] = newAreaManager;
      } else {
        newCashDetails.push(newAreaManager);
      }

      userState.value = {
        ...userState.value,
        cashDetails: newCashDetails,
      };
    }

    setOpenModal(false);
  };

  const onChangePassword = async () => {
    const password = window.prompt("Please input the new password");
    if (!password) {
      if (password !== null) {
        toast.error(toastT("validation.password_empty_agent"));
      }
      return;
    }

    try {
      const res = await apiAdminChangePasswordAgent(agentId, password);
      toast.success(toastT("success.password_changed_agent"));
      setAgent((p) => (p ? { ...p, ...res } : p));
    } catch (error) {
      toast.error(toastT("error.change_password"));
      console.error(error);
    }
  };

  return (
    <div className="flex w-full flex-col p-4">
      <div className="flex md:gap-4 gap-2 mb-4 ml-2 items-center flex-wrap text-[12px] md:text-[14px]">
        <BackButton href="/area_manager" />
        <div className="flex">
          <label className="mr-1">Name</label>
          <span className="text-white">{agent?.userName}</span>
        </div>
        <div className="flex">
          <label className="mr-1">Balance</label>
          <span className="text-white">
            {multipleBalance(agent?.cashDetails || [])}
          </span>
        </div>
        <div className="flex">
          <label className="mr-1">Total Deposit</label>
          <span className="text-white">
            {DEFAULT_CURRENCY_SYMBOL}
            {agent?.totalDeposit || 0}
          </span>
        </div>
        <div className="flex">
          <label className="mr-1">Total Withdraw</label>
          <span className="text-white">
            {DEFAULT_CURRENCY_SYMBOL}
            {agent?.totalWithdraw || 0}
          </span>
        </div>
        <div className="flex items-center">
          <label className="mr-1">Password</label>
          <span className="text-white mr-1">{agent?.password1 || ""}</span>
          <Button
            size="sm"
            className="px-2 min-w-[unset]"
            onClick={onChangePassword}
          >
            ...
          </Button>
        </div>
        <div className="flex ml-auto gap-2">
          <Button color="primary" size="sm" onClick={() => onTransaction(true)}>
            Deposit
          </Button>
          <Button
            color="success"
            size="sm"
            onClick={() => onTransaction(false)}
          >
            Withdraw
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={onDelete}
            isLoading={loadingDelete}
          >
            Delete Agent
          </Button>
        </div>
      </div>
      <Tabs aria-label="Options">
        <Tab key="transactions" title="Transactions">
          <TransactionsPage agentId={agentId} />
        </Tab>
      </Tabs>

      <CreateTransactionModal
        agentBalance={agent?.cashDetails || []}
        agentId={agentId}
        isDeposit={isDeposit}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={onCreatedTransaction}
      />
    </div>
  );
}
