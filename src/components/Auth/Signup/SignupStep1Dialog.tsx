import { useState } from "preact/hooks";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@/components/common";
import { Button, Select, SelectItem } from "@heroui/react";
import { localeState } from "@/state/localeState";
import { loginOpenedState } from "@/state/loginOpenedState";
import { useTranslations } from "@/context/I18nContext";
import { options } from "@/components/LocaleSelection";
import { BASE_URL } from "@/config/constants";

interface ISignupStep1DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function SignupStep1Dialog({
  isOpen,
  onClose,
  onConfirm,
}: ISignupStep1DialogProps) {
  const [selectedLocale, setSelectedLocale] = useState<string>(localeState.value);
  const t = useTranslations("SignupStep1");

  const handleConfirm = () => {
    localeState.value = selectedLocale;
    window.localStorage.setItem("locale", selectedLocale);
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleSignIn = () => {
    onClose();
    loginOpenedState.value = true;
  };

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
                <div className="flex-[33.33%] h-[4px] bg-[#FFFFFF33] rounded-full"></div>
                <div className="flex-[33.33%] h-[4px] bg-[#FFFFFF33] rounded-full"></div>
              </div>
              <span className="flex w-full justify-end text-right text-[14px] leading-[20px] text-[#FFFFFFB2]">{t("Step 1/3")}</span>
            </div>
          </div>
        </div>

        <ModalBody className="flex flex-col h-full w-full p-[16px]">
          <div className="flex flex-col gap-[16px]">
            {/* Title */}
            <h2 className="text-white text-[24px] font-semibold leading-[32px]">
              {t("Select Your Preferred Language")}
            </h2>

            {/* Description */}
            <p className="text-white text-[16px] leading-[24px]">
              {t("Betalarab is available is several languages. Feel free to personalise your language across our site from the options below.")}
            </p>

            {/* Language Select */}
            <div className="w-full">
              <Select
                selectedKeys={selectedLocale ? [selectedLocale] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys as Set<string>)[0];
                  if (selected) {
                    setSelectedLocale(selected);
                  }
                }}
                classNames={{
                  trigger: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-lg h-[48px]",
                  value: "text-white text-[16px]",
                  popoverContent: "bg-[var(--background)]",
                }}
                startContent={
                  <span className={`fi fi-${options.find((o) => o.value === selectedLocale)?.flag || "us"}`}></span>
                }
              >
                {options.map((lang) => (
                  <SelectItem
                    key={lang.value}
                    startContent={<span className={`fi fi-${lang.flag}`}></span>}
                  >
                    {lang.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Confirm Button */}
            <div className="flex flex-col w-full h-[350px] justify-end">
              <div className="w-full">
                <Button
                  className="w-full text-white text-[16px] font-medium bg-[var(--green-color)] hover:opacity-90 h-[48px] rounded-lg"
                  onPress={handleConfirm}
                >
                  {t("Confirm")}
                </Button>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
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

