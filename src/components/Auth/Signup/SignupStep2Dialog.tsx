import { useState, useRef, useEffect } from "preact/hooks";
import { Modal, ModalContent, ModalBody, Input } from "@/components/common";
import { Button, DatePicker, Checkbox } from "@heroui/react";
import { loginOpenedState } from "@/state/loginOpenedState";
import { useTranslations } from "@/context/I18nContext";
import { Eye, EyeOff } from "lucide-preact";
import { parseDate, CalendarDate } from "@internationalized/date";
import { BASE_URL } from "@/config/constants";

interface ISignupStep2DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onContinue?: (data: {
    email: string;
    username: string;
    password: string;
    dateOfBirth: CalendarDate;
    phone?: string;
    referralCode?: string;
  }) => void;
}

export default function SignupStep2Dialog({
  isOpen,
  onClose,
  onBack,
  onContinue,
}: ISignupStep2DialogProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<CalendarDate>(parseDate("1990-01-01"));
  const [showPassword, setShowPassword] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showReferralCode, setShowReferralCode] = useState(false);
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const t = useTranslations("SignupStep2");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        emailRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleContinue = () => {
    if (!email || !username || !password) {
      return;
    }
    if (onContinue) {
      onContinue({
        email,
        username,
        password,
        dateOfBirth,
        phone: showPhone ? phone : undefined,
        referralCode: showReferralCode ? referralCode : undefined,
      });
    }
  };

  const handleSignIn = () => {
    onClose();
    loginOpenedState.value = true;
  };

  const isFormValid = email && username && password && username.length >= 3 && username.length <= 14;

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={{
        backdrop: "z-[10000000]",
        wrapper: "z-[10000000]",
      }}
    >
      <ModalContent className="bg-[var(--background)] w-[630px] max-w-[630px] h-[716px] max-h-full rounded-[8px] overflow-y-auto">
        {/* <ModalContent className="bg-[var(--background)] w-[630px] max-w-[630px] rounded-[8px] overflow-hidden"> */}
        {/* Header with Logo, Progress Bar, and Close Button */}
        <div className="flex flex-col justify-between items-start w-full p-[16px] pb-0">
          <div className="flex flex-col w-full items-start gap-[16px]">
            <img
              src={`${BASE_URL}/images/icons/logo.svg`}
              className="h-[36px] md:h-[36px] md:max-w-[180px]"
              alt={import.meta.env.VITE_SITE_NAME as string}
            />
            {/* Progress Bar */}
            <div className="flex flex-col w-full items-center gap-[8px]">
              <div className="flex w-full gap-[4px]">
                <div className="flex-[33.33%] h-[4px] bg-[var(--green-color)] rounded-full"></div>
                <div className="flex-[33.33%] h-[4px] bg-[var(--green-color)] rounded-full"></div>
                <div className="flex-[33.33%] h-[4px] bg-[#FFFFFF33] rounded-full"></div>
              </div>
              <span className="flex w-full justify-end text-right text-[14px] leading-[20px] text-[#FFFFFFB2]">{t("Step 1/3")}</span>
            </div>
          </div>
        </div>

        <ModalBody className="flex flex-col w-full y-790px p-[16px] overflow-y-auto">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="text-left text-[14px] text-[#FFFFFFB2] hover:text-white transition-colors mb-[16px]"
          >
            {t("< Back")}
          </button>

          <div className="flex flex-col gap-[16px]">
            {/* Title */}
            <h2 className="text-white text-[20px] font-semibold leading-[32px]">
              {t("Create an Account")}
            </h2>

            {/* Form Fields */}
            <div className="flex flex-col gap-[16px]">
              {/* Email */}
              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("Email")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-lg h-[44px]",
                    input: "text-white",
                  }}
                  ref={emailRef}
                />
              </div>

              {/* Username */}
              <div className="">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("Username")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e: any) => setUsername(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-lg h-[44px]",
                    input: "text-white",
                  }}
                />
                <div className="mt-[4px] bg-[var(--background-secondary)] rounded-sm w-full h-[40px] flex items-center px-[8px]">
                  <span className="text-[14px] text-[#FFFFFFB2]">
                    {t("Your username must be 3-14 characters long.")}
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("Password")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-lg h-[44px]",
                    input: "text-white",
                  }}
                  endContent={
                    showPassword ? (
                      <EyeOff
                        className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <Eye
                        className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )
                  }
                />
              </div>

              {/* Date of Birth */}
              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("Date of Birth")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <DatePicker
                  value={dateOfBirth}
                  onChange={(value: CalendarDate | null) => setDateOfBirth(value!)}
                  classNames={{
                    inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-lg h-[44px]",
                    input: "text-white",
                  }}
                />
              </div>

              {/* Phone (Optional) */}
              <div className="flex items-center gap-[8px]">
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e: any) => setShowPhone(e.target.checked)}
                  className="w-[24px] h-[24px]"
                />
                <span className="text-[14px] text-white">{t("Phone (Optional)")}</span>
              </div>
              {showPhone && (
                <div className="h-[68px]">
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e: any) => setPhone(e.target.value)}
                    classNames={{
                      inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-lg h-[44px]",
                      input: "text-white",
                    }}
                  />
                </div>
              )}

              {/* Referral Code (Optional) */}
              <div className="flex items-center gap-[8px]">
                <input
                  type="checkbox"
                  checked={showReferralCode}
                  onChange={(e: any) => setShowReferralCode(e.target.checked)}
                  className="w-[24px] h-[24px] border-[2px] border-[var(--background-secondary)] rounded-sm"
                />
                <span className="text-[14px] text-white">{t("Referral Code (Optional)")}</span>
              </div>
              {showReferralCode && (
                <div className="h-[68px]">
                  <Input
                    type="text"
                    value={referralCode}
                    onChange={(e: any) => setReferralCode(e.target.value)}
                    classNames={{
                      inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-lg h-[44px]",
                      input: "text-white",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="w-full pt-[8px]">
              <Button
                className="w-full text-white text-[16px] font-medium bg-[var(--green-color)] hover:opacity-90 h-[48px] rounded-lg"
                onPress={handleContinue}
                isDisabled={!isFormValid}
              >
                {t("Continue")}
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-[8px]">
              <span className="text-[14px] text-[#FFFFFFB2]">
                {t("Already have an account?")}{" "}
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="text-white hover:underline font-medium"
                >
                  {t("Sign in")}
                </button>
              </span>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

