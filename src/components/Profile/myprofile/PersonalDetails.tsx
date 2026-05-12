import { useState, useMemo } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { apiUpdateUserDetails } from "@/api/account/apiUpdateUserDetails";
import { toast } from "@/helpers/toast";
import { LoaderCircle } from "lucide-preact";
import { DatePicker, Select, SelectItem, Input } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

/** Allowed countries (stored value = ISO 3166-1 alpha-2). */
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

const ALLOWED_COUNTRY_VALUES = new Set(
  COUNTRY_OPTIONS.map((c) => c.value),
);

const DIAL_PREFIXES = COUNTRY_OPTIONS.map((c) => c.dial)
  .filter((d) => d.length > 0)
  .sort((a, b) => b.length - a.length);

function resolveInitialCountry(saved: string | null | undefined): string {
  if (saved && ALLOWED_COUNTRY_VALUES.has(saved)) return saved;
  return "SA";
}

function parseInitialNationalNumber(
  fullPhone: string | null | undefined,
): string {
  const raw = (fullPhone ?? "").trim();
  if (!raw) return "";
  for (const prefix of DIAL_PREFIXES) {
    if (raw.startsWith(prefix)) {
      return raw.slice(prefix.length).trim();
    }
  }
  if (raw.startsWith("+")) return raw;
  return raw;
}

const PersonalDetailsPage = () => {
  const t = useTranslations("PersonalDetails");

  const genders = [
    { labelKey: "Male" as const, value: "male" },
    { labelKey: "Female" as const, value: "female" },
  ];
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  const [firstName, setFirstName] = useState(userState.value?.firstName || "");
  const [lastName, setLastName] = useState(userState.value?.lastName || "");
  const [middleName, setMiddleName] = useState(
    userState.value?.middleName || ""
  );
  const [userCity, setUserCity] = useState(userState.value?.city || "");
  const [userCityState, setUserCityState] = useState(
    userState.value?.state || ""
  );
  const [userAddress, setUserAddress] = useState(
    userState.value?.address || ""
  );
  const [userZipCode, setUserZipCode] = useState(
    userState.value?.zipCode || ""
  );
  const [birthDay, setBirthDay] = useState(
    parseDate(userState.value?.birthDay || "2000-01-01")
  );
  const [userGender, setUserGender] = useState(
    userState.value?.gender === 0 ? "male" : "female"
  );
  const initialCountry = useMemo(
    () => resolveInitialCountry(userState.value?.country),
    [],
  );
  const [country, setCountry] = useState(initialCountry);
  const phoneDial = useMemo(
    () => COUNTRY_OPTIONS.find((c) => c.value === country)?.dial ?? "",
    [country],
  );
  const [phoneNational, setPhoneNational] = useState(() =>
    parseInitialNationalNumber(userState.value?.phone),
  );

  const [isLoading, setIsLoading] = useState(false);

  const fullPhoneNumber = phoneDial
    ? `${phoneDial}${phoneNational.replace(/^\+/, "")}`
    : phoneNational;

  const handleUpdateUserDetails = async () => {
    setIsLoading(true);
    try {
      const res = await apiUpdateUserDetails({
        firstName: firstName || "",
        lastName: lastName || "",
        middleName: middleName || "",
        country: country || "",
        city: userCity || "",
        address: userAddress || "",
        state: userCityState || "",
        gender: userGender || "male",
        dateOfBirth: birthDay.toString() || "2000-01-01",
        zipCode: userZipCode || "",
        phoneNumber: fullPhoneNumber || "",
      });
      userState.value = { ...userState.value, ...res };

      toast.success(t("User details updated successfully"));
    } catch (error) {
      toast.error(t("Failed to update user details"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-full ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A] ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("Personal Details")}
      </div>
      <div
        className={`w-full p-5 flex-1 ${isRTL ? "text-right" : "text-left"}`}
      >
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="text"
            value={firstName}
            onChange={(e: any) => setFirstName(e.target.value)}
            label={t("First Name")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <Input
            type="text"
            value={lastName}
            onChange={(e: any) => setLastName(e.target.value)}
            label={t("Last Name")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <Input
            type="text"
            value={middleName}
            onChange={(e: any) => setMiddleName(e.target.value)}
            label={t("Middle Name")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <DatePicker
            className="bg-[#fff1] border-none rounded-sm!"
            label={t("Date of Birth")}
            value={birthDay}
            size="sm"
            onChange={(e: any) => setBirthDay(e)}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <Select
            className="bg-[#fff1] border-none rounded-sm!"
            label={t("Gender")}
            placeholder={t("Select a gender")}
            selectedKeys={userGender ? [userGender] : []}
            variant="bordered"
            onSelectionChange={(keys) =>
              setUserGender(Array.from(keys as Set<string>)[0])
            }
            size="sm"
            dir={isRTL ? "rtl" : "ltr"}
            popoverProps={{
              shouldCloseOnScroll: false,
              shouldBlockScroll: true,
            }}
          >
            {genders.map((gender) => (
              <SelectItem key={gender.value} textValue={t(gender.labelKey)}>
                {t(gender.labelKey)}
              </SelectItem>
            ))}
          </Select>
          <Select
            className="bg-[#fff1] border-none rounded-sm!"
            label={t("Country")}
            placeholder={t("Select Country")}
            selectedKeys={country ? [country] : []}
            variant="bordered"
            onSelectionChange={(keys) =>
              setCountry(Array.from(keys as Set<string>)[0])
            }
            size="sm"
            dir={isRTL ? "rtl" : "ltr"}
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
            type="text"
            value={userAddress}
            onChange={(e: any) => setUserAddress(e.target.value)}
            label={t("Address")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <Input
            type="text"
            value={userCity}
            onChange={(e: any) => setUserCity(e.target.value)}
            label={t("City")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <Input
            type="text"
            value={userCityState}
            onChange={(e: any) => setUserCityState(e.target.value)}
            label={t("State")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <Input
            type="text"
            value={userZipCode}
            onChange={(e: any) => setUserZipCode(e.target.value)}
            label={t("Zip Code")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <Input
            type="tel"
            className="col-span-2 min-w-0"
            dir="ltr"
            startContent={
              phoneDial ? (
                <span className="text-[#FFFFFF99] text-sm font-medium tabular-nums shrink-0 pointer-events-none select-none">
                  {phoneDial}
                </span>
              ) : undefined
            }
            value={phoneNational}
            onChange={(e: any) => setPhoneNational(e.target.value)}
            label={t("Phone")}
            classNames={{
              inputWrapper: `bg-[#fff1] border-none rounded-sm!${
                isRTL ? " [&_input]:text-right" : " [&_input]:text-left"
              }`,
              input: `text-[#FFFFFF99]${isRTL ? " text-right" : " text-left"}`,
            }}
          />
        </div>
        <div className="flex justify-end mt-20">
          <button
            className="flex flex-row items-center gap-1 bg-[var(--green-color)] text-[#FFFFFF] px-4 py-2 rounded-md"
            onClick={handleUpdateUserDetails}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle class="text-white animate-spin" size={16} />
            ) : null}
            {t("Save Changes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsPage;
