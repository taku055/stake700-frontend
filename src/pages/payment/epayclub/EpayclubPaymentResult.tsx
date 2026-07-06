import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Button, Card, CardBody } from "@heroui/react";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Home,
  Loader2,
  Wallet,
} from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { apiVerifyEpayclub } from "@/api/wallet/apiEpayclub";
import { balanceState } from "@/state/balanceState";
import { CURRENCY_LIST } from "@/config/constants";
import { profileOpenedState } from "@/state/profileOpenedState";
import axios from "axios";

const statusConfig: Record<
  string,
  { icon: typeof CheckCircle2; labelKey: string; className: string }
> = {
  success: {
    icon: CheckCircle2,
    labelKey: "Success",
    className: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
  completed: {
    icon: CheckCircle2,
    labelKey: "Completed",
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
  pending_callback: {
    icon: Loader2,
    labelKey: "Pending",
    className: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  },
  created: {
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

function resolveDisplayStatus(
  status?: string,
  duplicate?: boolean,
  success?: boolean,
) {
  if (duplicate || status?.toUpperCase() === "SUCCESS") return "success";
  if (success && !status) return "success";
  return status ?? "unknown";
}

export default function EpayclubPaymentResult() {
  const t = useTranslations("EpayclubPaymentResult");
  const location = useLocation();
  const reference = location.query.reference ?? "";
  const checkoutToken = location.query.checkoutToken ?? "";

  const [result, setResult] = useState<{
    status: string;
    message?: string;
    duplicate?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(!!(reference && checkoutToken));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference || !checkoutToken) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setError(null);
      try {
        const res = await apiVerifyEpayclub(reference, checkoutToken);
        if (cancelled) return;
        setResult({
          status: resolveDisplayStatus(res.status, res.duplicate, res.success),
          message: res.message,
          duplicate: res.duplicate,
        });
      } catch (err: unknown) {
        if (cancelled) return;
        let message = t("verify_failed");
        if (axios.isAxiosError(err)) {
          const d = err.response?.data as { message?: string } | undefined;
          message = d?.message ?? err.message ?? message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reference, checkoutToken, t]);

  const balances = balanceState.value;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center mb-2">
          <p className="text-[22px] font-bold leading-none text-white">
            ePay<span className="text-[var(--green-color)]">Club</span>
          </p>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{t("subtitle")}</p>
        </div>

        {!reference || !checkoutToken ? (
          <Card className="border border-white/10 bg-[#0e1824]/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            <CardBody className="flex flex-row items-center gap-3 p-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-500/20 shrink-0">
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-white font-medium">{t("missing_reference")}</p>
                <p className="text-slate-400 text-sm">{t("missing_reference_hint")}</p>
              </div>
            </CardBody>
          </Card>
        ) : loading ? (
          <Card className="border border-white/10 bg-[#0e1824]/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            <CardBody className="flex flex-row items-center gap-3 p-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 shrink-0">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
              <div>
                <p className="text-white font-medium">{t("verifying")}</p>
                <p className="text-slate-400 text-sm">
                  {t("reference")}:{" "}
                  <span className="text-slate-300 font-mono text-xs break-all">
                    {reference}
                  </span>
                </p>
              </div>
            </CardBody>
          </Card>
        ) : error ? (
          <Card className="border border-rose-500/20 bg-[#0e1824]/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            <CardBody className="flex flex-row items-center gap-3 p-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/20 shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium">{t("something_wrong")}</p>
                <p className="text-rose-300 text-sm break-words">{error}</p>
              </div>
            </CardBody>
          </Card>
        ) : result ? (
          (() => {
            const config = getStatusConfig(result.status);
            const Icon = config.icon;
            return (
              <Card className="border border-white/10 bg-[#0e1824]/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
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
                        {t("payment_status")}
                      </p>
                      <p className="text-white text-lg font-semibold capitalize mt-0.5">
                        {t(config.labelKey)}
                      </p>
                      {result.message ? (
                        <p className="text-slate-400 text-sm mt-1 break-words">
                          {result.message}
                        </p>
                      ) : null}
                      <p className="text-slate-500 text-xs font-mono mt-2 break-all">
                        {reference}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })()
        ) : null}

        <Card className="border border-white/10 bg-[#0e1824]/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <CardBody className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FFFFFF20] shrink-0">
                <Wallet className="w-6 h-6 text-white/90" />
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                {t("current_balance")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {CURRENCY_LIST.map((cur) => {
                const cashBalance = Number(balances[cur.code]?.cash?.balance ?? 0);
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            className="w-full bg-[var(--green-color)] font-semibold text-white"
            onPress={() => {
              profileOpenedState.value = {
                isOpen: true,
                defaultTab: "/balance-management/deposit",
              };
            }}
          >
            {t("back_to_deposit")}
          </Button>
          <Button
            variant="bordered"
            className="w-full border-white/15 text-white"
            startContent={<Home className="h-4 w-4" />}
            onPress={() => {
              window.location.href = "/";
            }}
          >
            {t("go_home")}
          </Button>
        </div>
      </div>
    </div>
  );
}
