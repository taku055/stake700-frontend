import { useTranslations } from "@/context/I18nContext";
import { apiGetSportsbookTransaction } from "@/api/transaction/apiGetSportsbookTransaction";
import { useEffect, useState } from "preact/hooks";
import { tMergedTransaction } from "@/types/tTransaction";
import {
  SortDescriptor,
  Pagination,
} from "@heroui/react";
import Loader from "@/components/Loader";
import SportsbookHistoryTable from "./SportsbookHistoryTable";

const SportsbookHistoryPage = () => {
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
    apiGetSportsbookTransaction({
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
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        {t("Sportsbook History")}
      </div>
      <div className="flex flex-col w-full p-5 gap-5">
        <div className="px-5 py-3 bg-[#FFFFFF26] rounded-md">
          <div className="flex flex-row gap-2">
            <button className="bg-[#2A8038] text-[#FFFFFF] px-4 py-2 rounded-md">
              {t("Show")}
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between md:flex-row flex-col gap-2 p-4">
              <div className="flex text-[12px]">
                Total History: {total} items
              </div>
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
              <SportsbookHistoryTable data={data as any} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsbookHistoryPage;
