import { userState } from "@/state/userState";
import { Check, Copy } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";

const UserComponent = () => {
  const t = useTranslations("Profile");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      navigator.clipboard.writeText(userState.value?.id || "324722652");
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  return (
    <div className="w-full flex flex-row items-center gap-3">
      <div className="w-[32px] h-[32px] rounded-full bg-[#FFFFFF66] text-[#1B1B1B] font-bold flex items-center justify-center">
        {userState.value?.userName.at(0)?.toUpperCase()}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[#FFFFFFE5] text-[16px] leading-[16px]">
          {userState.value?.userName || "Eliff Soheili"}
        </span>
        <span className="flex flex-row gap-1 items-center text-[#FFFFFF80] text-[16px] leading-[16px]">
          {userState.value?.id || "324722652"} <button className="outline-none" onClick={() => setCopied(true)}>{!copied ? <Copy width={16} height={16} color="#FFFFFF80" /> : <Check width={16} height={16} color="#FFFFFF80" />}</button>
        </span>
      </div>
    </div>
  )
}

export default UserComponent;