import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Card, CardBody } from "@heroui/react";
import {
  CheckCircle2,
  Wallet,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { apiGetAriesOrderStatus } from "@/api/wallet/apiGetAriesOrderStatus";
import { balanceState } from "@/state/balanceState";
import { CURRENCY_LIST } from "@/config/constants";
import { userState } from "@/state/userState";

const statusConfig: Record<
  string,
  { icon: typeof CheckCircle2; labelKey: string; className: string }
> = {
  completed: {
    icon: CheckCircle2,
    labelKey: "Completed",
    className: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
  success: {
    icon: CheckCircle2,
    labelKey: "Success",
    className: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
  failed: {
    icon: AlertCircle,
    labelKey: "Failed",
    className: "text-rose-400 bg-rose-500/15 border-rose-500/30",
  },
  pending: {
    icon: Loader2,
    labelKey: "Pending",
    className: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  },
};

function getStatusConfig(status: string) {
  const key = status?.toLowerCase?.() ?? "";
  return (
    statusConfig[key] ?? {
      icon: HelpCircle,
      labelKey: "Unknown",
      className: "text-slate-400 bg-slate-500/15 border-slate-500/30",
    }
  );
}

export default function AriesPaymentResult() {
  const t = useTranslations("AriesPaymentResult");
  const location = useLocation();
  const orderId = location.query.order_id;

  const [orderStatus, setOrderStatus] = useState<{ status: string } | null>(
    null
  );
  const [loading, setLoading] = useState(!!orderId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !userState.value?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setError(null);
      try {
        const result = await apiGetAriesOrderStatus(orderId);
        if (!cancelled) setOrderStatus(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err && typeof err === "object" && "message" in err
              ? String((err as { message: unknown }).message)
              : t("Failed to load order status")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, userState.value?.id]);

  const balances = balanceState.value;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t("Payment result")}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {t("Aries deposit order status and balance")}
          </p>
        </div>

        {!orderId ? (
          <Card className="bg-[var(--green-color)] border border-white/10 shadow-[0_1px_4px_0_#1B1B1B80]">
            <CardBody className="flex flex-row items-center gap-3 p-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-500/20 shrink-0">
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-white font-medium">{t("Missing order")}</p>
                <p className="text-slate-400 text-sm">
                  {t("Add order_id to URL hint")}
                </p>
              </div>
            </CardBody>
          </Card>
        ) : loading ? (
          <Card className="bg-[var(--green-color)] border border-white/10 shadow-[0_1px_4px_0_#1B1B1B80]">
            <CardBody className="flex flex-row items-center gap-3 p-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 shrink-0">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
              <div>
                <p className="text-white font-medium">{t("Checking status…")}</p>
                <p className="text-slate-400 text-sm">
                  {t("Order ID")}: <span className="text-slate-300 font-mono text-xs">{orderId}</span>
                </p>
              </div>
            </CardBody>
          </Card>
        ) : error ? (
          <Card className="bg-[var(--green-color)] border border-rose-500/20 shadow-[0_1px_4px_0_#1B1B1B80]">
            <CardBody className="flex flex-row items-center gap-3 p-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/20 shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium">{t("Something went wrong")}</p>
                <p className="text-rose-300 text-sm break-words">{error}</p>
              </div>
            </CardBody>
          </Card>
        ) : orderStatus ? (
          (() => {
            const config = getStatusConfig(orderStatus.status);
            const Icon = config.icon;
            return (
              <Card className="bg-[var(--green-color)] border border-white/10 shadow-[0_1px_4px_0_#1B1B1B80]">
                <CardBody className="p-5">
                  <div className="flex flex-row items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-11 h-11 rounded-full border shrink-0 ${config.className}`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          Icon === Loader2 ? "animate-spin" : ""
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                        {t("Order status")}
                      </p>
                      <p className="text-white text-lg font-semibold capitalize mt-0.5">
                        {t(config.labelKey)}
                      </p>
                      <p className="text-slate-500 text-xs font-mono mt-1 truncate">
                        {orderId}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })()
        ) : null}

        <Card className="bg-[var(--green-color)] border border-white/10 shadow-[0_1px_4px_0_#1B1B1B80]">
          <CardBody className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FFFFFF20] shrink-0">
                <Wallet className="w-6 h-6 text-white/90" />
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                {t("Current balance")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {CURRENCY_LIST.map((cur) => {
                const cashBalance =
                  Number(balances[cur.code]?.cash?.balance ?? 0);
                return (
                  <div
                    key={cur.code}
                    className="flex items-center justify-between py-2 border-b border-white/10 last:border-0 last:pb-0"
                  >
                    <span className="text-slate-300 text-sm font-medium">
                      {cur.code}
                    </span>
                    <p className="text-white text-lg font-bold leading-tight">
                      {cashBalance.toFixed(2)}{" "}
                      <span className="text-slate-400 font-normal text-base">
                        {cur.symbol}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
