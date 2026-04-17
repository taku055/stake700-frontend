import { Button, Select, SelectItem } from "@heroui/react";
import { CreditCard, DollarSign, Key } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { apiPayWithPayit123 } from "@/api/wallet/apiPayWithPayit123";
import * as countryCodes from "country-codes-list";
import {
  Modal,
  ModalBody,
  ModalContent,
  Input,
  ModalHeader,
  ModalFooter,
} from "@/components/common";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";

interface IVisaDepositSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisaDialogSimple({
  isOpen,
  onClose,
}: IVisaDepositSimpleProps) {
  const [amount, setAmount] = useState("10");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [country, setCountry] = useState("");
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("CardDeposit");
  const tToast = useTranslations("ToastMessages");
  const myCountryCodesObject = countryCodes.customList(
    "countryCode",
    "{countryNameEn}({countryCode})"
  );
  const [countryList, setCountryList] = useState(new Set<string>([]));
  const countryCodesList = Object.keys(myCountryCodesObject)
    .map((key) => ({
      key,
      label: myCountryCodesObject[key],
    }))
    .sort((a, b) => {
      const whitelist = ["SA", "US", "AE", "KW"];
      if (whitelist.includes(a.key)) {
        return -1;
      }

      if (whitelist.includes(b.key)) {
        return 1;
      }

      return a.label < b.label ? -1 : 1;
    });

  useEffect(() => {
    if (isOpen) {
      setAmount("15");
      setExpMonth("");
      setExpYear("");
      setCvv("");
      setCardNumber("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCity("");
      setState("");
      setStreet("");
      setZipCode("");
      setCountry("");
      setSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const country1 = countryList.values().next().value;
    setCountry(country1 || "");
  }, [countryList]);

  const validateFields = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !city ||
      !state ||
      !street ||
      !zipCode ||
      !country
    ) {
      toast.error(tToast("validation.all_fields_required"));
      return false;
    }
    if (!email.includes("@")) {
      toast.error(tToast("validation.invalid_email"));
      return false;
    }
    if (phone.length < 8) {
      toast.error(tToast("validation.invalid_phone"));
      return false;
    }
    if (parseFloat(amount) < 10) {
      toast.error(tToast("validation.amount_minimum"));
      return false;
    }

    if (cvv.length !== 3 || isNaN(Number(cvv))) {
      toast.error(tToast("validation.invalid_cvv"));
      return false;
    }
    const month = parseInt(expMonth, 10);
    const year = parseInt(expYear, 10);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (isNaN(month) || month < 1 || month > 12) {
      toast.error(tToast("validation.invalid_expiration_month"));
      return false;
    }
    if (isNaN(year) || year < currentYear || year > currentYear + 10) {
      toast.error(tToast("validation.invalid_expiration_year"));
      return false;
    }
    if (year === currentYear && month < currentMonth) {
      toast.error(tToast("validation.card_expired"));
      return false;
    }

    return true;
  };

  const onPay = async () => {
    if (!validateFields()) return;

    const data = {
      amount: Number(amount),
      expMonth: expMonth,
      expYear: expYear,
      cvv,
      cardNumber,
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      street1: street,
      postal_code: zipCode,
      country,
    };

    try {
      setSubmitting(true);
      const res = await apiPayWithPayit123(data);
      console.log(res);

      if (res.status === "Failed") {
        toast.error(res.message);
        setSubmitting(false);
        return;
      }
      if (res.status === "Success") {
        toast.success(res.message);
        setSubmitting(false);
        return;
      }

      const newLink = res["3DSUrl"];
      if (!newLink) {
        toast.error(t("payment_link_empty"));
        setSubmitting(false);
        return;
      }

      toast.success(t("success_message"));
      setSubmitting(false);
      onClose();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      location.href = newLink;
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error(t("deposit_fail"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement={isMobile ? "top" : "center"}
      classNames={{
        backdrop:
          "custom-modal-backdrop bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-40",
        wrapper: "custom-modal-wrapper bg-[var(--background)]",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-[var(--primary-color)]">
          {t("Card Deposit")}{" "}
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-gray-500 mb-4">{t("Info")}</p>
          <Input
            // label={t("Card Number")}
            startContent={<CreditCard />}
            type="password"
            value={cardNumber}
            onChange={(e: any) => setCardNumber(e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              // label={t("Month")}
              type="number"
              value={expMonth}
              min={1}
              max={12}
              onChange={(e: any) => setExpMonth(e.target.value)}
            />
            <Input
              // label={t("Year")}
              type="number"
              value={expYear}
              min={2025}
              onChange={(e: any) => setExpYear(e.target.value)}
            />
          </div>
          <Input
            // label={"CVV"}
            startContent={<Key />}
            type="password"
            value={cvv}
            minLength={3}
            maxLength={3}
            onChange={(e: any) => setCvv(e.target.value)}
          />
          <Input
            // label={t("Amount")}
            startContent={<DollarSign />}
            type="number"
            value={amount}
            min={10}
            onChange={(e: any) => setAmount(e.target.value)}
          />
          <div className="flex flex-row gap-2">
            <Input
              // label={t("First Name")}
              value={firstName}
              onChange={(e: any) => setFirstName(e.target.value)}
            />
            <Input
              // label={t("Last Name")}
              value={lastName}
              onChange={(e: any) => setLastName(e.target.value)}
            />
          </div>

          <Input
            // label={t("Email")}
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <Input
            // label={t("Phone")}
            type="tel"
            value={phone}
            onChange={(e: any) => setPhone(e.target.value)}
          />
          <Select
            className="w-full"
            // label="Country"
            placeholder="Select Country"
            selectedKeys={countryList}
            variant="bordered"
            onSelectionChange={setCountryList as any}
            popoverProps={{
              shouldCloseOnScroll: false,
              shouldBlockScroll: true,
            }}
          >
            {countryCodesList.map((e) => (
              <SelectItem key={e.key}>{e.label}</SelectItem>
            ))}
          </Select>
          <div className="flex flex-row gap-2">
            <Input
              // label={t("City")}
              value={city}
              onChange={(e: any) => setCity(e.target.value)}
            />
            <Input
              //  label={t("State")}
              value={state}
              onChange={(e: any) => setState(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Input
              // label={t("Street")}
              value={street}
              onChange={(e: any) => setStreet(e.target.value)}
            />
            <Input
              //  label={t("Zip Code")}
              value={zipCode}
              onChange={(e: any) => setZipCode(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => onPay()}
            isLoading={submitting}
          >
            {t("Pay")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
