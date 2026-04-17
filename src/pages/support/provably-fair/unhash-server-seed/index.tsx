import { useTranslations } from "@/context/I18nContext";

export default function UnhashServerSeed() {
  const t = useTranslations("ProvablyFair");
  return (
    <div className="flex flex-col gap-4 w-full p-6">
      <h2 className="text-white text-[24px] font-semibold">{t("Unhash Server Seed")}</h2>
      <p className="text-white/70">{t("UnhashServerSeedPlaceholder")}</p>
    </div>
  );
}

