import { Button, Input, Select, SelectItem } from "@heroui/react";
import axios from "axios";
import {
  CreditCard,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import {
  apiPayEpayclubCard,
  buildEpayclubResultUrl,
} from "@/api/wallet/apiEpayclub";
import { useTranslations } from "@/context/I18nContext";
import { toast } from "@/helpers/toast";
import { userState } from "@/state/userState";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const COUNTRY_OPTIONS = [
  { value: "SA", label: "Saudi Arabia" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "KW", label: "Kuwait" },
  { value: "QA", label: "Qatar" },
  { value: "OM", label: "Oman" },
  { value: "BH", label: "Bahrain" },
  { value: "LB", label: "Lebanon" },
  { value: "JO", label: "Jordan" },
  { value: "IQ", label: "Iraq" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
];

const ALLOWED_COUNTRY_VALUES = new Set(COUNTRY_OPTIONS.map((c) => c.value));

const inputClassNames = {
  label: "text-white/65 text-xs font-medium",
  inputWrapper:
    "bg-white/[0.04] border border-white/10 shadow-none hover:bg-white/[0.06] group-data-[focus=true]:border-emerald-400/45 group-data-[focus=true]:bg-white/[0.06]",
  input: "text-white placeholder:text-white/25",
  description: "text-white/40",
};

function resolveInitialCountry(saved: string | null | undefined): string {
  if (saved && ALLOWED_COUNTRY_VALUES.has(saved.toUpperCase())) {
    return saved.toUpperCase();
  }
  return "";
}

function formatCardDisplay(value: string) {
  return onlyDigits(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function maskCardNumber(value: string) {
  const digits = onlyDigits(value);
  if (!digits) return "•••• •••• •••• ••••";
  const chars = [...digits];
  for (let i = 0; i < chars.length - 4; i++) {
    chars[i] = "•";
  }
  return chars.join("").replace(/(.{4})(?=.)/g, "$1 ");
}

export default function EpayclubCardCheckout() {
  const t = useTranslations("EpayclubCheckout");
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const reference = params.get("reference") || "";
  const checkoutToken = params.get("checkoutToken") || "";
  const isInvalidLink = !reference || !checkoutToken;
  const user = userState.value;

  const [cardnumber, setCardnumber] = useState("");
  const [expirymonth, setExpirymonth] = useState("");
  const [expiryyear, setExpiryyear] = useState("");
  const [cvv, setCvv] = useState("");
  const [street, setStreet] = useState(user?.address || "");
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

  const cardHolder = useMemo(() => {
    const first = user?.firstName?.trim() ?? "";
    const last = user?.lastName?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || t("card_preview_holder");
  }, [user?.firstName, user?.lastName, t]);

  const expiryPreview = useMemo(() => {
    if (!expirymonth && !expiryyear) return "MM/YY";
    return `${expirymonth.padStart(2, "0") || "MM"}/${expiryyear.padStart(2, "0") || "YY"}`;
  }, [expirymonth, expiryyear]);

  useEffect(() => {
    const user = userState.value;
    if (!user) return;

    setStreet(user.address || "");
    setCity(user.city || "");
    setState(user.state || "");
    setCountry(resolveInitialCountry(user.country));
    setZipcode(user.zipCode || "");
  }, [user]);

  const handleSubmit = useCallback(
    async (event: Event) => {
      event.preventDefault();
      if (isInvalidLink) return;

      setIsSubmitting(true);
      setMessage(t("processing"));

      try {
        const upperCountry = country.trim().toUpperCase();
        const res = await apiPayEpayclubCard({
          reference,
          checkoutToken,
          cardnumber: onlyDigits(cardnumber),
          expirymonth,
          expiryyear,
          cvv,
          country: upperCountry,
          billingaddress: {
            street,
            city,
            state,
            country: upperCountry,
            zipcode,
          },
        });

        if (res.redirect_url) {
          window.location.assign(res.redirect_url);
          return;
        }

        if (res.success || res.status?.toUpperCase() === "SUCCESS") {
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
      cardnumber,
      checkoutToken,
      city,
      country,
      cvv,
      expirymonth,
      expiryyear,
      isInvalidLink,
      reference,
      state,
      street,
      t,
      zipcode,
    ],
  );

  return (
    <main className="relative min-h-[75vh] overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold leading-none text-white">
            ePay<span className="text-[var(--green-color)]">Club</span>
          </p>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1520]/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600/30 via-[#0e2230] to-[#0a1520] px-5 py-6 sm:px-6">
            <div
              aria-hidden
              className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl"
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  {t("card_details")}
                </p>
                <p className="mt-3 font-mono text-lg tracking-[0.12em] text-white sm:text-xl">
                  {maskCardNumber(cardnumber)}
                </p>
                <div className="mt-5 flex flex-wrap gap-6 text-xs text-white/70">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">
                      {t("card_preview_holder")}
                    </p>
                    <p className="mt-1 max-w-[180px] truncate font-medium uppercase text-white">
                      {cardHolder}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">
                      {t("card_preview_expires")}
                    </p>
                    <p className="mt-1 font-mono font-medium text-white">
                      {expiryPreview}
                    </p>
                  </div>
                </div>
              </div>
              <CreditCard className="h-9 w-9 shrink-0 text-emerald-300/80" />
            </div>
          </div>

          {isInvalidLink ? (
            <div className="px-5 py-8 sm:px-6">
              <p className="text-center text-sm text-rose-300" role="alert">
                {message}
              </p>
            </div>
          ) : (
            <form
              className="space-y-6 px-5 py-6 sm:px-6"
              autoComplete="on"
              onSubmit={handleSubmit}
            >
              <section className="space-y-3.5">
                <div className="flex items-center gap-2 text-white/80">
                  <CreditCard className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold">{t("card_details")}</h2>
                </div>

                <Input
                  label={t("card_number")}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={formatCardDisplay(cardnumber)}
                  onValueChange={(value) =>
                    setCardnumber(onlyDigits(value).slice(0, 19))
                  }
                  isRequired
                  classNames={inputClassNames}
                  startContent={
                    <CreditCard className="h-4 w-4 text-white/30" />
                  }
                />

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label={t("expiry_month")}
                    inputMode="numeric"
                    autoComplete="cc-exp-month"
                    maxLength={2}
                    placeholder="MM"
                    value={expirymonth}
                    onValueChange={(value) =>
                      setExpirymonth(onlyDigits(value).slice(0, 2))
                    }
                    isRequired
                    classNames={inputClassNames}
                  />
                  <Input
                    label={t("expiry_year")}
                    inputMode="numeric"
                    autoComplete="cc-exp-year"
                    maxLength={2}
                    placeholder="YY"
                    value={expiryyear}
                    onValueChange={(value) =>
                      setExpiryyear(onlyDigits(value).slice(0, 2))
                    }
                    isRequired
                    classNames={inputClassNames}
                  />
                  <Input
                    label={t("cvv")}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    placeholder="•••"
                    type="password"
                    value={cvv}
                    onValueChange={(value) =>
                      setCvv(onlyDigits(value).slice(0, 4))
                    }
                    isRequired
                    classNames={inputClassNames}
                    endContent={<Lock className="h-3.5 w-3.5 text-white/30" />}
                  />
                </div>
              </section>

              <div className="h-px bg-white/8" />

              <section className="space-y-3.5">
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold">{t("billing_details")}</h2>
                </div>

                <Input
                  label={t("street")}
                  autoComplete="billing street-address"
                  value={street}
                  onValueChange={setStreet}
                  isRequired
                  classNames={inputClassNames}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    label={t("city")}
                    autoComplete="billing address-level2"
                    value={city}
                    onValueChange={setCity}
                    isRequired
                    classNames={inputClassNames}
                  />
                  <Input
                    label={t("state")}
                    autoComplete="billing address-level1"
                    value={state}
                    onValueChange={setState}
                    isRequired
                    classNames={inputClassNames}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Select
                    label={t("country")}
                    placeholder={t("select_country")}
                    selectedKeys={country ? [country] : []}
                    variant="bordered"
                    onSelectionChange={(keys) =>
                      setCountry(Array.from(keys as Set<string>)[0] ?? "")
                    }
                    isRequired
                    classNames={{
                      label: inputClassNames.label,
                      trigger:
                        "bg-white/[0.04] border-white/10 data-[hover=true]:bg-white/[0.06] data-[focus=true]:border-emerald-400/45",
                      value: "text-white",
                      popoverContent: "bg-[#0e1824] border border-white/10",
                    }}
                    popoverProps={{
                      shouldCloseOnScroll: false,
                      shouldBlockScroll: true,
                    }}
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <SelectItem key={c.value} textValue={c.label}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label={t("zip_code")}
                    autoComplete="billing postal-code"
                    value={zipcode}
                    onValueChange={setZipcode}
                    isRequired
                    classNames={inputClassNames}
                  />
                </div>
              </section>

              <div className="space-y-3 pt-1">
                <Button
                  type="submit"
                  className="min-h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-base font-bold text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  startContent={
                    !isSubmitting ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : undefined
                  }
                >
                  {t("pay_now")}
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-white/40">
                  <Lock className="h-3 w-3" />
                  {t("secured_by")}
                </p>

                {message ? (
                  <p
                    className={`text-center text-sm leading-snug ${
                      message === t("processing")
                        ? "text-amber-300"
                        : "text-rose-300"
                    }`}
                    role="status"
                  >
                    {message}
                  </p>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
