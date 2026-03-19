import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { apiUpdateUserDetails } from "@/api/account/apiUpdateUserDetails";
import { toast } from "@/helpers/toast";
import { LoaderCircle } from "lucide-preact";
import { DatePicker, Select, SelectItem, Input } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import * as countryCodes from "country-codes-list";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

const myCountryCodesObject = countryCodes.customList(
  "countryCode",
  "{countryNameEn}({countryCode})"
);

const countries = Object.keys(myCountryCodesObject).map((key) => ({
  value: key,
  label: myCountryCodesObject[key],
}));

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const PersonalDetailsPage = () => {
  const t = useTranslations("PersonalDetails");
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
  const [userPhone, setUserPhone] = useState(userState.value?.phone || "");
  const [birthDay, setBirthDay] = useState(
    parseDate(userState.value?.birthDay || "2000-01-01")
  );
  const [userGender, setUserGender] = useState(
    userState.value?.gender === 0 ? "male" : "female"
  );
  const [country, setCountry] = useState(userState.value?.country || "en");

  const [isLoading, setIsLoading] = useState(false);

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
        phoneNumber: userPhone || "",
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
              <SelectItem key={gender.value}>{t(gender.label)}</SelectItem>
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
            {countries.map((country) => (
              <SelectItem key={country.value}>{country.label}</SelectItem>
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
            type="text"
            value={userPhone}
            onChange={(e: any) => setUserPhone(e.target.value)}
            label={t("Phone")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
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
