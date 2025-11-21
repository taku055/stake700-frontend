import { useTranslations } from "@/context/I18nContext";
import { Input } from "@heroui/react";
const VerfyAccountPage = () => {
  const t = useTranslations("PersonalDetails");
  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">{t("Verify Account")}</div>
      <div className="w-full p-5 flex-1">
        <div className="flex flex-row items-center gap-1 pb-2 text-[#FFFFFFCC]">
          {t("Verify Account Description")}
        </div>
        <div className="flex flex-row items-center gap-1 pb-2 text-[#FFFFFFCC]">
          <Input type="file" />
        </div>
        <div className="flex mt-20">
          <button className="bg-[#2A8038] text-[#FFFFFF] px-4 py-2 rounded-md">
            {t("Verify Account")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerfyAccountPage;