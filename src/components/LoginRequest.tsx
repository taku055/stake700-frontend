import { useTranslations } from "@/context/I18nContext";
import { loginOpenedState } from "@/state/loginOpenedState";
import { Button } from "@heroui/react";

export default function LoginRequest() {
  const t = useTranslations("LoginRequest");

  return (
    <div className="flex flex-col gap-4 justify-center">
      <div className="text-center text-sm text-gray-500 pt-10">
        {t("you_dont_have_access_to_this_page")}
      </div>
      <Button
        className="bg-[var(--pink-color)]"
        onPress={() => (loginOpenedState.value = true)}
      >
        {t("login")}
      </Button>
    </div>
  );
}
