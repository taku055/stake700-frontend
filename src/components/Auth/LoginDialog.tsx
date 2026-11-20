import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import axios from "axios";
import { Lock, Mail, MailWarning, User } from "lucide-react";
import { toast } from "@/helpers/toast";
import { accessTokenState } from "@/state/accessTokenState";
import { userState } from "@/state/userState";
import { apiLogin } from "@/api/account/apiLogin";
import { setAxiosAuthToken } from "@/api/instance";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "@/router";
import { forgotOpenedState } from "@/state/forgotOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { setViewportCss } from "@/helpers/setViewportCss";
import { validateEmail } from "@/helpers/validateEmail";
import {
  AuthModal,
  AuthField,
  AuthCheckbox,
  PasswordToggle,
  authPrimaryButton,
  authLinkButton,
} from "./AuthShell";
import { ResendVerificationButton } from "./ResendVerificationButton";

interface ILoginComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDialog({ isOpen, onClose }: ILoginComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Set when the backend refuses login because the email isn't confirmed yet.
  const [notVerified, setNotVerified] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const t = useTranslations("LoginDialog");
  const tVerify = useTranslations("EmailVerification");
  const tToast = useTranslations("ToastMessages");
  const location = useLocation();
  const emailRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(mobileMediaQuery);

  const handleClose = () => {
    const active = document.activeElement as HTMLElement | null;
    active?.blur?.();
    window.setTimeout(() => {
      setViewportCss(window.innerWidth, window.innerHeight);
      window.scrollTo(0, 0);
    }, 50);
    onClose();
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setIsAgent(false);
    setShowPassword(false);
    setNotVerified(false);
    setResendEmail("");

    if (isOpen && !isMobile) {
      setTimeout(() => {
        emailRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMobile]);

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (loading) return;

      if (!email.trim() || !password) {
        toast.error(tToast("validation.all_fields_required"));
        return;
      }

      setLoading(true);
      setNotVerified(false);
      try {
        const res = await apiLogin(email.trim(), password, isAgent ? "AGENT" : "NORMAL");
        userState.value = res.user;
        accessTokenState.value = res.accessToken;
        setAxiosAuthToken(res.accessToken);
        toast.success(t("successfully_logged_in"));
        handleClose();
        setLoading(false);
        if (res.user.role === "SUPERAGENT") {
          location.route("/superagent");
        } else if (res.user.role === "AGENT") {
          location.route("/agent");
        } else if (res.user.role === "AREA_MANAGER") {
          location.route("/area_manager");
        }
      } catch (ex) {
        if (axios.isAxiosError(ex) && ex.response?.status === 401) {
          toast.error(t("email_or_password_is_incorrect"));
        } else if (
          axios.isAxiosError(ex) &&
          ex.response?.status === 403 &&
          ex.response?.data?.message === "email.not-verified"
        ) {
          const identifier = email.trim();
          setResendEmail(validateEmail(identifier) ? identifier : "");
          setNotVerified(true);
        } else {
          toast.error(t("something_went_wrong"));
        }
        console.error(ex);
        setLoading(false);
      }
    },
    [loading, email, password, isAgent, t, tToast]
  );

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("welcome_back")}
      subtitle={t("login_subtitle")}
      footer={
        <>
          {t("don_t_have_an_account")}?{" "}
          <button
            type="button"
            onClick={() => {
              handleClose();
              registerOpenedState.value = true;
            }}
            className={authLinkButton}
          >
            {t("register_an_account")}
          </button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <AuthField
          ref={emailRef}
          name="username"
          label={t("Email or Username")}
          type="text"
          autoComplete="username"
          autoCapitalize="off"
          spellCheck={false}
          value={email}
          onChange={setEmail}
          icon={<User size={17} />}
        />
        <AuthField
          name="password"
          label={t("Password")}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          icon={<Lock size={17} />}
          endContent={
            <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          }
        />

        <div className="flex items-center justify-between gap-3">
          <AuthCheckbox checked={isAgent} onChange={setIsAgent} label={t("login_as_agent")} />
          <button
            type="button"
            onClick={() => {
              handleClose();
              forgotOpenedState.value = true;
            }}
            className="text-[14px] font-semibold text-[var(--primary-color)] transition-colors hover:text-white"
          >
            {t("forgot_password")}
          </button>
        </div>

        {notVerified && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
          >
            <div className="flex items-start gap-2.5 text-[14px] text-amber-200">
              <MailWarning size={18} className="mt-0.5 shrink-0" />
              <span>{tVerify("email_not_verified")}</span>
            </div>
            <AuthField
              name="verify-email"
              label={tVerify("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              value={resendEmail}
              onChange={setResendEmail}
              icon={<Mail size={16} />}
            />
            <ResendVerificationButton email={resendEmail} />
          </div>
        )}

        <Button className={`${authPrimaryButton} mt-2`} type="submit" radius="sm" isLoading={loading}>
          {t("login")}
        </Button>
      </form>
    </AuthModal>
  );
}
