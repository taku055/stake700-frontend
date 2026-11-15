import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { AtSign, Lock, Mail, Phone } from "lucide-react";
import { passwordStrength } from "check-password-strength";
import { toast } from "@/helpers/toast";
import { accessTokenState } from "@/state/accessTokenState";
import { userState } from "@/state/userState";
import { setAxiosAuthToken } from "@/api/instance";
import { apiRegister } from "@/api/account/apiRegister";
import { validateEmail } from "@/helpers/validateEmail";
import { Button, DatePicker } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { loginOpenedState } from "@/state/loginOpenedState";
import { welcomeDialogOpenedState } from "@/state/registerOpenedState";
import {
  parseDate,
  CalendarDate,
  today,
  getLocalTimeZone,
} from "@internationalized/date";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { setViewportCss } from "@/helpers/setViewportCss";
import {
  AuthModal,
  AuthField,
  AuthSectionTitle,
  PasswordToggle,
  authLabel,
  authPrimaryButton,
  authLinkButton,
} from "./AuthShell";

interface ISignupComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

function dismissMobileKeyboard() {
  const active = document.activeElement as HTMLElement | null;
  active?.blur?.();
  // Force layout back to full viewport after iOS keyboard
  window.setTimeout(() => {
    setViewportCss(window.innerWidth, window.innerHeight);
    window.scrollTo(0, 0);
  }, 50);
}

const STRENGTH_COLORS = ["#e5484d", "#f5a524", "#3dd68c", "#01a825"];

function PasswordStrength({ password }: { password: string }) {
  const level = useMemo(
    () => (password ? passwordStrength(password).id : -1),
    [password]
  );
  return (
    <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-1 rounded-full bg-[var(--background-secondary)] transition-colors duration-300"
          style={i <= level ? { backgroundColor: STRENGTH_COLORS[level] } : undefined}
        />
      ))}
    </div>
  );
}

export default function SignupDialog({ isOpen, onClose }: ISignupComponentProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [birthday, setBirthday] = useState(parseDate("1990-01-01"));
  const t = useTranslations("SignupDialog");
  const tToast = useTranslations("ToastMessages");
  const firstNameRef = useRef<HTMLInputElement>(null);
  const { refCode } = useAffiliateNavigation();
  const isMobile = useMediaQuery(mobileMediaQuery);

  const handleClose = useCallback(() => {
    dismissMobileKeyboard();
    onClose();
  }, [onClose]);

  useEffect(() => {
    setEmail("");
    setUserName("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setPhone("");
    setShowPassword(false);

    // Avoid auto-focus on mobile — it opens the keyboard and leaves a half-screen layout
    if (isOpen && !isMobile) {
      setTimeout(() => {
        firstNameRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMobile]);

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (loading) return;

      if (!firstName.trim() || !lastName.trim() || !email || !password || !phone.trim() || !userName.trim()) {
        toast.error(t("please_input_all_fields"));
        return;
      }

      const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      if (!regex.test(userName.trim())) {
        toast.error(t("first_letter_condition"));
        return;
      }

      if (!validateEmail(email)) {
        toast.error(t("correct_email_request"));
        return;
      }

      setLoading(true);
      try {
        const res = await apiRegister({
          email,
          password,
          userName: userName.trim(),
          referCode: refCode || null,
          firstName,
          lastName,
          middleName: middleName.trim(),
          birthDay: birthday.toString(),
          phone: phone.trim(),
        });

        userState.value = res.user;
        accessTokenState.value = res.accessToken;
        setAxiosAuthToken(res.accessToken);
        toast.success(tToast("success.registered"));
        dismissMobileKeyboard();
        onClose();
        welcomeDialogOpenedState.value = true;
      } catch (ex) {
        if (axios.isAxiosError(ex) && ex.response?.status === 400) {
          toast.error(tToast("error.email_taken"));
        } else {
          toast.error(tToast("error.something_wrong"));
        }
        console.error(ex);
      }
      setLoading(false);
    },
    [email, userName, password, phone, firstName, lastName, middleName, birthday, refCode, loading, t, tToast, onClose]
  );

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      title={t("create_account")}
      subtitle={t("signup_subtitle")}
      footer={
        <>
          {t("already_have_an_account")}?{" "}
          <button
            type="button"
            onClick={() => {
              handleClose();
              loginOpenedState.value = true;
            }}
            className={authLinkButton}
          >
            {t("login_an_account")}
          </button>
        </>
      }
    >
      <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
        <section>
          <AuthSectionTitle>{t("personal_details")}</AuthSectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthField
              ref={firstNameRef}
              name="given-name"
              label={t("first_name")}
              autoComplete="given-name"
              value={firstName}
              onChange={setFirstName}
            />
            <AuthField
              name="family-name"
              label={t("last_name")}
              autoComplete="family-name"
              value={lastName}
              onChange={setLastName}
            />
            <AuthField
              name="additional-name"
              label={t("middle_name")}
              optional={t("optional")}
              autoComplete="additional-name"
              value={middleName}
              onChange={setMiddleName}
            />
            <div>
              <span className={authLabel}>{t("birthday")}</span>
              <DatePicker
                aria-label={t("birthday")}
                value={birthday}
                onChange={(value: CalendarDate | null) => {
                  if (value) setBirthday(value);
                }}
                showMonthAndYearPickers
                minValue={new CalendarDate(1900, 1, 1)}
                maxValue={today(getLocalTimeZone())}
                calendarWidth={300}
                popoverProps={{
                  shouldCloseOnScroll: false,
                  shouldBlockScroll: true,
                  placement: "bottom-end",
                }}
                classNames={{
                  inputWrapper:
                    "h-11 min-h-11 rounded-lg border border-[var(--background-secondary)] bg-[var(--bar-background-color)] shadow-none transition-colors data-[hover=true]:border-[var(--background-tertiary)] data-[hover=true]:bg-[var(--bar-background-color)] group-data-[focus-within=true]:border-[var(--primary-color)] group-data-[focus-within=true]:bg-[var(--bar-background-color)]",
                  segment: "text-white data-[placeholder=true]:text-[var(--background-tertiary)]",
                  selectorButton: "text-[var(--text-muted-color)] hover:text-white",
                }}
              />
            </div>
          </div>
        </section>

        <section>
          <AuthSectionTitle>{t("account_details")}</AuthSectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthField
              name="username"
              label={t("username")}
              autoComplete="username"
              autoCapitalize="off"
              spellCheck={false}
              value={userName}
              onChange={setUserName}
              icon={<AtSign size={16} />}
            />
            <AuthField
              name="tel"
              label={t("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={setPhone}
              icon={<Phone size={16} />}
            />
            <AuthField
              className="sm:col-span-2"
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
            <div className="sm:col-span-2">
              <AuthField
                name="new-password"
                label={t("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={setPassword}
                icon={<Lock size={16} />}
                endContent={
                  <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                }
              />
              <PasswordStrength password={password} />
            </div>
          </div>
        </section>

        <Button className={authPrimaryButton} type="submit" radius="sm" isLoading={loading}>
          {t("register")}
        </Button>
      </form>
    </AuthModal>
  );
}
