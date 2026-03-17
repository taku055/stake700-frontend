import { useEffect, useState } from "preact/hooks";
import { Button, Input } from "@heroui/react";
import { userState } from "@/state/userState";

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

  useEffect(() => {
    const user = userState.value;
    if (user) {
      setEmail(user.email);
      setName((user.firstName + " " + user.lastName).trim());
    }
  }, [userState.value]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // TODO: submit payment
  };

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
        placeholder="0.00"
        value={amount}
        onValueChange={setAmount}
        min={0}
        step="any"
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
      <Button type="submit" color="primary" className="mt-2">
        Submit payment
      </Button>
    </form>
  );
};

export default AriesDeposit;
