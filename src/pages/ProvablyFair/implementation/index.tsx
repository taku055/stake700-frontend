import { useTranslations } from "@/context/I18nContext";

export default function Implementation() {
  const t = useTranslations("ProvablyFair");
  return (
    <div className="flex flex-col gap-4 w-full p-6">
      <h2 className="text-white text-[24px] font-semibold">{t("Implementation")}</h2>
      <p className="text-white/70">{t("Implementation content will be displayed here.")}</p>
    </div>
  );
}

