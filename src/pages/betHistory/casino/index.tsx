import { useTranslations } from "@/context/I18nContext";
import { apiGetCasinoTransaction } from "@/api/transaction/apiGetCasinoTransaction";
import { useEffect, useState } from "preact/hooks";
import { tMergedTransaction } from "@/types/tTransaction";
import moment from "moment";
import {
  SortDescriptor,
  TableCell,
  TableRow,
  TableBody,
  Table,
  Chip,
  TableHeader,
  TableColumn,
  Pagination,
} from "@heroui/react";
import { numberRound } from "@/helpers/numberRound";
import Loader from "@/components/Loader";
import TextWithCopy from "@/components/TextWithCopy";
import { CURRENCY_LIST, DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

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

const CasinoHistoryPage = () => {
  const t = useTranslations("BetHistory");
  const [data, setData] = useState<tMergedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: '"first_tx_at"',
    direction: "descending",
  });

  useEffect(() => {
    setLoading(true);
    apiGetCasinoTransaction({
      offset: (currentPage - 1) * 10,
      length: 10,
      startDate: 0,
      endDate: 0,
      orderBy: sortDescriptor.column as string,
      orderByDirection:
        sortDescriptor.direction == "ascending" ? "asc" : "desc",
    })
      .then((res) => {
        setData(res.data);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, sortDescriptor]);

  function handleSortChange(descriptor: SortDescriptor) {
    setSortDescriptor(descriptor);
  }

  return (
    <div className="flex flex-col h-full">
      {/* <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        {t("Casino History")}
      </div> */}
      <div className="flex flex-col w-full p-5 gap-5">
        <div className="px-5 py-3 bg-[var(--background)] rounded-md">
         
          <div>
            
            {loading ? (
              <Loader />
            ) : (
              <Table
                removeWrapper
                aria-label="Casino subuser history"
                className="overflow-x-auto"
                classNames={{
                  th: "text-[10px] md:text-[14px] md:py-4 bg-[var(--background)]",
                  td: "text-[12px] md:text-[14px] md:py-4",
                }}
                sortDescriptor={sortDescriptor}
                onSortChange={handleSortChange}
              >
                <TableHeader>
                  {columns.map((e) => (
                    <TableColumn key={e.key} allowsSorting={e.sotable}>
                      {e.title}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {data.map((e ,index) => (
                    <TableRow key={e.first_tx_at + e.eventId}
                    style={{ backgroundColor: index % 2 === 1 ? "" : "var(--background-secondary)" }}
                    >
                      <TableCell>{e.context?.game?.name || ""}</TableCell>
                      <TableCell>{e.provider}</TableCell>
                      <TableCell>
                        {e.eventId && <TextWithCopy text={e.eventId} />}
                      </TableCell>
                      <TableCell>
                        {/* <Chip color="primary" size="sm"> */}
                          {
                            CURRENCY_LIST.find(
                              (currency) => currency.unit === e.currency
                            )?.symbol
                          }
                          {numberRound(e.bet_amount, 100)}
                        {/* </Chip> */}
                      </TableCell>
                      <TableCell>
                        {/* <Chip color="danger"> */}
                          {
                            CURRENCY_LIST.find(
                              (currency) => currency.unit === e.currency
                            )?.symbol
                          }
                          {numberRound(e.win_amount, 100)}
                        {/* </Chip> */}
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
          <div className="flex items-center justify-end md:flex-row flex-col gap-2 p-4">
              {/* <div className="flex text-[12px]">
                Total History: {total} items
              </div> */}
              <Pagination
                showControls
                total={Math.ceil(total / 10)}
                color="success"
                radius="full"
                page={currentPage}
                onChange={setCurrentPage}
                isCompact
                className="bg-[var(--background)]"
                classNames={{
                  item: "bg-[var(--background-secondary)]",
                  next: "bg-[var(--background-secondary)]",
                  prev: "bg-[var(--background-secondary)]",
                }}
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoHistoryPage;
