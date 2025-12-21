
import { useState } from "preact/hooks";
import { Input } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { apiChangePassword } from "@/api/account/apiChangePassword";
import { toast } from "@/helpers/toast";
import { Loader } from "lucide-preact";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

const ChangePasswordPage = () => {
  const t = useTranslations("PersonalDetails");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const onChangePassword = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const res = await apiChangePassword(oldPassword, newPassword);
      toast.success(t("Password changed successfully"));
    } catch (error) {
      console.error(error);
      toast.error(t("Password change failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A] ${isRTL ? 'text-right' : 'text-left'}`}>{t("Change Password")}</div>
      <div className={`w-full p-5 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="password"
            value={oldPassword}
            onChange={(e: any) => setOldPassword(e.target.value)}
            // label={t("Old Password")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              container: "col-span-2",
              input: "text-[#FFFFFF99]",
            }}
          />
          <Input
            type="password"
            value={newPassword}
            onChange={(e: any) => setNewPassword(e.target.value)}
            // label={t("New Password")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            // label={t("Confirm Password")}
            classNames={{
              inputWrapper: "bg-[#fff1] border-none rounded-sm!",
              input: "text-[#FFFFFF99]",
            }}
          />
        </div>
        <div className="flex justify-end mt-20">
          <button
            className="flex flex-row gap-1 items-center bg-[#2A8038] disabled:bg-[#FFFFFF1A] disabled:text-[#FFFFFF4D] text-[#FFFFFF] px-4 py-2 rounded-md"
            disabled={oldPassword === "" || newPassword === "" || confirmPassword === "" || oldPassword === newPassword || loading || newPassword !== confirmPassword}
            onClick={onChangePassword}
          >
            {loading && <Loader size={16} className="animate-spin" />} {t("Change Password")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage;