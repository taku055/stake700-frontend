import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Button, Input, Spinner } from "@heroui/react";
import axios from "axios";
import {
  apiCreateEpayclubDeposit,
  apiCreateEpayclubLinkDeposit,
  apiGetEpayclubDepositOptions,
} from "@/api/wallet/apiEpayclub";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import {
  getEpayclubProfileMissing,
  type EpayclubProfileField,
} from "@/helpers/epayclubProfile";
import { profileOpenedState } from "@/state/profileOpenedState";
import { saveEpayclubCheckout } from "@/helpers/epayclubSession";
import {
  DEFAULT_EPAYCLUB_DEPOSIT_OPTIONS,
  extractEpayclubCheckoutSession,
  resolveEpayclubCheckoutTarget,
  resolveEpayclubDepositMethod,
  type EpayclubDepositMethod,
  type EpayclubDepositOptions,
} from "@/helpers/epayclubDeposit";

const PROFILE_FIELD_KEYS: Record<EpayclubProfileField, string> = {
  firstName: "EPayClub_missing_field_firstName",
  lastName: "EPayClub_missing_field_lastName",
  email: "EPayClub_missing_field_email",
  phone: "EPayClub_missing_field_phone",
  country: "EPayClub_missing_field_country",
};

export default function EpayclubDeposit() {
  const t = useTranslations("UserBalancePage");
  const location = useLocation();
  const [amount, setAmount] = useState("");
  const [options, setOptions] = useState<EpayclubDepositOptions>(
    DEFAULT_EPAYCLUB_DEPOSIT_OPTIONS,
  );
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [method, setMethod] = useState<EpayclubDepositMethod>("payment_link");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const nextOptions = await apiGetEpayclubDepositOptions();
        if (cancelled) return;
        setOptions(nextOptions);
        setMethod(
          resolveEpayclubDepositMethod(nextOptions, window.location.search),
        );
      } catch {
        if (cancelled) return;
        setOptions(DEFAULT_EPAYCLUB_DEPOSIT_OPTIONS);
        setMethod(
          resolveEpayclubDepositMethod(
            DEFAULT_EPAYCLUB_DEPOSIT_OPTIONS,
            window.location.search,
          ),
        );
      } finally {
        if (!cancelled) setOptionsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const missingProfileFields = useMemo(
    () => getEpayclubProfileMissing(userState.value),
    [userState.value],
  );
  const isProfileIncomplete = missingProfileFields.length > 0;
  const showMethodPicker = options.enabled;
  const isProviderDisabled = optionsLoaded && !options.enabled;
  const isMethodDisabled =
    optionsLoaded &&
    !options.payment_link_enabled &&
    !options.card_checkout_enabled;

  const methodLabel =
    method === "payment_link"
      ? t("EPayClub_payment_link")
      : t("EPayClub card checkout");

  const handleDeposit = useCallback(async () => {
    setError("");

    if (isProviderDisabled || isMethodDisabled) {
      setError(t("EPayClub_unavailable"));
      return;
    }

    if (method === "card" && !options.card_checkout_enabled) {
      setError(t("EPayClub_card_unavailable"));
      return;
    }
    if (method === "payment_link" && !options.payment_link_enabled) {
      setError(t("EPayClub_link_unavailable"));
      return;
    }

    if (isProfileIncomplete) {
      setError(t("EPayClub_incomplete_profile"));
      return;
    }

    const num = Number.parseFloat(amount.replace(",", "."));
    if (!Number.isFinite(num) || num <= 0) {
      setError(t("EPayClub_invalid_amount"));
      return;
    }
    if (num < options.min_amount || num > options.max_amount) {
      setError(
        t("EPayClub_amount_range", {
          min: String(options.min_amount),
          max: String(options.max_amount),
          currency: options.currency,
        }),
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const promoId =
        new URLSearchParams(window.location.search).get("promo") ?? undefined;
      const createDeposit =
        method === "payment_link"
          ? apiCreateEpayclubLinkDeposit
          : apiCreateEpayclubDeposit;
      const res = await createDeposit(num, promoId);
      const checkoutTarget = resolveEpayclubCheckoutTarget(res, method);
      const session = extractEpayclubCheckoutSession(res);

      if (session) {
        saveEpayclubCheckout(
          session.reference,
          session.checkoutToken,
          num,
          options.currency,
        );
      }

      if (checkoutTarget?.type === "internal") {
        profileOpenedState.value = { isOpen: false };
        const checkoutUrl = new URL(checkoutTarget.path, window.location.origin);
        checkoutUrl.searchParams.set("amount", String(num));
        checkoutUrl.searchParams.set("currency", options.currency);
        location.route(`${checkoutUrl.pathname}${checkoutUrl.search}`);
        return;
      }

      if (checkoutTarget?.type === "external") {
        profileOpenedState.value = { isOpen: false };
        window.location.assign(checkoutTarget.url);
        return;
      }

      const msg = res.message || t("EPayClub_checkout_failed");
      setError(msg);
      toast.error(msg);
    } catch (err: unknown) {
      let message = t("EPayClub_error");
      if (axios.isAxiosError(err)) {
        const d = err.response?.data as { message?: string } | undefined;
        message = d?.message ?? err.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    amount,
    isMethodDisabled,
    isProfileIncomplete,
    isProviderDisabled,
    location,
    method,
    options.card_checkout_enabled,
    options.payment_link_enabled,
    options.max_amount,
    options.min_amount,
    t,
  ]);

  const selectMethod = useCallback(
    (next: EpayclubDepositMethod) => {
      if (next === "payment_link" && !options.payment_link_enabled) return;
      if (next === "card" && !options.card_checkout_enabled) return;
      setMethod(next);
      setError("");
    },
    [options.card_checkout_enabled, options.payment_link_enabled],
  );

  const openProfile = useCallback(() => {
    profileOpenedState.value = {
      isOpen: true,
      defaultTab: "/my-profile/personal-details",
    };
  }, []);

  if (!optionsLoaded) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <Spinner color="success" />
      </div>
    );
  }

  if (isProviderDisabled || isMethodDisabled) {
    return (
      <div className="flex flex-col w-full max-w-md mx-auto gap-4 py-6 text-center">
        <p className="text-sm text-white/70">{t("EPayClub_unavailable")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto gap-6 py-2">
      <div className="flex justify-center">
        <div className="flex min-w-[min(100%,280px)] flex-col items-center justify-center rounded-lg border border-emerald-400/35 bg-[#0e1824] px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-[22px] font-bold leading-none text-white">
            ePay<span className="text-[var(--green-color)]">Club</span>
          </span>
          <span className="mt-2 text-sm font-semibold text-white/75">
            {methodLabel}
          </span>
        </div>
      </div>

      {showMethodPicker ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-white/70">{t("EPayClub_deposit_method")}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={method === "payment_link"}
              disabled={!options.payment_link_enabled}
              onClick={() => selectMethod("payment_link")}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                method === "payment_link"
                  ? "border-emerald-400/60 bg-emerald-500/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.06]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {t("EPayClub_payment_link")}
            </button>
            <button
              type="button"
              aria-pressed={method === "card"}
              disabled={!options.card_checkout_enabled}
              onClick={() => selectMethod("card")}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                method === "card"
                  ? "border-emerald-400/60 bg-emerald-500/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.06]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {t("EPayClub card checkout")}
            </button>
          </div>
        </div>
      ) : null}

      {method === "payment_link" ? (
        <p className="text-xs text-white/50 leading-relaxed">
          {t("EPayClub_payment_link_hint")}
        </p>
      ) : (
        <p className="text-xs text-white/50 leading-relaxed">
          {t("EPayClub_card_checkout_hint")}
        </p>
      )}

      {isProfileIncomplete ? (
        <div
          className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3"
          role="alert"
        >
          <p className="text-sm text-amber-100">{t("EPayClub_incomplete_profile")}</p>
          <ul className="mt-2 list-inside list-disc text-xs text-amber-200/80">
            {missingProfileFields.map((field) => (
              <li key={field}>{t(PROFILE_FIELD_KEYS[field])}</li>
            ))}
          </ul>
          <Button
            size="sm"
            className="mt-3 bg-amber-500/90 text-white"
            onPress={openProfile}
          >
            {t("EPayClub_complete_profile")}
          </Button>
        </div>
      ) : null}

      <Input
        type="number"
        label={t("Amount")}
        placeholder="0"
        value={amount}
        onValueChange={setAmount}
        min={options.min_amount}
        max={options.max_amount}
        step="any"
        isRequired
        isDisabled={isProfileIncomplete}
        description={t("EPayClub_amount_range", {
          min: String(options.min_amount),
          max: String(options.max_amount),
          currency: options.currency,
        })}
        classNames={{ input: "text-start" }}
      />

      {error ? (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        className="w-full bg-[var(--green-color)] text-white hover:bg-[var(--green-color)]/90"
        isLoading={isSubmitting}
        isDisabled={isSubmitting || isProfileIncomplete}
        onPress={handleDeposit}
      >
        {method === "payment_link" ? t("EPayClub_continue_to_checkout") : t("Deposit")}
      </Button>
    </div>
  );
}
