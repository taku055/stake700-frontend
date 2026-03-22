import { useCallback, useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { X, CheckCircle, Clock, AlertCircle } from "lucide-preact";
import { apiCancelLazyWithdraw } from "@/api/wallet/apiCancelLazyWithdraw";
import { allChainsMap } from "@/config/chains";
import { addressLink } from "@/helpers/addressLink";
import { tWithdrawRequest } from "@/types/tWithdrawRequest";
import { apiGetLazyWithdraws } from "@/api/wallet/apiGetLazyWithdraws";
import { userState } from "@/state/userState";
import { toast } from "@/helpers/toast";

interface WithdrawData {
  id: string;
  dateAndId: string;
  paidTime: string;
  system: string;
  voucherCode: string;
  amount: string;
  status: "pending" | "completed" | "cancelled" | "failed";
}

const WithdrawStatusPage = () => {
  const t = useTranslations("UserBalancePage");
  const tToast = useTranslations("ToastMessages");
  const [data, setData] = useState<tWithdrawRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (userState.value?.id) {
      (async () => {
        setLoading(true);

        try {
          const res = await apiGetLazyWithdraws((currentPage - 1) * 10, 10);
          setData(res.data);
          setTotal(res.total);
        } catch (ex) {
          console.error(ex);
        }

        setLoading(false);
      })();
    }
  }, [currentPage, userState.value?.id]);

  const onCancelRequest = useCallback(
    async (requestId: number) => {
      if (userState.value?.id) {
        try {
          const balance = await apiCancelLazyWithdraw(requestId);
          if (userState.value) {
            const cashDetails = [...userState.value.cashDetails];
            const i = cashDetails.findIndex(c => c.currency === balance.currency);
            if (i !== -1) {
              cashDetails[i] = balance;
            } else {
              cashDetails.push(balance);
            }

            userState.value = {
              ...userState.value,
              cashDetails,
            };
          }

          setData((p) => {
            const i = p.findIndex((e) => e.id === requestId);
            if (i !== -1) {
              const newData = [...p];
              newData[i].status = 3;
              return newData;
            }
            return p;
          });
        } catch (ex) {
          toast.error(tToast("error.cancel_transaction"));
        }
      }
    },
    [userState.value?.id]
  );

  const statusChips = [
    { color: "default", text: "Pending" },
    { color: "success", text: "Approved" },
    { color: "danger", text: "Banned" },
    { color: "default", text: "Canceled" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Canceled":
        return <X className="w-4 h-4 text-red-500" />;
      case "Banned":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("Completed");
      case "pending":
        return t("Pending");
      case "cancelled":
        return t("Cancelled");
      case "failed":
        return t("Failed");
      default:
        return t("Unknown");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "cancelled":
        return "text-red-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 border-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        <h2 className="text-[var(--foreground)] text-[18px] font-semibold">{t("Withdraw Status")}</h2>
      </div>

      <div className="flex flex-col w-full p-5 gap-5 flex-1 overflow-hidden">
        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 p-4 bg-[var(--bar-background-color)] border-b border-[var(--highlight-background)] text-[var(--foreground)] text-[14px] font-medium">
              <div>{t("Data And ID")}</div>
              <div>{t("Paid Time")}</div>
              <div>{t("System")}</div>
              <div>{t("Voucher Code")}</div>
              <div>{t("Amount")}</div>
              <div>{t("Status")}</div>
              <div>{t("Cancel")}</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[var(--highlight-background)]">
              {data.map((item) => (
                <div key={item.id} className="grid grid-cols-7 gap-4 p-4 hover:bg-[var(--bar-background-color-hover)] transition-colors duration-200">
                  {/* Data And ID */}
                  <div className="text-[var(--foreground)] text-[13px]">
                    <div className="whitespace-pre-line">{item.id}</div>
                  </div>

                  {/* Paid Time */}
                  <div className="text-[var(--foreground)] text-[13px]">
                    {item.createdAt}
                  </div>

                  {/* System */}
                  <div className="text-[var(--foreground)] text-[13px]">
                    {item.chainId}
                  </div>

                  {/* Voucher Code */}
                  <div className="text-[var(--foreground)] text-[13px] font-mono">
                    {item.address}
                  </div>

                  {/* Amount */}
                  <div className="text-[var(--foreground)] text-[13px] font-semibold">
                    {item.cash}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(statusChips[item.status || 0]?.text)}
                    <span className={`text-[13px] ${getStatusColor(statusChips[item.status || 0]?.text)}`}>
                      {getStatusText(statusChips[item.status || 0]?.text)}
                    </span>
                  </div>

                  {/* Cancel */}
                  <div>
                    {item.status === 0 && (
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[12px] rounded transition-colors duration-200">
                        {t("Cancel")}
                      </button>
                    )}
                    {item.status !== 0 && (
                      <span className="text-[var(--text-transparent-color)] text-[12px]">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[var(--highlight-background)]">
          <button className="bg-[var(--green-color)] hover:bg-[var(--green-color)]/80 text-white px-6 py-2 rounded-md text-[14px] transition-colors duration-200">
            {t("Show All")}
          </button>
          <button className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] text-white px-6 py-2 rounded-md text-[14px] transition-colors duration-200">
            {t("Export")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WithdrawStatusPage;