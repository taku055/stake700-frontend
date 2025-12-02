import { useEffect, useMemo, useState } from "preact/hooks";
import Loader from "@/components/Loader";
import {
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  DateRangePicker,
} from "@heroui/react";
import moment from "moment";
import { apiAdminGetAgentTransactions } from "@/api/agent/apiAdminGetAgentTransactions";
import { tAgentTransaction } from "@/types/tAgentTransaction";
import { eTransactionType } from "@/types/tTransaction";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { useMediaQuery } from "usehooks-ts";
import { CURRENCY_LIST, DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { eTransactionCurrency } from "@/types/tTransaction";
import CurrencySelector from "@/components/CurrencySelector";
import { tCurrencyBalance } from "@/types/tCurrencyBalance";

const today = new Date();

interface IAgentTransactionsPageProps {
  agentId: string;
}

export default function AgentTransactionsPage({
  agentId,
}: IAgentTransactionsPageProps) {
  const [data, setData] = useState<tAgentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const [userWithdraw, setUserWithdraw] = useState(0);
  const [userDeposit, setUserDeposit] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState({
    start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
    end: new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    ),
  });
  const isMobile = useMediaQuery("(max-width: 599px)");

  const [currency, setCurrency] = useState<eTransactionCurrency>(
    eTransactionCurrency.USD
  );
  const currencySymbol = useMemo(
    () => CURRENCY_LIST.find((c) => c.unit === currency)?.symbol,
    [currency]
  );

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await apiAdminGetAgentTransactions(agentId, {
          offset: (currentPage - 1) * 10,
          length: 10,
          startDate: period.start.toDate(getLocalTimeZone()).getTime(),
          endDate:
            period.end.toDate(getLocalTimeZone()).getTime() + 86400000 - 1,
          currency,
        });
        setData(res.data);
        setTotal(res.total);
        setDeposit(res.summarized?.totalDeposit || 0);
        setWithdraw(res.summarized?.totalWithdraw || 0);
        setUserWithdraw(res.summarized?.totalUserWithdraw || 0);
        setUserDeposit(res.summarized?.totalUserDeposit || 0);
      } catch (ex) {
        console.error(ex);
      }

      setLoading(false);
    })();
  }, [currentPage, period.start, period.end, currency]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 md:justify-between">
        <div className="flex gap-4 items-center text-[12px] md:text-[14px]">
          <div className="flex">
            <label className="mr-1">Admin Deposited</label>
            <span className="text-white">
              {currencySymbol}
              {deposit}
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">Admin Withdrawed</label>
            <span className="text-white">
              {currencySymbol}
              {withdraw}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center text-[12px] md:text-[14px]">
          <div className="flex">
            <label className="mr-1">Deposited to users</label>
            <span className="text-white">
              {currencySymbol}
              {userWithdraw}
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">Withdrawed from users</label>
            <span className="text-white">
              {currencySymbol}
              {userDeposit}
            </span>
          </div>
        </div>
        <DateRangePicker
          className="flex-1 md: ml-auto md:w-[300px] md:flex-[unset]"
          label="Select period"
          value={period}
          onChange={(value) => {
            if (value) {
              setPeriod({ start: value.start, end: value.end });
            }
          }}
          visibleMonths={isMobile ? 1 : 3}
        />
        <CurrencySelector
          value={currency}
          onChange={(currency) => setCurrency(currency)}
        />
      </div>
      <div className="flex items-center justify-between md:flex-row flex-col gap-2 p-4">
        <div className="flex text-[12px]">Total: {total}</div>
        <Pagination
          showControls
          total={Math.ceil(total / 10)}
          color="success"
          radius="full"
          page={currentPage}
          onChange={setCurrentPage}
          isCompact
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Table removeWrapper aria-label="Agent transactions">
          <TableHeader>
            <TableColumn>Type</TableColumn>
            <TableColumn>Cash</TableColumn>
            <TableColumn>Created At</TableColumn>
            <TableColumn>Note</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  {e.transactionType === eTransactionType.deposit ? (
                    <span className="text-white bg-primary rounded-xl p-1 text-[10px]">
                      {e.transactionType}
                    </span>
                  ) : (
                    <span className="text-black bg-success rounded-xl p-1 text-[10px]">
                      {e.transactionType}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {currencySymbol}
                  {e.cash}
                </TableCell>
                <TableCell>
                  {moment(e.createdAt).format("YYYY-MM-DD HH:mm")}
                </TableCell>
                <TableCell>{e.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
