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
} from "@heroui/react";

import moment from "moment";
import { eTransactionType, tTransaction } from "@/types/tTransaction";
import { apiAgentGetSubuserSportsbookHistory } from "@/api/agent/apiAgentGetSubuserSportsbookHistory";
import TextWithCopy from "@/components/TextWithCopy";
import { useTranslations } from "@/context/I18nContext";

interface ISportsbookHistoryPage {
  startDate: Date;
  endDate: Date;
  userId: string;
}

export default function SportsbookHistoryPage({
  startDate,
  endDate,
  userId,
}: ISportsbookHistoryPage) {
  const [data, setData] = useState<tTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("Agent");

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await apiAgentGetSubuserSportsbookHistory(userId, {
          offset: (currentPage - 1) * 10,
          length: 10,
          startDate: startDate.getTime(),
          endDate: endDate.getTime() + 86400000 - 1,
        });
        setData(res.data);
        setTotal(res.total);
      } catch (ex) {
        console.error(ex);
      }

      setLoading(false);
    })();
  }, [currentPage, startDate, endDate]);

  return (
    <div>
      <div>
        <div className="flex items-center justify-between md:flex-row flex-col gap-2 p-4">
          <div className="flex text-[12px]">
            {t("Total History")}: {total} {t("items")}
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
          <Table
            removeWrapper
            aria-label="Sportsbook subuser history"
            classNames={{
              th: "text-[10px] md:text-[14px] md:py-3",
              td: "text-[12px] md:text-[14px] md:py-3",
            }}
          >
            <TableHeader>
              <TableColumn>{t("Id")}</TableColumn>
              <TableColumn>{t("Type")}</TableColumn>
              <TableColumn>{t("Amount")}</TableColumn>
              <TableColumn>{t("Date")}</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e, index) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <TextWithCopy text={e.id} />
                  </TableCell>
                  <TableCell>
                    {e.type === eTransactionType.withdrawal ? (
                      <span className="text-black bg-success rounded-xl p-1 text-[10px]">
                        BET
                      </span>
                    ) : e.type === eTransactionType.deposit ? (
                      <span className="text-white bg-primary rounded-xl p-1 text-[10px]">
                        PAID OUT
                      </span>
                    ) : (
                      <span className="text-white bg-warning rounded-xl p-1 text-[10px]">
                        ROLLBACK
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{e.cash}</TableCell>
                  <TableCell>
                    {moment(e.createdAt).format("YYYY-MM-DD hh:mm A")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
