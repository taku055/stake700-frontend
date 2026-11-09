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
    <div className="flex flex-row gap-2">
      <input
        className="flex-1 h-10 px-3 rounded-md bg-[#1a2c38] border border-[#2f4553] text-sm text-white placeholder:text-[#557086] focus:outline-none focus:border-[#1475e1]"
        type="text" value={promoCode} placeholder={t("Promo Code")} onChange={(e) => setPromoCode((e.target as HTMLInputElement).value || "")}
      />
      <button
        className="h-10 px-4 rounded-md bg-[#1475e1] hover:bg-[#0f62c2] text-white text-sm font-semibold transition-colors disabled:opacity-60"
        onClick={onApply}
        disabled={loading}
      >
        {t("Apply")}
      </button>
    </div>
  )
}

export default AcceptPromoCode;