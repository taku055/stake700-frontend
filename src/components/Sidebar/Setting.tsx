import { FunctionComponent } from "preact";
import LocaleSelection from "../LocaleSelection";
import { useTranslations } from "@/context/I18nContext";

export const Setting: FunctionComponent = () => {
  const t = useTranslations("Setting");

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500 px-1">{t("language")}</span>
        <LocaleSelection headerMode={false} />
      </div>
    </div>
  );
};
