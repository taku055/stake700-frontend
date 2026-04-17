import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { Tabs, Tab, Button, DateRangePicker } from "@heroui/react";
import { tUser } from "@/types/tUser";
import { toast } from "@/helpers/toast";
import { apiAgentGetSubuser } from "@/api/agent/apiAgentGetSubuser";
import { apiAgentDeleteSubuser } from "@/api/agent/apiAgentDeleteSubuser";
import CreateTransactionModal from "./CreateTransactionModal";
import { userState } from "@/state/userState";
import {
  mapSubuserCreateTxUserToLedger,
  tSubuserCreateTxRes,
} from "@/api/agent/apiAgentCreateUserTransaction";
import TransactionsPage from "./TransactionsPage";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { apiAgentGetSubuserTransactionSum } from "@/api/agent/apiAgentGetSubuserTransactionSum";
import { useMediaQuery } from "usehooks-ts";
import { CURRENCY_LIST, mobileMediaQuery } from "@/config/constants";
import CasinoHistoryPage from "./CasinoHistoryPage";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "preact-iso";
import SportsbookHistoryPage from "./SportsbookHistoryPage";
import { eTransactionCurrency } from "@/types/tTransaction";
import CurrencySelector from "@/components/CurrencySelector";
import BackButton from "@/components/BackButton";
import { multipleBalanceLedger } from "@/helpers/multipleBalance";

const today = new Date();

interface IUserDetailPageProps {
  userId: string;
}

export default function UserDetailPage({ userId }: IUserDetailPageProps) {
  const pathname = useLocation();
  const [subuser, setSubuser] = useState<tUser>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [period, setPeriod] = useState({
    start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
    end: new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    ),
  });
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("Agent");
  const toastT = useTranslations("ToastMessages");
  const [currency, setCurrency] = useState<eTransactionCurrency>(
    eTransactionCurrency.USD
  );
  const currencySymbol = useMemo(
    () => CURRENCY_LIST.find((c) => c.unit === currency)?.symbol,
    [currency]
  );

  useEffect(() => {
    if (userState.value?.id) {
      (async () => {
        try {
          const res = await apiAgentGetSubuser(userId);
          setSubuser(res);
        } catch (ex) {
          toast.error(toastT("error.get_agent"));
          console.error(ex);
        }
      })();
    }
  }, [userId, userState.value?.id]);

  useEffect(() => {
    if (userState.value?.id) {
      (async () => {
        try {
          const res = await apiAgentGetSubuserTransactionSum(userId, {
            startDate: period.start.toDate(getLocalTimeZone()).getTime(),
            endDate:
              period.end.toDate(getLocalTimeZone()).getTime() + 86400000 - 1,
            currency,
          });
          setTotalDeposit(res.totalDeposit);
          setTotalWithdraw(res.totalWithdraw);
        } catch (ex) {
          toast.error(toastT("error.get_agent"));
          console.error(ex);
        }
      })();
    }
  }, [userId, period.start, period.end, userState.value?.id, currency]);

  const onDelete = useCallback(async () => {
    if (!window.confirm("Are you sure to delete?")) {
      return;
    }

    try {
      setLoadingDelete(true);
      const res = await apiAgentDeleteSubuser(userId);
      toast.success(toastT("success.user_removed"));
      pathname.route("/agent/users");
    } catch (ex) {
      toast.error(toastT("error.delete_agent"));
      console.error(ex);
    }
    setLoadingDelete(false);
  }, [userId]);

  const onTransaction = (deposit: boolean) => {
    setIsDeposit(deposit);
    setOpenModal(true);
  };

  const onCreatedTransaction = (balance: tSubuserCreateTxRes) => {
    setSubuser((prev) => {
      if (!prev) return prev;

      const nextLedgers = [...(prev.ledgers ?? [])];
      const i = nextLedgers.findIndex(
        (c) => c.currencyCode === balance.user.currencyCode
      );
      const existing = i !== -1 ? nextLedgers[i] : null;
      const ledger = mapSubuserCreateTxUserToLedger(balance.user, existing);

      if (i !== -1) {
        nextLedgers[i] = ledger;
      } else {
        nextLedgers.push(ledger);
      }

      return {
        ...prev,
        ledgers: nextLedgers,
      };
    });

    if (userState.value?.id) {
      const newCashDetails = [...userState.value.cashDetails];
      const i = newCashDetails.findIndex((c) =>
        "currencyCode" in c
          ? c.currencyCode === balance.agent.currency
          : c.currency === balance.agent.currency
      );

      if (i !== -1) {
        newCashDetails[i] = balance.agent;
      } else {
        newCashDetails.push(balance.agent);
      }

      userState.value = {
        ...userState.value,
        cashDetails: newCashDetails,
      };
    }

    setTotalDeposit(balance.userStatistics.totalDeposit);
    setTotalWithdraw(balance.userStatistics.totalWithdraw);

    setOpenModal(false);
  };

  return (
    <div className="flex w-full flex-col p-2 md:p-4">
      <div className="flex gap-4 mb-4 ml-2 items-center flex-wrap text-[12px] md:text-[14px]">
        <BackButton href="/agent/users" />
        <div className="flex">
          <label className="mr-1">{t("Id")}</label>
          <span className="text-white">{subuser?.id}</span>
        </div>
        <div className="flex">
          <label className="mr-1">{t("Name")}</label>
          <span className="text-white">{subuser?.userName}</span>
        </div>
        <div className="flex">
          <label className="mr-1">{t("Balance")}</label>
          <span className="text-white">
            {multipleBalanceLedger(subuser?.ledgers ?? [])}
          </span>
        </div>
        <DateRangePicker
          label={t("Select period")}
          value={period}
          onChange={(e) => {
            if (e) {
              setPeriod(e);
            }
          }}
          visibleMonths={isMobile ? 1 : 3}
        />
        <CurrencySelector
          value={currency}
          onChange={(currency) => setCurrency(currency)}
        />
        <div className="flex">
          <label className="mr-1">{t("Total Deposit")}</label>
          <span className="text-white">
            {currencySymbol}
            {totalDeposit || 0}
          </span>
        </div>
        <div className="flex">
          <label className="mr-1">{t("Total Withdraw")}</label>
          <span className="text-white">
            {currencySymbol}
            {totalWithdraw || 0}
          </span>
        </div>
        <div className="flex ml-auto gap-2 mr-auto md:mr-0">
          <Button color="primary" size="sm" onPress={() => onTransaction(true)}>
            {t("Deposit")}
          </Button>
          <Button
            color="success"
            size="sm"
            onPress={() => onTransaction(false)}
          >
            {t("Withdraw")}
          </Button>
          <Button
            color="danger"
            size="sm"
            onPress={onDelete}
            isLoading={loadingDelete}
          >
            {t("Delete Agent")}
          </Button>
        </div>
      </div>
      <Tabs aria-label="Options">
        <Tab key="transactions" title={t("Transactions")}>
          <TransactionsPage
            startDate={period.start.toDate(getLocalTimeZone())}
            endDate={period.end.toDate(getLocalTimeZone())}
            userId={userId}
          />
        </Tab>
        <Tab key="Casino History" title={t("Casino History")}>
          <CasinoHistoryPage
            startDate={period.start.toDate(getLocalTimeZone())}
            endDate={period.end.toDate(getLocalTimeZone())}
            userId={userId}
          />
        </Tab>
        <Tab key="Sportsbook History" title={t("Sportsbook History")}>
          <SportsbookHistoryPage
            startDate={period.start.toDate(getLocalTimeZone())}
            endDate={period.end.toDate(getLocalTimeZone())}
            userId={userId}
          />
        </Tab>
      </Tabs>

      <CreateTransactionModal
        userBalance={subuser?.ledgers ?? []}
        agentBalance={userState.value?.cashDetails ?? []}
        userId={userId}
        isDeposit={isDeposit}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={onCreatedTransaction}
      />
    </div>
  );
}
