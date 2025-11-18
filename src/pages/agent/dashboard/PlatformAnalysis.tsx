import { useEffect, useState } from "preact/hooks";

import { userState } from "@/state/userState";
import { useTranslations } from "@/context/I18nContext";
import {
  DateRangePicker,
  RangeValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { numberRound } from "@/helpers/numberRound";
import { CalendarDate } from "@internationalized/date";
import { tProviderAnalysis } from "@/types/tProviderAnalysis";
import { apiAgentGetProviderAnalysis } from "@/api/agent/apiAgentGetProviderAnalysis";
import { useMediaQuery } from "usehooks-ts";
import { DEFAULT_CURRENCY_SYMBOL, mobileMediaQuery } from "@/config/constants";

const today = new Date();
const platformList = [
  "igp.casino",
  "soft.casino",
  "sloter.casino",
  "gss.casino",
  "sport",
];

type tTotal = {
  bet: number;
  paid: number;
};

export default function PlatformAnalysis() {
  const t = useTranslations("AgentAnalysis");
  const [period, setPeriod] = useState<RangeValue<CalendarDate> | null>({
    start: new CalendarDate(today.getUTCFullYear(), today.getUTCMonth() + 1, 1),
    end: new CalendarDate(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1,
      today.getUTCDate()
    ),
  });
  const [platforms, setPlatforms] = useState<tProviderAnalysis[]>([]);
  const [total, setTotal] = useState<tTotal>({
    bet: 0,
    paid: 0,
  });
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);

  useEffect(() => {
    if (!userState.value?.isAgent) {
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await apiAgentGetProviderAnalysis({
          startDate: period?.start.toDate("UTC").getTime(),
          endDate: period ? period.end.toDate("UTC").getTime() + 86399999 : 0,
        });
        // setProviders(data.sort((a, b) => b.bet - b.paid - (a.bet - a.paid)));

        const platforms1: tProviderAnalysis[] = platformList.map((p, i) => ({
          id: i.toString(),
          platform: p,
          provider: "",
          bet: 0,
          paid: 0,
        }));

        const sum: tTotal = { bet: 0, paid: 0 };
        data.forEach((e) => {
          sum.bet += e.bet;
          sum.paid += e.paid;

          const i = platformList.findIndex((p) => p === e.platform);
          if (i !== -1) {
            platforms1[i].bet += e.bet;
            platforms1[i].paid += e.paid;
          }
        });
        setPlatforms(platforms1.filter((p) => p.bet > 0 || p.paid > 0));
        setTotal(sum);
      } catch (ex) {
        console.error(ex);
      }
      setLoading(false);
    };

    load();
  }, [period!.start, period!.end, userState.value?.id]);

  return (
    <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-md">
      <h3 className="text-[16px] font-bold">{t("platform_analysis")}</h3>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-1 gap-4 items-center text-[12px] md:text-[14px] flex-col md:flex-row">
          <div className="flex">
            <label className="mr-1">{t("total_bet")}</label>
            <span className="text-white">
              {DEFAULT_CURRENCY_SYMBOL}
              {numberRound(total.bet, 100).toLocaleString()}
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">{t("paid")}</label>
            <span className="text-white">
              {DEFAULT_CURRENCY_SYMBOL}
              {numberRound(total.paid, 100).toLocaleString()}
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">GGR</label>
            <span className="text-white">
              {DEFAULT_CURRENCY_SYMBOL}
              {numberRound(total.bet - total.paid, 100).toLocaleString()}
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">{t("profit_percent")}</label>
            <span className="text-white">
              {userState.value?.profitPercent}%
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">{t("profit")}</label>
            <span className="text-white">
              {DEFAULT_CURRENCY_SYMBOL}
              {numberRound(
                ((total.bet - total.paid) *
                  (userState.value?.profitPercent || 0)) /
                  100,
                100
              ).toLocaleString()}
            </span>
          </div>
        </div>
        <DateRangePicker
          className="md:w-[300px] w-full"
          label={t("select_period")}
          value={period}
          onChange={setPeriod}
          visibleMonths={isMobile ? 1 : 3}
        />
      </div>
      <Table
        removeWrapper
        aria-label="platform-analysis"
        className="w-full overflow-x-auto"
      >
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>{t("platform")}</TableColumn>
          <TableColumn>{t("bet")}</TableColumn>
          <TableColumn>{t("paid_out")}</TableColumn>
          <TableColumn>GGR</TableColumn>
        </TableHeader>
        <TableBody>
          {platforms.map((e, index) => (
            <TableRow
              key={(e.platform || "") + (e.id || "")}
              className={
                "text-[12px] " +
                (e.bet - e.paid < 0 ? "text-red-500" : "text-green-400")
              }
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{e.platform}</TableCell>
              <TableCell>{numberRound(e.bet, 100).toLocaleString()}</TableCell>
              <TableCell>{numberRound(e.paid, 100).toLocaleString()}</TableCell>
              <TableCell>
                {numberRound(e.bet - e.paid, 100).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
