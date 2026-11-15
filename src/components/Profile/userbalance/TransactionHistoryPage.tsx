import { useEffect, useState } from "react";
import { useTranslations } from "@/context/I18nContext";
import Loader from "@/components/Loader";
import { DateRangePicker } from "@heroui/react";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import moment from "moment";
import { apiGetPaymentTransaction } from "@/api/transaction/apiGetPaymentTransaction.ts";
import { tTransaction } from "@/types/tTransaction";
import { eTransactionType } from "@/types/tTransaction";
import { userState } from "@/state/userState";

const today = new Date();

/** Single request: backend may cap; adjust if needed. */
const FETCH_ALL_LENGTH = 100_000;

const transactionTypeLabel = (
  t: ReturnType<typeof useTranslations>,
  type: eTransactionType
) => t(`txn_type_${type}`, undefined, String(type));

/** Platform IDs use dots (e.g. deposit.crypto); keys use underscores to avoid nested i18n paths. */
const transactionPlatformLabel = (
  t: ReturnType<typeof useTranslations>,
  platform: string
) => {
  const slug = platform.replace(/\./g, "_");
  return t(`txn_platform_${slug}`, undefined, platform);
};

const TransactionHistoryPage = () => {
  const t = useTranslations("UserBalancePage");
  const tBet = useTranslations("BetHistory");
  const [data, setData] = useState<tTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [period, setPeriod] = useState({
    start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
    end: new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    ),
  });
  const isMobile = useMediaQuery("(max-width: 599px)");

  useEffect(() => {
    if (!userState.value?.id) return;

    (async () => {
      setLoading(true);
      try {
        const res = await apiGetPaymentTransaction({
          offset: 0,
          length: FETCH_ALL_LENGTH,
          startDate: period.start.toDate(getLocalTimeZone()).getTime(),
          endDate:
            period.end.toDate(getLocalTimeZone()).getTime() + 86400000 - 1,
        });
        setData(res.data);
        setTotal(res.total);
      } catch (ex) {
        console.error(ex);
      }
      setLoading(false);
    })();
  }, [period.start, period.end, userState.value?.id]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-col gap-3 border-b border-[#2f4553] px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-[#b1bad3]">
          {tBet("total_history", { total: String(total) })}
        </p>
        <DateRangePicker
          className="w-full md:w-[300px]"
          label={tBet("Select period")}
          value={period}
          onChange={(value) => {
            if (value) {
              setPeriod({ start: value.start, end: value.end });
            }
          }}
          visibleMonths={isMobile ? 1 : 2}
        />
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <Loader />
        </div>
      ) : data.length === 0 ? (
        <p className="px-4 py-10 text-sm text-[#b1bad3]">{t("Transaction History")}</p>
      ) : (
        <ul>
          {data.map((e) => {
            const outgoing =
              e.type === eTransactionType.withdrawal ||
              e.type === eTransactionType.user_withdrawal;
            return (
              <li
                key={e.id}
                className="flex items-center justify-between gap-4 border-b border-[#2f4553] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {transactionTypeLabel(t, e.type)}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#b1bad3]">
                    {transactionPlatformLabel(t, e.platform)}
                    {" · "}
                    {e.currency}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <p
                    className={`text-sm font-semibold tabular-nums ${
                      outgoing ? "text-[#f0b4b4]" : "text-[#7dffa8]"
                    }`}
                  >
                    {outgoing ? "−" : "+"}
                    {Number(e.cash || 0)}
                  </p>
                  <p className="mt-0.5 text-xs text-[#557086]">
                    {moment(e.createdAt).format("YYYY-MM-DD HH:mm")}
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

export default TransactionHistoryPage;
