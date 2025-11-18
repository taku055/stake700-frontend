import { CircleAlert } from "lucide-preact";
import { useState } from "preact/hooks";
import { Input } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { apiUpdateUserDetails } from "@/api/account/apiUpdateUserDetails";
import { toast } from "@/helpers/toast";
import { LoaderCircle } from "lucide-preact";
import { DatePicker, Select, SelectItem } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import * as countryCodes from "country-codes-list";

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

  const [firstName, setFirstName] = useState(userState.value?.firstName);
  const [lastName, setLastName] = useState(userState.value?.lastName);
  const [middleName, setMiddleName] = useState(userState.value?.middleName);
  const [userCity, setUserCity] = useState(userState.value?.city);
  const [userAddress, setUserAddress] = useState(userState.value?.address);
  const [birthDay, setBirthDay] = useState(
    parseDate(userState.value?.birthDay || "2000-01-01")
  );
  const [userGender, setUserGender] = useState(
    userState.value?.gender || "male"
  );
  const [country, setCountry] = useState(userState.value?.country || "en");

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUserDetails = async () => {
    setIsLoading(true);
    try {
      await apiUpdateUserDetails({
        firstName: firstName || "",
        lastName: lastName || "",
        middleName: middleName || "",
        country: country || "",
        city: userCity || "",
        address: userAddress || "",
        gender: userGender || "",
        dateOfBirth: birthDay.toString() || "2000-01-01",
      });
      toast.success("User details updated successfully");
    } catch (error) {
      toast.error("Failed to update user details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        Personal Details
      </div>
      <div className="w-full p-5 flex-1">
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
            label="Date of Birth"
            value={birthDay}
            size="sm"
            onChange={(e: any) => setBirthDay(e)}
          />
          <Select
            className="bg-[#fff1] border-none rounded-sm!"
            label="Gender"
            placeholder="Select a gender"
            selectedKeys={userGender ? [userGender] : []}
            variant="bordered"
            onSelectionChange={(keys) =>
              setUserGender(Array.from(keys as Set<string>)[0])
            }
            size="sm"
          >
            {genders.map((gender) => (
              <SelectItem key={gender.value}>{gender.label}</SelectItem>
            ))}
          </Select>
          <Select
            className="bg-[#fff1] border-none rounded-sm!"
            label="Country"
            placeholder="Select a country"
            selectedKeys={country ? [country] : []}
            variant="bordered"
            onSelectionChange={(keys) =>
              setCountry(Array.from(keys as Set<string>)[0])
            }
            size="sm"
          >
            {countries.map((country) => (
              <SelectItem key={country.value}>{country.label}</SelectItem>
            ))}
          </Select>
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
            value={userAddress}
            onChange={(e: any) => setUserAddress(e.target.value)}
            label={t("Address")}
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
