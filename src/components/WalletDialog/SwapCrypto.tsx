import { useTranslations } from "@/context/I18nContext";

export default function SwapCrypto() {
  const t = useTranslations("WalletBox");
  
  return (
    <div className="flex flex-col text-center gap-2 w-full p-5 h-[420px]">
      <h3>{t("Swap Crypto")}</h3>
      <div className="flex flex-col gap-2">{t("Coming Soon")}</div>
    </div>
  );
}