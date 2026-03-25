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
  Chip,
} from "@heroui/react";
import moment from "moment";
import { tTransaction } from "@/types/tTransaction";
import { apiAgentGetSubuserCasinoHistory } from "@/api/agent/apiAgentGetSubuserCasinoHistory";
import TextWithCopy from "@/components/TextWithCopy";
import { useTranslations } from "@/context/I18nContext";

const chipColors: { [eventType: string]: string } = {
  Win: "success",
  Lose: "danger",
  BetPlacing: "primary",
  BetPlacingAbort: "danger",
};

interface ICasinoHistoryPage {
  startDate: Date;
  endDate: Date;
  userId: string;
}

export default function CasinoHistoryPage({
  startDate,
  endDate,
  userId,
}: ICasinoHistoryPage) {
  const [data, setData] = useState<tTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("Agent");

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await apiAgentGetSubuserCasinoHistory(userId, {
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
          aria-label="Casino subuser history"
          classNames={{
            th: "text-[10px] md:text-[14px] md:py-3",
            td: "text-[12px] md:text-[14px] md:py-3",
          }}
        >
          <TableHeader>
            <TableColumn>{t("Id")}</TableColumn>
            <TableColumn>{t("Game")}</TableColumn>
            <TableColumn>{t("Type")}</TableColumn>
            <TableColumn>{t("Currency")}</TableColumn>
            <TableColumn>{t("Amount")}</TableColumn>
            <TableColumn>{t("Date")}</TableColumn>
          </TableHeader>

          <TableBody>
            {data.map((e, index) => (
              <TableRow key={e.id}>
                <TableCell>
                  <TextWithCopy text={e.id} />
                </TableCell>
                <TableCell>{e.context?.game?.name || ""}</TableCell>
                <TableCell>
                  <Chip
                    className="text-[10px] md:text-[14px] p-1 wrap"
                    size="sm"
                    color={(chipColors[e.eventType || ""] as any) || "default"}
                  >
                    {t(e.eventType || "")}
                  </Chip>
                </TableCell>
                <TableCell>{e.currency}</TableCell>
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
  );
}
