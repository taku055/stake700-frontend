import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
// import { apiApplyPromoCode } from "@/api/promotion/apiApplyPromoCode";

const AcceptPromoCode = () => {
  const t = useTranslations("Profile");

  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onApply = async () => {
    setLoading(true);
    // try {
    //   const res = await apiApplyPromoCode(promoCode);
    //   setSuccess(res.message);
    // } catch (error: any) {
    //   setError(error.message);
    // } finally {
    //   setLoading(false);
    // }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess("Promo code applied successfully");
    setLoading(false);
  }
  return (
    <div className="flex flex-row gap-[10px] mx-5 p-[10px] bg-[#FFFFFF0D] rounded-sm">
      <input
        className="bg-[#FFFFFF26] flex-1 px-5 py-5 rounded-sm focus:outline-none w-full text-[14px]"
        type="text" value={promoCode} placeholder={t("Promo Code")} onChange={(e) => setPromoCode((e.target as HTMLInputElement).value || "")}
      />
      <button
        className="bg-[#FFFFFF1A] hover:bg-[#FFFFFF26] hover:text-[#FFFFFF] transition-all duration-300 text-[#FFFFFF4D] px-[20px] rounded-sm text-[12px]"
        onClick={onApply}
      >
        {t("Apply")}
      </button>
    </div>
  )
}

export default AcceptPromoCode;