import axios from "axios";
import { Loader2 } from "lucide-preact";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  apiPayEpayclubCard,
  buildEpayclubResultUrl,
} from "@/api/wallet/apiEpayclub";
import { useTranslations } from "@/context/I18nContext";
import { toast } from "@/helpers/toast";
import { loadEpayclubCheckout, saveEpayclubCheckout } from "@/helpers/epayclubSession";
import { userState } from "@/state/userState";
import { CheckoutField } from "./components/CheckoutField";
import { CountryCombobox } from "./components/CountryCombobox";
import { CvvTooltip } from "./components/CvvTooltip";
import {
  AcceptedPaymentLogos,
  CardBrandIcon,
} from "./components/PaymentBrandIcons";
import {
  CheckoutFooter,
  CheckoutLogo,
  CheckoutSecureNote,
  CheckoutTrustBadges,
} from "./components/CheckoutTrust";
import {
  detectCardBrand,
  expectedCvvLength,
  formatCardNumber,
  isExpiryValid,
  luhnCheck,
  maxCardDigits,
  onlyDigits,
} from "./components/cardBrand";
import { CHECKOUT } from "./components/checkoutTheme";

type FieldErrors = Partial<
  Record<
    | "cardnumber"
    | "expirymonth"
    | "expiryyear"
    | "cvv"
    | "street"
    | "city"
    | "state"
    | "country"
    | "zipcode",
    string
  >
>;

function resolveInitialCountry(saved: string | null | undefined): string {
  if (!saved) return "";
  return saved.trim().toUpperCase();
}

function formatPayAmount(amount: number | null, currency: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function EpayclubCardCheckout() {
  const t = useTranslations("EpayclubCheckout");
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const reference = params.get("reference") || "";
  const checkoutToken = params.get("checkoutToken") || "";
  const isInvalidLink = !reference || !checkoutToken;
  const user = userState.value;
  const savedSession = loadEpayclubCheckout();

  const amountParam = params.get("amount");
  const currencyParam = params.get("currency");
  const payAmount = useMemo(() => {
    const raw = amountParam ?? savedSession?.amount;
    const parsed = raw == null ? null : Number(raw);
    return parsed != null && Number.isFinite(parsed) ? parsed : null;
  }, [amountParam, savedSession?.amount]);
  const payCurrency = currencyParam || savedSession?.currency || "USD";
  const formattedAmount = formatPayAmount(payAmount, payCurrency);

  const [cardnumber, setCardnumber] = useState("");
  const [expirymonth, setExpirymonth] = useState("");
  const [expiryyear, setExpiryyear] = useState("");
  const [cvv, setCvv] = useState("");
  const [street, setStreet] = useState(user?.address || "");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [country, setCountry] = useState(() =>
    resolveInitialCountry(user?.country),
  );
  const [zipcode, setZipcode] = useState(user?.zipCode || "");
  const [message, setMessage] = useState(
    isInvalidLink ? t("invalid_link") : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  const cardDigits = onlyDigits(cardnumber);
  const cardBrand = detectCardBrand(cardDigits);

  useEffect(() => {
    const nextUser = userState.value;
    if (!nextUser) return;
    setStreet(nextUser.address || "");
    setCity(nextUser.city || "");
    setState(nextUser.state || "");
    setCountry(resolveInitialCountry(nextUser.country));
    setZipcode(nextUser.zipCode || "");
  }, [user]);

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};
    const show = (field: keyof FieldErrors) => submitted || touched[field];

    if (show("cardnumber")) {
      if (!cardDigits) next.cardnumber = t("error_required");
      else if (cardDigits.length < 13) next.cardnumber = t("error_card_invalid");
      else if (!luhnCheck(cardDigits)) next.cardnumber = t("error_card_invalid");
    }

    if (show("expirymonth")) {
      if (!expirymonth) next.expirymonth = t("error_required");
      else if (!/^(0[1-9]|1[0-2])$/.test(expirymonth)) {
        next.expirymonth = t("error_expiry_invalid");
      }
    }

    if (show("expiryyear")) {
      if (!expiryyear) next.expiryyear = t("error_required");
      else if (!isExpiryValid(expirymonth, expiryyear)) {
        next.expiryyear = t("error_expiry_invalid");
      }
    }

    if (show("cvv")) {
      const len = expectedCvvLength(cardBrand);
      if (!cvv) next.cvv = t("error_required");
      else if (cvv.length < len) next.cvv = t("error_cvv_invalid");
    }

    if (show("street") && !street.trim()) next.street = t("error_required");
    if (show("city") && !city.trim()) next.city = t("error_required");
    if (show("state") && !state.trim()) next.state = t("error_required");
    if (show("country") && !country) next.country = t("error_required");
    if (show("zipcode") && !zipcode.trim()) next.zipcode = t("error_required");

    return next;
  }, [
    cardBrand,
    cardDigits,
    city,
    country,
    cvv,
    expirymonth,
    expiryyear,
    state,
    street,
    submitted,
    t,
    touched,
    zipcode,
  ]);

  const isFormValid = useMemo(() => {
    const len = expectedCvvLength(cardBrand);
    return (
      cardDigits.length >= 13 &&
      luhnCheck(cardDigits) &&
      /^(0[1-9]|1[0-2])$/.test(expirymonth) &&
      isExpiryValid(expirymonth, expiryyear) &&
      cvv.length >= len &&
      street.trim() &&
      city.trim() &&
      state.trim() &&
      country &&
      zipcode.trim()
    );
  }, [
    cardBrand,
    cardDigits,
    city,
    country,
    cvv,
    expirymonth,
    expiryyear,
    state,
    street,
    zipcode,
  ]);

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleCardChange = (value: string) => {
    const digits = onlyDigits(value).slice(0, maxCardDigits(detectCardBrand(onlyDigits(value))));
    setCardnumber(digits);
    const brand = detectCardBrand(digits);
    const maxLen = maxCardDigits(brand);
    if (digits.length >= maxLen) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (value: string) => {
    const digits = onlyDigits(value).slice(0, 2);
    setExpirymonth(digits);
    if (digits.length === 2) yearRef.current?.focus();
  };

  const handleYearChange = (value: string) => {
    const digits = onlyDigits(value).slice(0, 2);
    setExpiryyear(digits);
    if (digits.length === 2) cvvRef.current?.focus();
  };

  const handleSubmit = useCallback(
    async (event: Event) => {
      event.preventDefault();
      if (isInvalidLink) return;

      setSubmitted(true);
      if (!isFormValid) return;

      setIsSubmitting(true);
      setMessage(t("processing"));

      const billingStreet = apartment.trim()
        ? `${street.trim()}, ${apartment.trim()}`
        : street.trim();

      try {
        const upperCountry = country.trim().toUpperCase();
        const res = await apiPayEpayclubCard({
          reference,
          checkoutToken,
          cardnumber: cardDigits,
          expirymonth,
          expiryyear,
          cvv,
          country: upperCountry,
          authOption: "3DS",
          billingaddress: {
            street: billingStreet,
            city: city.trim(),
            state: state.trim(),
            country: upperCountry,
            zipcode: zipcode.trim(),
          },
        });

        saveEpayclubCheckout(
          reference,
          checkoutToken,
          payAmount ?? undefined,
          payCurrency,
        );

        if (res.redirect_url) {
          window.location.href = res.redirect_url;
          return;
        }

        if (
          res.success ||
          res.status?.toUpperCase() === "SUCCESS" ||
          res.status?.toUpperCase() === "PENDING_AUTHENTICATION"
        ) {
          window.location.assign(buildEpayclubResultUrl(reference, checkoutToken));
          return;
        }

        setMessage(res.message || t("payment_failed"));
      } catch (err: unknown) {
        let nextMessage = t("payment_failed");
        if (axios.isAxiosError(err)) {
          const d = err.response?.data as { message?: string } | undefined;
          nextMessage = d?.message ?? err.message ?? nextMessage;
        } else if (err instanceof Error) {
          nextMessage = err.message;
        }
        setMessage(nextMessage);
        toast.error(nextMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      apartment,
      cardDigits,
      checkoutToken,
      city,
      country,
      cvv,
      expirymonth,
      expiryyear,
      isFormValid,
      isInvalidLink,
      payAmount,
      payCurrency,
      reference,
      state,
      street,
      t,
      zipcode,
    ],
  );

  const payButtonLabel = formattedAmount
    ? t("pay_amount_securely", { amount: formattedAmount })
    : t("pay_now");

  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-6 sm:py-16"
      style={{ backgroundColor: CHECKOUT.bg }}
    >
      <div className="mx-auto w-full max-w-[560px] animate-[fadeSlideIn_300ms_ease-out]">
        <header className="mb-8 space-y-4 text-center">
          <CheckoutLogo />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-[28px]">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-[#94A3B8]">
              {t("subtitle")}
            </p>
          </div>
          <AcceptedPaymentLogos />
        </header>

        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: CHECKOUT.card,
            borderColor: CHECKOUT.border,
            boxShadow: CHECKOUT.shadow,
          }}
        >
          {isInvalidLink ? (
            <div className="px-6 py-10 sm:px-8">
              <p
                className="text-center text-sm text-[#F87171]"
                role="alert"
              >
                {message}
              </p>
            </div>
          ) : (
            <form
              className="space-y-8 px-6 py-8 sm:px-8"
              autoComplete="on"
              onSubmit={handleSubmit}
              noValidate
            >
              <fieldset
                disabled={isSubmitting}
                className="space-y-6 border-0 p-0 m-0 min-w-0"
              >
                <section className="space-y-4" aria-labelledby="card-section">
                  <h2
                    id="card-section"
                    className="text-sm font-medium text-[#F8FAFC]"
                  >
                    {t("card_details")}
                  </h2>

                  <CheckoutField
                    label={t("card_number")}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={formatCardNumber(cardnumber)}
                    onValueChange={handleCardChange}
                    onBlurValidate={() => markTouched("cardnumber")}
                    error={errors.cardnumber}
                    success={
                      Boolean(cardDigits) &&
                      !errors.cardnumber &&
                      luhnCheck(cardDigits)
                    }
                    endContent={
                      cardBrand !== "unknown" ? (
                        <CardBrandIcon brand={cardBrand} className="h-5 w-auto text-[#94A3B8]" />
                      ) : undefined
                    }
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <CheckoutField
                      label={t("expiry_month")}
                      inputMode="numeric"
                      autoComplete="cc-exp-month"
                      maxLength={2}
                      value={expirymonth}
                      onValueChange={handleMonthChange}
                      inputRef={(el) => {
                        monthRef.current = el;
                      }}
                      onBlurValidate={() => markTouched("expirymonth")}
                      error={errors.expirymonth}
                      success={Boolean(expirymonth) && !errors.expirymonth}
                    />
                    <CheckoutField
                      label={t("expiry_year")}
                      inputMode="numeric"
                      autoComplete="cc-exp-year"
                      maxLength={2}
                      value={expiryyear}
                      onValueChange={handleYearChange}
                      inputRef={(el) => {
                        yearRef.current = el;
                      }}
                      onBlurValidate={() => markTouched("expiryyear")}
                      error={errors.expiryyear}
                      success={Boolean(expiryyear) && !errors.expiryyear}
                    />
                    <CheckoutField
                      label={t("cvv")}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={expectedCvvLength(cardBrand)}
                      type="password"
                      value={cvv}
                      onValueChange={(value) =>
                        setCvv(onlyDigits(value).slice(0, expectedCvvLength(cardBrand)))
                      }
                      inputRef={(el) => {
                        cvvRef.current = el;
                      }}
                      onBlurValidate={() => markTouched("cvv")}
                      error={errors.cvv}
                      success={Boolean(cvv) && !errors.cvv}
                      endContent={<CvvTooltip text={t("cvv_tooltip")} />}
                    />
                  </div>
                </section>

                <div className="h-px bg-[rgba(255,255,255,0.08)]" aria-hidden />

                <section className="space-y-4" aria-labelledby="billing-section">
                  <h2
                    id="billing-section"
                    className="text-sm font-medium text-[#F8FAFC]"
                  >
                    {t("billing_details")}
                  </h2>

                  <CheckoutField
                    label={t("street")}
                    autoComplete="billing street-address"
                    value={street}
                    onValueChange={setStreet}
                    onBlurValidate={() => markTouched("street")}
                    error={errors.street}
                    success={Boolean(street.trim()) && !errors.street}
                  />

                  <CheckoutField
                    label={t("apartment")}
                    autoComplete="billing address-line2"
                    value={apartment}
                    onValueChange={setApartment}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CheckoutField
                      label={t("city")}
                      autoComplete="billing address-level2"
                      value={city}
                      onValueChange={setCity}
                      onBlurValidate={() => markTouched("city")}
                      error={errors.city}
                      success={Boolean(city.trim()) && !errors.city}
                    />
                    <CheckoutField
                      label={t("state")}
                      autoComplete="billing address-level1"
                      value={state}
                      onValueChange={setState}
                      onBlurValidate={() => markTouched("state")}
                      error={errors.state}
                      success={Boolean(state.trim()) && !errors.state}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CountryCombobox
                      label={t("country")}
                      value={country}
                      onChange={(code) => {
                        setCountry(code);
                        markTouched("country");
                      }}
                      error={errors.country}
                      disabled={isSubmitting}
                    />
                    <CheckoutField
                      label={t("zip_code")}
                      autoComplete="billing postal-code"
                      value={zipcode}
                      onValueChange={setZipcode}
                      onBlurValidate={() => markTouched("zipcode")}
                      error={errors.zipcode}
                      success={Boolean(zipcode.trim()) && !errors.zipcode}
                    />
                  </div>
                </section>
              </fieldset>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#00C16A] text-base font-semibold text-white transition-all duration-200 hover:bg-[#00D676] hover:shadow-[0_8px_24px_rgba(0,193,106,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C16A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131B2C] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                      {t("processing")}
                    </>
                  ) : (
                    payButtonLabel
                  )}
                </button>

                <CheckoutTrustBadges />
                <CheckoutSecureNote />

                {message && message !== t("processing") ? (
                  <p
                    className="text-center text-sm text-[#F87171]"
                    role="alert"
                  >
                    {message}
                  </p>
                ) : null}
              </div>
            </form>
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
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </main>
  );
}
