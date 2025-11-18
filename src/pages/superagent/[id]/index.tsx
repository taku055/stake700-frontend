import { useCallback, useEffect, useState } from "preact/hooks";
import { Tabs, Tab, Button } from "@heroui/react";
import { tAgent } from "@/types/tAgent";
import UsersPage from "./UsersPage";
import TransactionsPage from "./TransactionsPage";
import { toast } from "@/helpers/toast";
import { apiAdminDeleteAgent } from "@/api/agent/apiAdminDeleteAgent";
import CreateTransactionModal from "./CreateTransactionModal";
import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import { userState } from "@/state/userState";
import { apiAdminChangePasswordAgent } from "@/api/agent/apiAdminChangePasswordAgent";
import { apiAdminGetSubAgent } from "@/api/agent/apiAdminGetSubAgent";
import AgentTransactionsPage from "./AgentTransactionsPage";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "preact-iso";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

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
        const res = await apiAdminGetSubAgent(agentId);
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
    newAgent: tAgent,
    newSuperagent: tAgent,
    statistics: tTransactionStatistics
  ) => {
    setAgent((prev) =>
      prev ? { ...prev, cash: newAgent.cash, ...statistics } : undefined
    );
    if (userState.value?.isSuperAgent) {
      userState.value = {
        ...userState.value,
        cash: newSuperagent.cash,
        ...statistics,
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
        <div className="flex">
          <label className="mr-1">Name</label>
          <span className="text-white">{agent?.userName}</span>
        </div>
        <div className="flex">
          <label className="mr-1">Balance</label>
          <span className="text-white">
            {DEFAULT_CURRENCY_SYMBOL}
            {agent?.cash || 0}
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
        <Tab key="users" title="Users">
          <UsersPage agentId={agentId} />
        </Tab>
        <Tab key="transactions" title="Transactions">
          <TransactionsPage agentId={agentId} />
        </Tab>
        <Tab key="agenttransactions" title="Agent Transactions">
          <AgentTransactionsPage agentId={agentId} />
        </Tab>
      </Tabs>

      <CreateTransactionModal
        balance={agent?.cash || 0}
        agentId={agentId}
        isDeposit={isDeposit}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={onCreatedTransaction}
      />
    </div>
  );
}
