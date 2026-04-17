import { userState } from "@/state/userState";
import { ShieldAlert, ShieldIcon } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
interface UserVerifyBoxProps {
  onClick?: () => void;
}
const UserVerifyBox = ({ onClick }: UserVerifyBoxProps) => {
  const t = useTranslations("Profile");
  return (
    <div className="w-full flex flex-col p-3 bg-[var(--primary-color)] rounded-md">
      {
        userState.value?.verifiedAt ? (
          <div className="w-full h-full flex flex-col text-[var(--green-color)]">
            <h1>{t("Account verified")}</h1>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-3">
            <h1 className="flex flex-row gap-1 items-center text-[var(--pink-color)]">
              <ShieldAlert width={16} height={16} />
              {t("Account not verified")}
            </h1>
            <button
              onClick={onClick}
              className="bg-[var(--bar-background-color)] border border-[var(--pink-color)] text-[var(--pink-color)] hover:bg-[var(--pink-color)] hover:text-white transition-all duration-300 uppercase px-[16px] py-[6px] rounded-md">
              {t("Verify Now")}
            </button>
          </div>
        )
      }
    </div>
  )
}

export default UserVerifyBox;