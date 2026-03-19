import { useCallback, useEffect, useState } from "preact/hooks";
import { Button, Input } from "@heroui/react";
import { userState } from "@/state/userState";
import { apiPayWithAries } from "@/api/wallet/apiPayWithAries";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { localeState } from "@/state/localeState";

const AriesDeposit = () => {
  const [amount, setAmount] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery(mobileMediaQuery);

  useEffect(() => {
    const user = userState.value;
    if (user) {
      setEmail(user.email);
      setName((user.firstName + " " + user.lastName).trim());
      setStreetAddress(user.address || "");
      setCity(user.city || "");
      setState(user.state || "");
      setZip(user.zipCode || "");
      setCountry(user.country || "");
      setPhone(user.phone || "");
    }
  }, [userState.value]);

  const handleSubmit = useCallback(
    async (e: Event) => {
      e.preventDefault();
      setError("");
      setIsSubmitting(true);
      try {
        const res = await apiPayWithAries({
          amount: Number(amount) || 0,
          streetAddress,
          city,
          state,
          zip,
          country,
          email,
          phone: phone || undefined,
          name,
          isMobile,
          language: localeState.value,
          applePayEnabled: true,
          googlePayEnabled: true,
        });
        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else {
          setError(res.message || "Payment could not be created.");
        }
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Something went wrong.";
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      amount,
      streetAddress,
      city,
      state,
      zip,
      country,
      email,
      phone,
      name,
      isMobile,
      localeState.value,
    ]
  );

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onValueChange={setEmail}
        isRequired
      />
      <Input
        label="Name"
        placeholder="Full name"
        value={name}
        onValueChange={setName}
        isRequired
      />
      <Input
        type="number"
        label="Amount"
        placeholder="0"
        value={amount}
        onValueChange={(value) => setAmount(value.replace(/\D/g, ""))}
        min={0}
        step={1}
        isRequired
      />
      <Input
        label="Street address"
        placeholder="123 Main St"
        value={streetAddress}
        onValueChange={setStreetAddress}
        isRequired
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="City"
          value={city}
          onValueChange={setCity}
          isRequired
        />
        <Input
          label="State"
          placeholder="State"
          value={state}
          onValueChange={setState}
          isRequired
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="ZIP"
          placeholder="ZIP code"
          value={zip}
          onValueChange={setZip}
          isRequired
        />
        <Input
          label="Country"
          placeholder="Country"
          value={country}
          onValueChange={setCountry}
          isRequired
        />
      </div>
      <Input
        type="tel"
        label="Phone"
        placeholder="+1 234 567 8900"
        value={phone}
        onValueChange={setPhone}
        isRequired
      />
      {error && (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      )}
      <Button
        type="submit"
        color="primary"
        className="mt-2"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        Submit payment
      </Button>
    </form>
  );
};

export default AriesDeposit;
