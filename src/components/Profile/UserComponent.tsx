import { userState } from "@/state/userState";
import { Check, Copy, InfoIcon } from "lucide-preact";
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
    <div className="w-full flex flex-col items-center gap-3 py-2">
      <div className="w-full flex flex-row items-center gap-3 px-2 py-3 pb-10 bg-[var(--green-color)] rounded-md relative">
        <InfoIcon size={16} color="white" />
        <span className="text-[16px] leading-[16px] text-white">
          ID : {userState.value?.id || "324722652"}
        </span>
        <button className="outline-none" onClick={() => setCopied(true)}>
          {!copied ? (
            <Copy width={16} height={16} color="black" />
          ) : (
            <Check width={16} height={16} color="black" />
          )}
        </button>
        <div className="absolute top-0 bg-[var(--background)] border-1 bottom-0 left-[50%] translate-y-1/2 -translate-x-1/2 border-white rounded-full p-2 w-[64px] h-[64px] flex items-center justify-center">
          <span className="text-[24px] leading-[24px] text-white">
            {userState.value?.userName.substring(0, 2)?.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="w-full text-center text-[16px] leading-[16px] mt-8 text-white">
        {userState.value?.userName || "Eliff Soheili"}
      </div>
      {/* <div className="w-[32px] h-[32px] rounded-full bg-[#FFFFFF66] text-[#1B1B1B] font-semibold flex items-center justify-center">
        {userState.value?.userName.at(0)?.toUpperCase()}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[#FFFFFFE5] text-[16px] leading-[16px]">
          {userState.value?.userName || "Eliff Soheili"}
        </span>
        <span className="flex flex-row gap-1 items-center text-[#FFFFFF80] text-[16px] leading-[16px]">
          {userState.value?.id || "324722652"} <button className="outline-none" onClick={() => setCopied(true)}>{!copied ? <Copy width={16} height={16} color="#FFFFFF80" /> : <Check width={16} height={16} color="#FFFFFF80" />}</button>
        </span>
      </div> */}
    </div>
  );
};

export default UserComponent;
