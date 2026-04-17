import { useEffect, useState } from "preact/hooks";
import Loader from "@/components/Loader";
import moment from "moment";
import { tMergedTransaction } from "@/types/tTransaction";
import TextWithCopy from "@/components/TextWithCopy";
import { numberRound } from "@/helpers/numberRound";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  type SortDescriptor,
} from "@heroui/table";
import { apiAdminUserCasinoHistoryMerged } from "@/api/agent/area_manager/apiAdminUserCasinoHistoryMerged";
import { DateRangePicker } from "@heroui/date-picker";
import { RangeValue } from "@react-types/shared";
import { CalendarDate } from "@internationalized/date";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { userState } from "@/state/userState";
import { useTranslations } from "@/context/I18nContext";

const columns: {
  title: string;
  key: string;
  sotable: boolean;
}[] = [
    {
      title: "Game",
      key: "context.game.name",
      sotable: false,
    },
    {
      title: "Provider",
      key: "provider",
      sotable: false,
    },
    {
      title: "RoundId",
      key: "eventId",
      sotable: false,
    },
    {
      title: "Currency",
      key: "currency",
      sotable: false,
    },
    {
      title: "Bet",
      key: "bet_amount",
      sotable: true,
    },
    {
      title: "Win",
      key: "win_amount",
      sotable: true,
    },
    {
      title: "Date",
      key: "first_tx_at",
      sotable: true,
    },
  ];

const translatedColumns = (t: (k: string) => string) =>
  columns.map((c) => ({ ...c, title: t(c.title) }));

const today = new Date();

export default function CasinoHistoryPage({ userId }: { userId: string }) {
  const t = useTranslations("BetHistory");
  const [data, setData] = useState<tMergedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: '"first_tx_at"',
    direction: "descending",
  });
  const [period, setPeriod] = useState<RangeValue<CalendarDate> | null>({
    start: new CalendarDate(today.getUTCFullYear(), today.getUTCMonth() + 1, 1),
    end: new CalendarDate(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1,
      today.getUTCDate()
    ),
  });
  const isMobile = useMediaQuery(mobileMediaQuery);

  const handleSortChange = (newDescriptor: SortDescriptor) => {
    setSortDescriptor(newDescriptor);
    console.log(newDescriptor);
  };

  useEffect(() => {
    if (userState.value?.role === "AREA_MANAGER") {
      (async () => {
        setLoading(true);

        try {
          const res = await apiAdminUserCasinoHistoryMerged(userId, {
            offset: (currentPage - 1) * 10,
            length: 10,
            startDate: period?.start.toDate("UTC").getTime(),
            endDate: period ? period.end.toDate("UTC").getTime() + 86399999 : 0,
            orderBy: sortDescriptor.column.toString(),
            orderByDirection:
              sortDescriptor.direction === "ascending" ? "asc" : "desc",
          });
          setData(res.data);
          setTotal(res.total);
        } catch (ex) {
          console.error(ex);
        }

        setLoading(false);
      })();
    }
  }, [
    currentPage,
    period?.start,
    period?.end,
    userState.value,
    sortDescriptor,
  ]);

  return (
    <div>
      <DateRangePicker
        label={t("Select period")}
        value={period}
        onChange={setPeriod}
        visibleMonths={isMobile ? 1 : 3}
        className="max-w-[300px] md:ml-auto"
      />
      <div className="flex items-center justify-between md:flex-row flex-col gap-2 p-4">
        <div className="flex text-[12px]">{t("total_history", { total })}</div>
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
        <Table
          removeWrapper
          aria-label="Casino subuser history"
          className="overflow-x-auto"
          classNames={{
            th: "text-[10px] md:text-[14px] md:py-3",
            td: "text-[12px] md:text-[14px] md:py-3",
          }}
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
        >
          <TableHeader>
            {translatedColumns(t).map((e) => (
              <TableColumn key={e.key} allowsSorting={e.sotable}>
                {e.title}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {data.map((e) => (
              <TableRow key={e.first_tx_at + e.eventId}>
                <TableCell>{e.context?.game?.name || ""}</TableCell>
                <TableCell>{e.provider}</TableCell>
                <TableCell>
                  {e.eventId && <TextWithCopy text={e.eventId} />}
                </TableCell>
                <TableCell>{e.currency}</TableCell>
                <TableCell>
                  <Chip color="primary" size="sm">{numberRound(e.bet_amount, 100)}</Chip>
                  <Chip color="success" size="sm">{numberRound(e.bet_bonus_amount, 100)}</Chip>
                </TableCell>
                <TableCell>
                  <Chip color="danger" size="sm">{numberRound(e.win_amount, 100)}</Chip>
                  <Chip color="warning" size="sm">{numberRound(e.win_bonus_amount, 100)}</Chip>
                </TableCell>
                <TableCell>
                  {moment(e.last_tx_at).format("YYYY-MM-DD hh:mm A")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
