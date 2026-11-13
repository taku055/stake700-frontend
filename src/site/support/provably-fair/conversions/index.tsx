import { useTranslations } from "@/context/I18nContext";

export default function Conversions() {
  const t = useTranslations("ProvablyFair");
  return (
    <div className="flex flex-col gap-4 w-full p-6">
      <h2 className="text-white text-[24px] font-semibold">{t("Conversions")}</h2>
      <p className="text-white/70">{t("ConversionsPlaceholder")}</p>
    </div>
  );
}

