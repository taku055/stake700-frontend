import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { RadioGroup, Radio } from "@heroui/radio";
const TimeoutPage = () => {
  const t = useTranslations("PersonalDetails");
  const [selectedTimeout, setSelectedTimeout] = useState("24-hours");
  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">{t("Time-Out")}</div>
      <div className="w-full p-5 flex-1">
        <div className="flex flex-row items-center gap-1 pb-2 text-[#FFFFFFCC]">
          {t("Time-Out Description")}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <RadioGroup color="success" label={t("Time-Out")} value={selectedTimeout} onValueChange={setSelectedTimeout}>
            <Radio value="24-hours">{t("24 hours")}</Radio>
            <Radio value="one-week">{t("One week")}</Radio>
            <Radio value="one-month">{t("One month")}</Radio>
            <Radio value="two-months">{t("Two months")}</Radio>
          </RadioGroup>
        </div>
        <div className="flex mt-20">
          <button className="bg-[#2A8038] text-[#FFFFFF] px-4 py-2 rounded-md">
            {t("Save Changes")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeoutPage;