import { useEffect, useMemo, useState } from "preact/hooks";
import { userState } from "@/state/userState";
import { DateRangePicker, RangeValue } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { tProviderAnalysis } from "@/types/tProviderAnalysis";
import { useMediaQuery } from "usehooks-ts";
import {
  CURRENCY_LIST,
  DEFAULT_CURRENCY_SYMBOL,
  mobileMediaQuery,
} from "@/config/constants";
import PlatformAnalysisTable from "@/components/PlatformAnalysis/PlatformAnalysisTable";
import Loader from "@/components/Loader";
import { eTransactionCurrency } from "@/types/tTransaction";
import CurrencySelector from "@/components/CurrencySelector";

const today = new Date();

interface IPlatformAnalysisProps {
  agentId: string;
  fetchData: (
    agentId: string,
    param: {
      startDate?: number;
      endDate?: number;
      currency: eTransactionCurrency;
    }
  ) => Promise<tProviderAnalysis[]>;
}

export default function PlatformAnalysis({
  agentId,
  fetchData,
}: IPlatformAnalysisProps) {
  const [period, setPeriod] = useState<RangeValue<CalendarDate> | null>({
    start: new CalendarDate(today.getUTCFullYear(), today.getUTCMonth() + 1, 1),
    end: new CalendarDate(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1,
      today.getUTCDate()
    ),
  });

  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [providers, setProviders] = useState<tProviderAnalysis[]>([]);

  const [selectedCurrency, setSelectedCurrency] =
    useState<eTransactionCurrency>(eTransactionCurrency.USD);
  const selectedCurrencySymbol = useMemo(
    () =>
      CURRENCY_LIST.find((c) => c.unit === selectedCurrency)?.symbol ||
      DEFAULT_CURRENCY_SYMBOL,
    [selectedCurrency]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchData(agentId, {
          startDate: period?.start.toDate("UTC").getTime(),
          endDate: period ? period.end.toDate("UTC").getTime() + 86399999 : 0,
          currency: selectedCurrency,
        });

        setProviders(data);
      } catch (ex) {
        console.error(ex);
      }
      setLoading(false);
    };

    load();
  }, [
    period!.start,
    period!.end,
    agentId,
    userState.value?.role,
    selectedCurrency,
    fetchData,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <h3 className="text-[16px] font-semibold">Platform Analysis</h3>
        <DateRangePicker
          className="md:w-[300px] w-full ml-auto"
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
        <PlatformAnalysisTable
          providerData={providers}
          selectedCurrencySymbol={selectedCurrencySymbol}
        />
      )}
    </div>
  );
}
