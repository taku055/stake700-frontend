import { useEffect, useState } from "preact/hooks";
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
  Chip,
} from "@heroui/react";
import moment from "moment";
import { useMediaQuery } from "usehooks-ts";
import { userState } from "@/state/userState";
import { apiAgentGetTransactions } from "@/api/agent/agent/apiAgentGetTransactions";
import { CalendarDate } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";
import { tAgentTransaction } from "@/types/tAgentTransaction";
import { eTransactionType } from "@/types/tTransaction";

const today = new Date();

export default function Transactions() {
  const [data, setData] = useState<tAgentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery("(max-width: 599px)");
  const [period, setPeriod] = useState<RangeValue<CalendarDate> | null>({
    start: new CalendarDate(today.getUTCFullYear(), today.getUTCMonth() + 1, 1),
    end: new CalendarDate(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1,
      today.getUTCDate()
    ),
  });

  useEffect(() => {
    if (!userState.value?.id) {
      return;
    }

    (async () => {
      setLoading(true);

      try {
        const res = await apiAgentGetTransactions({
          offset: (currentPage - 1) * 10,
          length: 10,
          startDate: period!.start?.toDate("UTC").getTime(),
          endDate: period!.end?.toDate("UTC").getTime() + 86400000 - 1,
        });
        setData(res.data);
        setTotal(res.total);
      } catch (ex) {
        console.error(ex);
      }

      setLoading(false);
    })();
  }, [currentPage, period?.start, period?.end]);

  return (
    <div className="flex w-full flex-col justify-center gap-2">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Area Manager&apos;s Transactions</h1>
      </div>
      <div className="flex items-center md:flex-row flex-col gap-2 w-full">
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
        <DateRangePicker
          className="ml-auto w-full md:w-[300px]"
          label="Select period"
          value={period}
          onChange={setPeriod}
          visibleMonths={isMobile ? 1 : 3}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Table
          removeWrapper
          aria-label="Agents"
          className="w-full overflow-x-auto"
        >
          <TableHeader>
            <TableColumn width={100}>Id</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Currency</TableColumn>
            <TableColumn>Cash</TableColumn>
            <TableColumn>Created At</TableColumn>
            <TableColumn>Note</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.id}</TableCell>
                <TableCell>
                  {e.transactionType === eTransactionType.deposit ? (
                    <Chip color="primary" size="sm" className="capitalize">
                      {e.transactionType}
                    </Chip>
                  ) : (
                    <Chip color="success" size="sm" className="capitalize">
                      {e.transactionType}
                    </Chip>
                  )}
                </TableCell>
                <TableCell>{e.currency}</TableCell>
                <TableCell>{e.cash}</TableCell>
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
