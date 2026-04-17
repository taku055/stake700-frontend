import { CircleAlert } from "lucide-preact";
import { useState } from "preact/hooks";
import { Input, Switch } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";

const TwoStepAuthenticationPage = () => {
  const t = useTranslations("PersonalDetails");

  const [code, setCode] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">{t("Two-Step Authentication")}</div>
      <div className="w-full p-5 flex-1">
        <div className="flex flex-row items-center justify-between gap-1 pb-2">
          <span><img src="/images/authentication.png" /></span>
          <Switch isSelected={isSelected} onValueChange={setIsSelected} />
        </div>
        <div className="flex flex-row items-center gap-1 pb-2 text-[#FFFFFFCC]">
          {t("Activate two-factor authentication")}
        </div>
        <div className="flex flex-col gap-2 bg-[#FFFFFF0D] rounded-md p-4 mx-[100px]">
          <div className="flex flex-row items-center gap-1 pb-2 text-[#FFFFFFCC]">
            {t("Set up Authenticator")}
          </div>
          <div className="flex flex-row items-center gap-1 pb-2 text-[#FFFFFFCC]">
            {t("TwoFactorAuthSetupDesc")}
          </div>
          <div className="flex flex-row items-center justify-center gap-1 pb-2 text-[#FFFFFFCC]">
            <img src="/images/authenticator_temp.png" />
          </div>
          <Input
            type="text"
            value={code}
            onChange={(e: any) => setCode(e.target.value)}
            label={t("Code")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <div className="flex justify-end">
            <button className="bg-[#FFFFFF1A] text-[#FFFFFF4D] px-4 py-2 rounded-md">
              {t("Verify")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwoStepAuthenticationPage;