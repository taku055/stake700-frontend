import { useState, useCallback, useEffect, useRef } from "preact/hooks";
import axios from "axios";
import { toast } from "@/helpers/toast";
import { accessTokenState } from "@/state/accessTokenState";
import { userState } from "@/state/userState";
import { setAxiosAuthToken } from "@/api/instance";
import { apiRegister } from "@/api/account/apiRegister";
import { validateEmail } from "@/helpers/validateEmail";
import { Button, DatePicker } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Input,
} from "@/components/common";
import { loginOpenedState } from "@/state/loginOpenedState";
import { welcomeDialogOpenedState } from "@/state/registerOpenedState";
import { Eye, EyeOff } from "lucide-preact";
import {
  parseDate,
  CalendarDate,
  today,
  getLocalTimeZone,
} from "@internationalized/date";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ASSET_BASE_URL, mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import { setViewportCss } from "@/helpers/setViewportCss";

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

export default function SignupDialog({
  isOpen,
  onClose,
}: ISignupComponentProps) {
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

      if (loading) {
        return;
      }

      if (!email || !password || !phone.trim()) {
        toast.error(t("please_input_all_fields"));
        return;
      }

      if (!userName.trim()) {
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
        if (axios.isAxiosError(ex)) {
          if (ex.response?.status === 400) {
            toast.error(tToast("error.email_taken"));
          } else {
            toast.error(tToast("error.something_wrong"));
          }
        } else {
          toast.error(tToast("error.something_wrong"));
        }
        console.error(ex);
      }
      setLoading(false);
    },
    [
      email,
      userName,
      password,
      phone,
      firstName,
      lastName,
      middleName,
      birthday,
      refCode,
      loading,
      t,
      tToast,
      onClose,
    ]
  );

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent
        className="bg-[var(--background)] max-w-[630px] max-h-[calc(var(--viewport-height)-140px)] rounded-[8px] overflow-y-auto"
        dir={"ltr"}
      >
        <ModalHeader className="flex justify-between w-full h-[60px] min-h-[60px] py-[10px] px-[16px]">
          <img
            src={`${ASSET_BASE_URL}/logo.png`}
            className="h-[36px] md:h-[36px] md:max-w-[180px]"
            alt={import.meta.env.VITE_SITE_NAME as string}
          />
        </ModalHeader>
        <ModalBody className="flex flex-col p-[16px] h-[656px]">
          <form className="flex flex-col w-full gap-[16px]" onSubmit={onSubmit}>
            <div className="flex flex-col gap-[16px] w-full pt-[8px]">
              <div className="mt-[8px]">
                <span className="text-[16px] font-normal text-[#FFFFFFB2] leading-[24px] h-[24px]">
                  <span>{t("already_have_an_account")}?</span>{" "}
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      loginOpenedState.value = true;
                    }}
                    className="text-[16px] font-semibold text-[var(--green-color)] hover:underline leading-[24px] h-[24px]"
                  >
                    {t("login_an_account")}
                  </button>
                </span>
              </div>
              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("first_name")}</span>
                  <img
                    src={`https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/icons/mark.svg`}
                    alt="*"
                    className="h-[20px] pl-[4px]"
                  />
                </label>
                <Input
                  type="text"
                  label={t("first_name")}
                  value={firstName}
                  onChange={(e: any) => setFirstName(e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                  }}
                  ref={firstNameRef}
                />
              </div>
              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("middle_name_optional")}</span>
                </label>
                <Input
                  type="text"
                  label={t("middle_name_optional")}
                  value={middleName}
                  onChange={(e: any) => setMiddleName(e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                  }}
                />
              </div>
              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("last_name")}</span>
                  <img
                    src={`https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/icons/mark.svg`}
                    alt="*"
                    className="h-[20px] pl-[4px]"
                  />
                </label>
                <Input
                  type="text"
                  label={t("last_name")}
                  value={lastName}
                  onChange={(e: any) => setLastName(e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                  }}
                />
              </div>

              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("username")}</span>
                  <img
                    src={`https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/icons/mark.svg`}
                    alt="*"
                    className="h-[20px] pl-[4px]"
                  />
                </label>
                <Input
                  type="text"
                  label={t("username")}
                  value={userName}
                  onChange={(e: any) => setUserName(e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                  }}
                />
              </div>

              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("birthday")}</span>
                  <img
                    src={`https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/icons/mark.svg`}
                    alt="*"
                    className="h-[20px] pl-[4px]"
                  />
                </label>
                <DatePicker
                  value={birthday}
                  onChange={(value: CalendarDate | null) => {
                    if (value) setBirthday(value);
                  }}
                  showMonthAndYearPickers
                  minValue={new CalendarDate(1900, 1, 1)}
                  maxValue={today(getLocalTimeZone())}
                  calendarWidth={320}
                  popoverProps={{
                    shouldCloseOnScroll: false,
                    shouldBlockScroll: true,
                    placement: "bottom-start",
                  }}
                  classNames={{
                    input: "text-white",
                  }}
                />
              </div>

              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("email")}</span>
                  <img
                    src={`https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/icons/mark.svg`}
                    alt="*"
                    className="h-[20px] pl-[4px]"
                  />
                </label>
                <Input
                  type="email"
                  label={t("email")}
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  classNames={{
                    input: "text-white",
                  }}
                  variant="bordered"
                />
              </div>

              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("phone")}</span>
                  <img
                    src={`https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/icons/mark.svg`}
                    alt="*"
                    className="h-[20px] pl-[4px]"
                  />
                </label>
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  label={t("phone")}
                  value={phone}
                  onChange={(e: any) => setPhone(e.target.value)}
                  classNames={{
                    input: "text-white",
                  }}
                  variant="bordered"
                />
              </div>

              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("password")}</span>
                  <img
                    src={`https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/icons/mark.svg`}
                    alt="*"
                    className="h-[20px] pl-[4px]"
                  />
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  label={t("password")}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  classNames={{
                    input: "text-white",
                  }}
                  endContent={
                    !showPassword ? (
                      <Eye
                        onClick={() => setShowPassword(!showPassword)}
                        className="w-[16px] h-[16px]"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowPassword(!showPassword)}
                        className="w-[16px] h-[16px]"
                      />
                    )
                  }
                  variant="bordered"
                />
              </div>
            </div>
            <Button
              className={`w-full text-white mb-[20px] text-[16px] bg-[var(--green-color)] uppercase`}
              type="submit"
              radius="sm"
              isLoading={loading}
            >
              {t("register")}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
