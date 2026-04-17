import {
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { userState } from "@/state/userState";
import {
  apiGetReferredUsers,
  tReferredUsers,
} from "@/api/referral/apiGetReferredUsers";
import { useTranslations } from "@/context/I18nContext";
import { numberRound } from "@/helpers/numberRound";
import { useState, useEffect } from "preact/hooks";

export default function Referral() {
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<tReferredUsers[]>([]);
  const t = useTranslations("Affiliate");

  useEffect(() => {
    if (userState.value?.id) {
      (async () => {
        try {
          const res = await apiGetReferredUsers({
            offset: (currentPage - 1) * 10,
            length: 10,
          });
          setData(res.data);
          setTotal(res.total);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }
  }, [currentPage, userState.value?.id]);

  return (
    <div className="flex flex-col gap-[27px] w-full md:p-[24px]">
      <Table
        aria-label="MyBets"
        className="overflow-x-auto"
        classNames={{
          th: "text-[9px] md:text-[14px] md:py-3 bg-[#222733]",
          td: "text-[10px] md:text-[14px] md:py-3 bg-[#222733]",
          tr: "border-b-1 border-[#FFFFFF0A]",
          wrapper: "bg-[#222733]",
        }}
      >
        <TableHeader>
          <TableColumn>{t("Player Name")}</TableColumn>
          <TableColumn>{t("Player Email")}</TableColumn>
          <TableColumn>{t("Cash")}</TableColumn>
          <TableColumn>{t("Total Daily Bonus")}</TableColumn>
          <TableColumn>{t("Total Monthly Bonus")}</TableColumn>
          <TableColumn>{t("Total Profit")}</TableColumn>
          <TableColumn>Deposit Crypto</TableColumn>
          <TableColumn>Deposit Visa</TableColumn>
          <TableColumn>Casino Bet</TableColumn>
          <TableColumn>Casino Win</TableColumn>
          <TableColumn>Withdraw Crypto</TableColumn>
          <TableColumn>Withdraw Bank</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.userName}</TableCell>
              <TableCell>{e.email}</TableCell>
              <TableCell>{e.cash.toFixed(2)}</TableCell>
              <TableCell>{e.totalDailyBonus.toFixed(2)}</TableCell>
              <TableCell>{e.totalMonthlyBonus.toFixed(2)}</TableCell>
              <TableCell>{e.totalBonus.toFixed(2)}</TableCell>
              <TableCell>
                {numberRound(e.depositCrypto, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {numberRound(e.depositVisa, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {numberRound(e.casinoBet, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {numberRound(e.casinoWin, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {numberRound(e.withdrawCrypto, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {numberRound(e.withdrawBank || 0, 100).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <Pagination
          showControls
          total={Math.ceil(total / 10)}
          color="success"
          radius="full"
          page={currentPage}
          onChange={setCurrentPage}
          isCompact
          classNames={{
            item: "text-[12px] md:text-[14px] bg-[#222733]",
            prev: "bg-[#222733]",
            next: "bg-[#222733]",
            cursor: "bg-[var(--primary-color)]",
          }}
        />
      </div>
    </div>
  );
}
