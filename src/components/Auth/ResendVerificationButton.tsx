import { useCallback, useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { validateEmail } from "@/helpers/validateEmail";
import { apiResendVerification } from "@/api/account/apiResendVerification";

/** Matches the backend cooldown in AuthService.resendVerification. */
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * "Resend verification email" button with a cooldown countdown.
 * `initialCooldown` lets callers start counting right after an email was sent.
 */
export function ResendVerificationButton({
  email,
  initialCooldown = 0,
  className,
  label,
}: {
  email: string;
  initialCooldown?: number;
  className?: string;
  label?: string;
}) {
  const t = useTranslations("EmailVerification");
  const [cooldown, setCooldown] = useState(initialCooldown);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const onClick = useCallback(async () => {
    if (loading || cooldown > 0) return;
    const value = email.trim();
    if (!validateEmail(value)) {
      toast.error(t("enter_email_to_resend"));
      return;
    }

    setLoading(true);
    try {
      await apiResendVerification(value);
      toast.success(t("resent"));
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (ex) {
      console.error(ex);
      toast.error(t("send_failed"));
    }
    setLoading(false);
  }, [email, loading, cooldown, t]);

  return (
    <Button
      type="button"
      radius="sm"
      variant="bordered"
      isLoading={loading}
      isDisabled={cooldown > 0}
      onPress={onClick}
      className={
        className ??
        "h-11 w-full rounded-lg border border-[var(--background-secondary)] bg-transparent text-[14px] font-semibold text-white transition-colors hover:border-[var(--primary-color)] data-[disabled=true]:opacity-60"
      }
    >
      {cooldown > 0 ? t("resend_in", { seconds: cooldown }) : label ?? t("resend")}
    </Button>
  );
}
