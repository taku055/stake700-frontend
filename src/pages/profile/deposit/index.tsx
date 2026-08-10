import { useEffect, useMemo } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Button, Card, CardBody } from "@heroui/react";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Home,
  RotateCcw,
  Wallet,
} from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { profileOpenedState } from "@/state/profileOpenedState";
import { userState } from "@/state/userState";
import { apiGetUserBalance } from "@/api/ledger/apiGetUserBalance";

type DepositResultKind = "success" | "failed" | "unknown";

function normalizeStatus(raw: string | undefined): DepositResultKind {
  const status = (raw ?? "").trim().toLowerCase();
  if (status === "success" || status === "approved" || status === "completed") {
    return "success";
  }
  if (
    status === "fail" ||
    status === "failed" ||
    status === "failure" ||
    status === "declined" ||
    status === "error" ||
    status === "cancelled" ||
    status === "canceled"
  ) {
    return "failed";
  }
  return "unknown";
}

function formatBalanceAmount(amount: number, symbol: string) {
  const formatted = amount.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol} ${formatted}`.trim();
}

export default function DepositPaymentResultPage() {
  const t = useTranslations("DepositPaymentResult");
  const location = useLocation();
  const statusRaw = location.query?.status;
  const resultKind = normalizeStatus(statusRaw);
  const orderRef =
    location.query?.merchant_order ||
    location.query?.client_orderid ||
    location.query?.order_id ||
    location.query?.orderid;

  useEffect(() => {
    const userId = userState.value?.id;
    if (!userId || resultKind !== "success") return;

    let cancelled = false;
    (async () => {
      try {
        const cur = currencyState.value;
        const data = await apiGetUserBalance(userId, cur.code);
        if (cancelled) return;
        balanceState.value = {
          ...balanceState.value,
          [data.currencyCode]: data,
        };
      } catch {
        // Balance refresh is best-effort after redirect.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resultKind]);

  const openDeposit = () => {
    profileOpenedState.value = {
      isOpen: true,
      defaultTab: "/balance-management/deposit",
    };
    location.route("/");
  };

  const goHome = () => {
    location.route("/");
  };

  const config =
    resultKind === "success"
      ? {
          icon: CheckCircle2,
          title: t("Deposit successful"),
          description: t("Deposit success description"),
          iconClass: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
          cardBorder: "border-emerald-500/25",
        }
      : resultKind === "failed"
        ? {
            icon: AlertCircle,
            title: t("Deposit failed"),
            description: t("Deposit failed description"),
            iconClass: "text-rose-400 bg-rose-500/15 border-rose-500/30",
            cardBorder: "border-rose-500/25",
          }
        : {
            icon: HelpCircle,
            title: t("Deposit status unknown"),
            description: t("Deposit unknown description"),
            iconClass: "text-amber-400 bg-amber-500/15 border-amber-500/30",
            cardBorder: "border-amber-500/25",
          };

  const Icon = config.icon;
  const isLoggedIn = !!userState.value?.id;

  const { cashBalance, bonusBalance, currencyCode, currencySymbol } =
    useMemo(() => {
      const cur = currencyState.value;
      const cash = Number(balanceState.value?.[cur.code]?.cash?.balance ?? 0);
      const bonus = Number(balanceState.value?.[cur.code]?.bonus?.balance ?? 0);
      return {
        cashBalance: cash,
        bonusBalance: bonus,
        currencyCode: cur.code,
        currencySymbol: cur.symbol ?? "$",
      };
    }, [balanceState.value, currencyState.value]);

  return (
    <div className="min-h-[calc(100dvh-12rem)] w-full flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg mx-auto space-y-5">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t("Payment result")}
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            {t("Finera deposit redirect")}
          </p>
        </div>

        <Card
          className={`border bg-[#0c1628]/80 shadow-[0_1px_4px_0_#1B1B1B80] ${config.cardBorder}`}
        >
          <CardBody className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full border ${config.iconClass}`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <p className="text-white text-xl font-semibold">{config.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                  {config.description}
                </p>
                {orderRef ? (
                  <p className="text-slate-500 text-xs font-mono mt-2 break-all px-2">
                    {t("Reference")}: {orderRef}
                  </p>
                ) : null}
              </div>
            </div>
          </CardBody>
        </Card>

        {isLoggedIn && resultKind === "success" ? (
          <Card className="border border-white/10 bg-[#0c1628]/80 shadow-[0_1px_4px_0_#1B1B1B80]">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 shrink-0">
                  <Wallet className="w-6 h-6 text-white/90" />
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                  {t("Current balance")}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300 text-sm font-medium">
                    {currencyCode}
                  </span>
                  <p className="text-white text-xl sm:text-2xl font-bold leading-tight tabular-nums">
                    {formatBalanceAmount(cashBalance, currencySymbol)}
                  </p>
                </div>
                {bonusBalance > 0 ? (
                  <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-white/10">
                    <span className="text-slate-500 text-xs">{t("Bonus")}</span>
                    <p className="text-slate-300 text-sm font-semibold tabular-nums">
                      {formatBalanceAmount(bonusBalance, currencySymbol)}
                    </p>
                  </div>
                ) : null}
              </div>
            </CardBody>
          </Card>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {resultKind === "failed" || resultKind === "unknown" ? (
            <Button
              className="flex-1 h-11 bg-[var(--green-color)] text-white font-semibold"
              startContent={<RotateCcw className="w-4 h-4" />}
              onPress={openDeposit}
            >
              {t("Try again")}
            </Button>
          ) : (
            <Button
              className="flex-1 h-11 bg-[var(--green-color)] text-white font-semibold"
              startContent={<Wallet className="w-4 h-4" />}
              onPress={openDeposit}
            >
              {t("Deposit again")}
            </Button>
          )}
          <Button
            variant="bordered"
            className="flex-1 h-11 border-white/25 text-white font-medium"
            startContent={<Home className="w-4 h-4" />}
            onPress={goHome}
          >
            {t("Back to home")}
          </Button>
        </div>

        {!isLoggedIn ? (
          <p className="text-center text-xs text-slate-500">{t("Login hint")}</p>
        ) : null}
      </div>
    </div>
  );
}
