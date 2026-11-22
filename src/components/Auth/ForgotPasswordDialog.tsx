import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@heroui/react";
import { Mail, MailCheck } from "lucide-react";
import { toast } from "@/helpers/toast";
import { validateEmail } from "@/helpers/validateEmail";
import { apiForgotPassword } from "@/api/account/apiForgotPassword";
import { useTranslations } from "@/context/I18nContext";
import { loginOpenedState } from "@/state/loginOpenedState";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AuthModal, AuthField, authPrimaryButton, authLinkButton } from "./AuthShell";

/** Matches RESET_COOLDOWN_MS in the backend AuthService. */
const RESEND_COOLDOWN_SECONDS = 60;

interface IForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordDialog({ isOpen, onClose }: IForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // Address the link was sent to — switches the dialog to the "check inbox" step.
  const [sentTo, setSentTo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const t = useTranslations("ForgotDialog");
  const tToast = useTranslations("ToastMessages");
  const emailRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(mobileMediaQuery);

  useEffect(() => {
    setEmail("");
    setSentTo("");
    setCooldown(0);
    if (isOpen && !isMobile) {
      setTimeout(() => emailRef.current?.focus(), 300);
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const send = useCallback(
    async (address: string) => {
      if (loading) return;
      const value = address.trim();
      if (!validateEmail(value)) {
        toast.error(tToast("validation.invalid_email"));
        return;
      }

      setLoading(true);
      try {
        await apiForgotPassword(value);
        setSentTo(value);
        setCooldown(RESEND_COOLDOWN_SECONDS);
      } catch (ex) {
        console.error(ex);
        toast.error(
          axios.isAxiosError(ex) && ex.response?.status === 503
            ? t("send_failed")
            : tToast("error.something_wrong")
        );
      }
      setLoading(false);
    },
    [loading, t, tToast]
  );

  const backToLogin = useCallback(() => {
    onClose();
    loginOpenedState.value = true;
  }, [onClose]);

  const footer = (
    <button type="button" onClick={backToLogin} className={authLinkButton}>
      {t("back_to_login")}
    </button>
  );

  if (sentTo) {
    return (
      <AuthModal isOpen={isOpen} onClose={onClose} title={t("sent_title")} footer={footer}>
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary-color)_18%,transparent)] text-[var(--primary-color)]">
            <MailCheck size={30} />
          </span>
          <div className="space-y-2">
            <p className="text-[15px] text-white">{t("sent_desc")}</p>
            <p dir="ltr" className="break-all text-[15px] font-semibold text-[var(--primary-color)]">
              {sentTo}
            </p>
            <p className="text-[13px] text-[var(--text-muted-color)]">{t("sent_hint")}</p>
          </div>
          <Button
            type="button"
            radius="sm"
            variant="bordered"
            isLoading={loading}
            isDisabled={cooldown > 0}
            onPress={() => send(sentTo)}
            className="h-11 w-full rounded-lg border border-[var(--background-secondary)] bg-transparent text-[14px] font-semibold text-white transition-colors hover:border-[var(--primary-color)] data-[disabled=true]:opacity-60"
          >
            {cooldown > 0 ? t("resend_in", { seconds: cooldown }) : t("resend")}
          </Button>
        </div>
      </AuthModal>
    );
  }

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Forgot your password?")}
      subtitle={t("subtitle")}
      footer={footer}
    >
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void send(email);
        }}
      >
        <AuthField
          ref={emailRef}
          name="email"
          label={t("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          value={email}
          onChange={setEmail}
          icon={<Mail size={16} />}
        />
        <Button
          className={`${authPrimaryButton} mt-2`}
          type="submit"
          radius="sm"
          isLoading={loading}
          isDisabled={!validateEmail(email.trim())}
        >
          {t("recover_password")}
        </Button>
      </form>
    </AuthModal>
  );
}
