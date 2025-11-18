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
import { apiAgentGetSubuserTransactions } from "@/api/agent/apiAgentGetSubuserTransactions";
import TextWithCopy from "@/components/TextWithCopy";
import { useTranslations } from "@/context/I18nContext";

interface ITransactionsPage {
  startDate: Date;
  endDate: Date;
  userId: string;
}

export default function TransactionsPage({
  startDate,
  endDate,
  userId,
}: ITransactionsPage) {
  const [data, setData] = useState<tTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("Agent");

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await apiAgentGetSubuserTransactions(userId, {
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
            aria-label="Subuser deposit history"
            classNames={{
              th: "text-[10px] md:text-[14px] md:py-3",
              td: "text-[12px] md:text-[14px] md:py-3",
            }}
          >
            <TableHeader>
              <TableColumn>{t("Id")}</TableColumn>
              <TableColumn>{t("Type")}</TableColumn>
              <TableColumn>{t("Amount")}</TableColumn>
              <TableColumn>{t("Created At")}</TableColumn>
              <TableColumn>{t("Note")}</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e, index) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <TextWithCopy text={e.id} />
                  </TableCell>
                  <TableCell>
                    {e.type === eTransactionType.deposit ? (
                      <span className="text-white bg-primary rounded-xl p-1 text-[10px]">
                        {t(e.type)}
                      </span>
                    ) : (
                      <span className="text-black bg-success rounded-xl p-1 text-[10px]">
                        {t(e.type)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{e.cash}</TableCell>
                  <TableCell>
                    {moment(e.createdAt).format("YYYY-MM-DD hh:mm A")}
                  </TableCell>
                  <TableCell>{e.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
