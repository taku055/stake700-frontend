import { useEffect, useMemo, useState } from "preact/hooks";
import Loader from "@/components/Loader";
import {
  DateRangePicker,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useMediaQuery } from "usehooks-ts";
import { CalendarDate } from "@internationalized/date";
import { numberRound } from "@/helpers/numberRound";
import { apiAdminGetUserAnalysis } from "@/api/agent/area_manager/apiAdminGetUserAnalysis";
import { tUserAnalysis } from "@/types/tUserAnalysis";
import { RangeValue } from "@react-types/shared/src/inputs";
import { CURRENCY_LIST, DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { eTransactionCurrency } from "@/types/tTransaction";
import { userState } from "@/state/userState";

const today = new Date();

export default function UserAnalysisPage() {
  const [period, setPeriod] = useState<RangeValue<CalendarDate> | null>({
    start: new CalendarDate(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1,
      today.getUTCDate()
    ),
    end: new CalendarDate(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1,
      today.getUTCDate()
    ),
  });
  const [users, setUsers] = useState<tUserAnalysis[]>([]);
  const isMobile = useMediaQuery("(max-width: 599px)");
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] =
    useState<eTransactionCurrency>(eTransactionCurrency.USD);
  const selectedCurrencySymbol = useMemo(
    () =>
      CURRENCY_LIST.find((c) => c.unit === selectedCurrency)?.symbol ||
      DEFAULT_CURRENCY_SYMBOL,
    [selectedCurrency]
  );

  useEffect(() => {
    if (userState.value?.role === "AREA_MANAGER") {
      const load = async () => {
        setLoading(true);
        try {
          const data = await apiAdminGetUserAnalysis({
            startDate: period?.start.toDate("UTC").getTime(),
            endDate: period?.end
              ? period?.end.toDate("UTC").getTime() + 86399999
              : period?.start &&
                period?.start.toDate("UTC").getTime() + 86399999,
            currency: selectedCurrency,
          });

          setUsers(data);
        } catch (ex) {
          console.error(ex);
        }
        setLoading(false);
      };

      load();
    }
  }, [period, userState.value, selectedCurrency]);

  return (
    <div className="card p-4 flex flex-col gap-4 md:w-full w-screen">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-1 gap-4 items-center text-[14px] md:text-[18px]">
          User Report
        </div>
        <DateRangePicker
          className="md:w-[320px] w-full ml-auto"
          label={"Select period"}
          value={period}
          onChange={setPeriod}
          visibleMonths={isMobile ? 1 : 3}
        />
        <CurrencySelector
          value={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4">
          <Table
            removeWrapper
            aria-label="provider-analysis"
            className="w-full overflow-x-auto"
          >
            <TableHeader>
              <TableColumn>No</TableColumn>
              <TableColumn>Player ID</TableColumn>
              <TableColumn>Username</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn className="text-right">Balance</TableColumn>
              <TableColumn className="text-right">Deposit count</TableColumn>
              <TableColumn className="text-right">Deposit Amount</TableColumn>
              <TableColumn className="text-right">CashOut</TableColumn>
              <TableColumn className="text-right">Bet Count</TableColumn>
              <TableColumn className="text-right">Bet Amount</TableColumn>
              <TableColumn className="text-right">Win Amount</TableColumn>
              <TableColumn className="text-right">GGR</TableColumn>
              <TableColumn className="text-right">
                Average
                <br />
                Bet Size
              </TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((e, index) => (
                <TableRow
                  key={e.userId}
                  className={
                    e.betAmount - e.winAmount < 0 ? "text-red-500" : ""
                  }
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <a
                      href={`/area_manager/users/${e.userId}`}
                      className="hover:underline flex items-center md:gap-[12px] gap-[6px]"
                    >
                      {e.userId}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/area_manager/users/${e.userId}`}
                      className="hover:underline flex items-center md:gap-[12px] gap-[6px]"
                    >
                      {e.userName}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/area_manager/users/${e.userId}`}
                      className="hover:underline flex items-center md:gap-[12px] gap-[6px]"
                    >
                      {e.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    {selectedCurrencySymbol}{" "}
                    {numberRound(e.cashBalance, 100).toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right">{e.depositCount}</TableCell>

                  <TableCell className="text-right">
                    {e.depositAmount
                      ? `${selectedCurrencySymbol}${numberRound(
                          e.depositAmount,
                          100
                        ).toLocaleString()}`
                      : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    {e.cashOut
                      ? `${selectedCurrencySymbol}${numberRound(
                          e.cashOut,
                          100
                        ).toLocaleString()}`
                      : ""}
                  </TableCell>
                  <TableCell className="text-right">{e.betCount}</TableCell>

                  <TableCell className="text-right">
                    {e.betAmount
                      ? `${selectedCurrencySymbol}${numberRound(
                          e.betAmount,
                          100
                        ).toLocaleString()}`
                      : ""}
                  </TableCell>

                  <TableCell className="text-right">
                    {e.winAmount
                      ? `${selectedCurrencySymbol}${numberRound(
                          e.winAmount,
                          100
                        ).toLocaleString()}`
                      : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    {e.betAmount - e.winAmount >= 0 ? "+" : "-"}
                    {selectedCurrencySymbol}
                    {numberRound(
                      Math.abs(e.betAmount - e.winAmount),
                      100
                    ).toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right">
                    {e.avgBetSize
                      ? `${selectedCurrencySymbol}${numberRound(
                          e.avgBetSize,
                          100
                        ).toLocaleString()}`
                      : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
