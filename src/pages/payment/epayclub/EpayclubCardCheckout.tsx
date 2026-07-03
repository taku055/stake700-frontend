import { Button, Input, Select, SelectItem } from "@heroui/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { apiPayEpayclubCard } from "@/api/wallet/apiEpayclub";
import { toast } from "@/helpers/toast";
import { userState } from "@/state/userState";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const COUNTRY_OPTIONS = [
  { value: "SA", label: "Saudi Arabia", dial: "+966" },
  { value: "AE", label: "United Arab Emirates", dial: "+971" },
  { value: "KW", label: "Kuwait", dial: "+965" },
  { value: "QA", label: "Qatar", dial: "+974" },
  { value: "OM", label: "Oman", dial: "+968" },
  { value: "BH", label: "Bahrain", dial: "+973" },
  { value: "LB", label: "Lebanon", dial: "+961" },
  { value: "JO", label: "Jordan", dial: "+962" },
  { value: "IQ", label: "Iraq", dial: "+964" },
  { value: "GB", label: "United Kingdom", dial: "+44" },
  { value: "US", label: "United States", dial: "+1" },
];

const ALLOWED_COUNTRY_VALUES = new Set(COUNTRY_OPTIONS.map((c) => c.value));

function resolveInitialCountry(saved: string | null | undefined): string {
  if (saved && ALLOWED_COUNTRY_VALUES.has(saved.toUpperCase())) {
    return saved.toUpperCase();
  }
  return "";
}

export default function EpayclubCardCheckout() {
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
  const [country, setCountry] = useState(() => resolveInitialCountry(user?.country));
  const [zipcode, setZipcode] = useState(user?.zipCode || "");
  const [message, setMessage] = useState(
    isInvalidLink ? "Checkout link is invalid." : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = userState.value;
    if (!user) {
      return;
    }

    setStreet(user.address || "");
    setCity(user.city || "");
    setState(user.state || "");
    setCountry(resolveInitialCountry(user.country));
    setZipcode(user.zipCode || "");
  }, [user]);

  const handleSubmit = useCallback(
    async (event: Event) => {
      event.preventDefault();
      if (isInvalidLink) {
        return;
      }

      setIsSubmitting(true);
      setMessage("Processing payment...");

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

        setMessage(res.message || "Payment submitted.");
      } catch (err: unknown) {
        let nextMessage = "Payment failed.";
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
      zipcode,
    ],
  );

  return (
    <main className="min-h-screen bg-[#f4f7f8] px-3 py-6 text-[#15212a] sm:grid sm:place-items-center sm:px-6">
      <section className="mx-auto w-full max-w-[460px] rounded-lg border border-[#d9e2e6] bg-white p-5 shadow-[0_14px_36px_rgba(20,35,45,0.10)] sm:p-6">
        <h1 className="mb-[18px] text-[22px] font-bold leading-tight text-[#15212a]">
          Card Checkout
        </h1>

        <form className="grid gap-3.5" autoComplete="on" onSubmit={handleSubmit}>
          <Input
            label="Card number"
            inputMode="numeric"
            autoComplete="cc-number"
            value={cardnumber}
            onValueChange={(value) => setCardnumber(onlyDigits(value))}
            isRequired
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Expiry month"
              inputMode="numeric"
              autoComplete="cc-exp-month"
              maxLength={2}
              value={expirymonth}
              onValueChange={(value) => setExpirymonth(onlyDigits(value).slice(0, 2))}
              isRequired
            />
            <Input
              label="Expiry year"
              inputMode="numeric"
              autoComplete="cc-exp-year"
              maxLength={2}
              value={expiryyear}
              onValueChange={(value) => setExpiryyear(onlyDigits(value).slice(0, 2))}
              isRequired
            />
          </div>

          <Input
            label="CVV"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            value={cvv}
            onValueChange={(value) => setCvv(onlyDigits(value).slice(0, 4))}
            isRequired
          />

          <Input
            label="Street"
            autoComplete="billing street-address"
            value={street}
            onValueChange={setStreet}
            isRequired
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="City"
              autoComplete="billing address-level2"
              value={city}
              onValueChange={setCity}
              isRequired
            />
            <Input
              label="State"
              autoComplete="billing address-level1"
              value={state}
              onValueChange={setState}
              isRequired
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="Country"
              placeholder="Select Country"
              selectedKeys={country ? [country] : []}
              variant="bordered"
              onSelectionChange={(keys) =>
                setCountry(Array.from(keys as Set<string>)[0])
              }
              isRequired
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
              label="Zip code"
              autoComplete="billing postal-code"
              value={zipcode}
              onValueChange={setZipcode}
              isRequired
            />
          </div>

          <Button
            type="submit"
            className="min-h-11 w-full rounded-md bg-[#22495f] font-bold text-white"
            isDisabled={isInvalidLink || isSubmitting}
            isLoading={isSubmitting}
          >
            Pay
          </Button>

          <p className="min-h-5 text-[13px] leading-snug" role="status">
            {message}
          </p>
        </form>
      </section>
    </main>
  );
}
