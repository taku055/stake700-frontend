import { useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import Loader from "@/components/Loader";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  DateRangePicker,
} from "@heroui/react";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { useMediaQuery } from "usehooks-ts";
import moment from "moment";
import { apiGetPaymentTransaction } from "@/api/transaction/apiGetPaymentTransaction.ts.ts";
import { tTransaction } from "@/types/tTransaction";
import { eTransactionType } from "@/types/tTransaction";
import { userState } from "@/state/userState";

const today = new Date();

/** Single request: backend may cap; adjust if needed. */
const FETCH_ALL_LENGTH = 100_000;

const transactionTypeLabel = (
  t: ReturnType<typeof useTranslations>,
  type: eTransactionType
) => t(`txn_type_${type}`, undefined, String(type));

/** Platform IDs use dots (e.g. deposit.crypto); keys use underscores to avoid nested i18n paths. */
const transactionPlatformLabel = (
  t: ReturnType<typeof useTranslations>,
  platform: string
) => {
  const slug = platform.replace(/\./g, "_");
  return t(`txn_platform_${slug}`, undefined, platform);
};

const TransactionHistoryPage = () => {
  const t = useTranslations("UserBalancePage");
  const tBet = useTranslations("BetHistory");
  const [data, setData] = useState<tTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [period, setPeriod] = useState({
    start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
    end: new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    ),
  });
  const isMobile = useMediaQuery("(max-width: 599px)");

  useEffect(() => {
    if (!userState.value?.id) return;

    (async () => {
      setLoading(true);
      try {
        const res = await apiGetPaymentTransaction({
          offset: 0,
          length: FETCH_ALL_LENGTH,
          startDate: period.start.toDate(getLocalTimeZone()).getTime(),
          endDate:
            period.end.toDate(getLocalTimeZone()).getTime() + 86400000 - 1,
        });
        setData(res.data);
        setTotal(res.total);
      } catch (ex) {
        console.error(ex);
      }
      setLoading(false);
    })();
  }, [period.start, period.end, userState.value?.id]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-col gap-2 p-4 flex-1 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between md:flex-row flex-col gap-2 shrink-0">
          <div className="flex text-[12px]">
            {tBet("total_history", { total: String(total) })}
          </div>
          <DateRangePicker
            className="w-full md:w-[300px] md:ml-auto md:flex-[unset]"
            label={tBet("Select period")}
            value={period}
            onChange={(value) => {
              if (value) {
                setPeriod({ start: value.start, end: value.end });
              }
            }}
            visibleMonths={isMobile ? 1 : 3}
          />
        </div>
        {loading ? (
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto rounded-medium border border-[#FFFFFF1A] max-h-[min(70vh,calc(80vh-12rem))]">
            <Table removeWrapper aria-label={t("Transaction History")}>
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>{tBet("Type")}</TableColumn>
                <TableColumn>{tBet("Provider")}</TableColumn>
                <TableColumn>{t("Amount")}</TableColumn>
                <TableColumn>{t("Bonus", undefined, "Bonus")}</TableColumn>
                <TableColumn>{tBet("Currency")}</TableColumn>
                <TableColumn>{tBet("Date")}</TableColumn>
              </TableHeader>
              <TableBody>
                {data.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-[11px]">
                      {e.id}
                    </TableCell>
                    <TableCell>
                      {e.type === eTransactionType.deposit ||
                      e.type === eTransactionType.user_deposit ? (
                        <span className="text-white bg-primary rounded-xl p-1 text-[10px]">
                          {transactionTypeLabel(t, e.type)}
                        </span>
                      ) : e.type === eTransactionType.withdrawal ||
                        e.type === eTransactionType.user_withdrawal ? (
                        <span className="text-black bg-success rounded-xl p-1 text-[10px]">
                          {transactionTypeLabel(t, e.type)}
                        </span>
                      ) : (
                        <span className="text-default-600 bg-default-100 rounded-xl p-1 text-[10px]">
                          {transactionTypeLabel(t, e.type)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[140px] truncate text-[12px]">
                      {transactionPlatformLabel(t, e.platform)}
                    </TableCell>
                    <TableCell>{Number(e.cash || 0)}</TableCell>
                    <TableCell>{Number(e.bonus || 0)}</TableCell>
                    <TableCell>
                      <span className="text-black bg-success rounded-xl p-1 text-[10px]">
                        {e.currency}
                      </span>
                    </TableCell>
                    <TableCell>
                      {moment(e.createdAt).format("YYYY-MM-DD HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
