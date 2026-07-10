import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-preact";
import axios from "axios";
import { useTranslations } from "@/context/I18nContext";
import { apiVerifyEpayclubWithPolling } from "@/api/wallet/apiEpayclub";
import {
  clearEpayclubCheckout,
  loadEpayclubCheckout,
} from "@/helpers/epayclubSession";
import { CHECKOUT } from "./components/checkoutTheme";
import { CheckoutFooter, CheckoutLogo } from "./components/CheckoutTrust";

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
  const savedSession = loadEpayclubCheckout();
  const reference = location.query.reference ?? savedSession?.reference ?? "";
  const checkoutToken =
    location.query.checkoutToken ?? savedSession?.checkoutToken ?? "";

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
        const res = await apiVerifyEpayclubWithPolling(reference, checkoutToken);
        if (cancelled) return;
        const displayStatus = resolveDisplayStatus(
          res.status,
          res.duplicate,
          res.success,
        );
        setResult({
          status: displayStatus,
          message: res.message,
          duplicate: res.duplicate,
        });
        if (displayStatus === "success" || res.duplicate) {
          clearEpayclubCheckout();
        }
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

  const isSuccess = result?.status === "success" || result?.status === "completed";
  const isFailed = result?.status === "failed";
  const isPending =
    result?.status === "pending" ||
    result?.status === "pending_callback" ||
    result?.status === "created";

  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-6 sm:py-16"
      style={{ backgroundColor: CHECKOUT.bg }}
    >
      <div className="mx-auto w-full max-w-[560px] animate-[fadeSlideIn_300ms_ease-out]">
        <header className="mb-8">
          <CheckoutLogo />
        </header>

        <div
          className="overflow-hidden rounded-2xl border px-6 py-10 text-center sm:px-8"
          style={{
            backgroundColor: CHECKOUT.card,
            borderColor: CHECKOUT.border,
            boxShadow: CHECKOUT.shadow,
          }}
        >
          {!reference || !checkoutToken ? (
            <div className="space-y-3">
              <AlertCircle className="mx-auto h-12 w-12 text-[#94A3B8]" aria-hidden />
              <h1 className="text-xl font-semibold text-[#F8FAFC]">
                {t("missing_reference")}
              </h1>
              <p className="text-sm text-[#94A3B8]">{t("missing_reference_hint")}</p>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              <Loader2
                className="mx-auto h-12 w-12 animate-spin text-[#00C16A]"
                aria-hidden
              />
              <h1 className="text-xl font-semibold text-[#F8FAFC]">
                {t("verifying")}
              </h1>
              <p className="text-sm text-[#94A3B8]">
                {t("reference")}:{" "}
                <span className="font-mono text-xs text-[#64748B]">{reference}</span>
              </p>
            </div>
          ) : error ? (
            <div className="space-y-3">
              <AlertCircle className="mx-auto h-12 w-12 text-[#F87171]" aria-hidden />
              <h1 className="text-xl font-semibold text-[#F8FAFC]">
                {t("something_wrong")}
              </h1>
              <p className="text-sm text-[#F87171]">{error}</p>
            </div>
          ) : isSuccess ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00C16A]/15">
                <CheckCircle2 className="h-9 w-9 text-[#00C16A]" aria-hidden />
              </div>
              <h1 className="text-2xl font-semibold text-[#F8FAFC]">
                {t("success_title")}
              </h1>
              <p className="text-sm leading-relaxed text-[#94A3B8]">
                {t("success_message")}
              </p>
              <p className="text-sm text-[#64748B]">{t("success_receipt")}</p>
              <button
                type="button"
                className="mt-4 h-12 w-full rounded-xl bg-[#00C16A] text-base font-semibold text-white transition-all duration-200 hover:bg-[#00D676] hover:shadow-[0_8px_24px_rgba(0,193,106,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C16A]/50"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                {t("return_to_merchant")}
              </button>
            </div>
          ) : isFailed ? (
            <div className="space-y-4">
              <AlertCircle className="mx-auto h-12 w-12 text-[#F87171]" aria-hidden />
              <h1 className="text-xl font-semibold text-[#F8FAFC]">
                {t("Failed")}
              </h1>
              {result?.message ? (
                <p className="text-sm text-[#94A3B8]">{result.message}</p>
              ) : null}
              <button
                type="button"
                className="mt-2 h-12 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-transparent text-base font-medium text-[#F8FAFC] transition-colors duration-200 hover:bg-white/[0.04]"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                {t("return_to_merchant")}
              </button>
            </div>
          ) : isPending ? (
            <div className="space-y-4">
              <Loader2
                className="mx-auto h-12 w-12 animate-spin text-[#F59E0B]"
                aria-hidden
              />
              <h1 className="text-xl font-semibold text-[#F8FAFC]">
                {t("Pending")}
              </h1>
              {result?.message ? (
                <p className="text-sm text-[#94A3B8]">{result.message}</p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              <AlertCircle className="mx-auto h-12 w-12 text-[#94A3B8]" aria-hidden />
              <h1 className="text-xl font-semibold text-[#F8FAFC]">
                {t("Unknown")}
              </h1>
            </div>
          )}
        </div>

        <CheckoutFooter />
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
