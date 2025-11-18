import { useTranslations } from "@/context/I18nContext";

interface LoyaltyPointsProps {
  onClick: () => void;
}
const LoyaltyPoints = ({ onClick }: LoyaltyPointsProps) => {
  const t = useTranslations("LoyaltyPoints");

  return (
    <button
      onClick={onClick}
      className="flex flex-row px-5 py-3 cursor-pointer select-none gap-2 rounded-sm bg-no-repeat bg-[#D80D83] border border-[#FF68C0] items-center">
      <img src="/images/bronze.png" /><span className="flex-1">{t("Loyalty Points")}</span><span>0/0</span>
    </button>
  )
}

export default LoyaltyPoints;