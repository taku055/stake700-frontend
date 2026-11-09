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

  const userName = userState.value?.userName || "";
  const initials = userName.substring(0, 2).toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 shrink-0 rounded-full bg-[#2f4553] flex items-center justify-center text-white font-semibold">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-white font-semibold truncate">
          {userName || t("Profile")}
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-[#b1bad3] text-xs hover:text-white"
          onClick={() => setCopied(true)}
        >
          <span className="truncate">ID {userState.value?.id || ""}</span>
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
};

export default UserComponent;
