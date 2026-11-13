import { useTranslations } from "@/context/I18nContext";
import { apiGetCasinoTransaction } from "@/api/transaction/apiGetCasinoTransaction";
import { useEffect, useState } from "react";
import { tMergedTransaction } from "@/types/tTransaction";
import moment from "moment";
import { Pagination, SortDescriptor } from "@heroui/react";
import { numberRound } from "@/helpers/numberRound";
import Loader from "@/components/Loader";
import { CURRENCY_LIST } from "@/config/constants";

const CasinoHistoryPage = () => {
  const t = useTranslations("BetHistory");
  const [data, setData] = useState<tMergedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDescriptor] = useState<SortDescriptor>({
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

  const symbolFor = (currency: string) =>
    CURRENCY_LIST.find((item) => item.unit === currency)?.symbol ?? "";

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#2f4553] px-4 py-3">
        <p className="text-xs text-[#b1bad3]">{t("total_history", { total })}</p>
        <Pagination
          showControls
          total={Math.max(1, Math.ceil(total / 10))}
          color="primary"
          radius="sm"
          page={currentPage}
          onChange={setCurrentPage}
          isCompact
        />
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <Loader />
        </div>
      ) : (
        <ul>
          {data.map((e) => {
            const symbol = symbolFor(e.currency);
            const won = Number(e.win_amount) > 0;
            return (
              <li
                key={e.first_tx_at + e.eventId}
                className="flex items-center justify-between gap-4 border-b border-[#2f4553] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {e.context?.game?.name || e.provider}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#b1bad3]">
                    {e.provider}
                    {e.eventId ? ` · ${e.eventId}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <p className="text-sm font-semibold tabular-nums text-white">
                    {t("Bet")} {symbol}
                    {numberRound(e.bet_amount, 100)}
                  </p>
                  <p
                    className={`mt-0.5 text-xs tabular-nums ${
                      won ? "text-[#7dffa8]" : "text-[#b1bad3]"
                    }`}
                  >
                    {t("Win")} {symbol}
                    {numberRound(e.win_amount, 100)}
                  </p>
                  <p className="mt-0.5 text-xs text-[#557086]">
                    {moment(e.last_tx_at).format("YYYY-MM-DD hh:mm A")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CasinoHistoryPage;
