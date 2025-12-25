import { useState } from "preact/hooks";
import { Modal, ModalContent, ModalBody } from "@/components/common";
import { Button, Checkbox } from "@heroui/react";
import { loginOpenedState } from "@/state/loginOpenedState";
import { useTranslations } from "@/context/I18nContext";
import { BASE_URL } from "@/config/constants";

interface ISignupStep3DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onCreateAccount?: () => void;
}

export default function SignupStep3Dialog({
  isOpen,
  onClose,
  onBack,
  onCreateAccount,
}: ISignupStep3DialogProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const t = useTranslations("SignupStep3");

  const handleCreateAccount = () => {
    if (agreedToTerms && onCreateAccount) {
      onCreateAccount();
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
      <ModalContent className="bg-[var(--background)] w-[630px] max-w-[630px] max-h-[90vh] overflow-y-auto rounded-[8px] overflow-hidden">
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
                <div className="flex-[33.33%] h-[4px] bg-[var(--green-color)] rounded-full"></div>
              </div>
              <span className="flex w-full justify-end text-right text-[14px] leading-[20px] text-[#FFFFFFB2]">{t("Step 1/3")}</span>
            </div>
          </div>
        </div>

        <ModalBody className="flex flex-col px-[24px] pb-[24px] pt-[32px]">
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
            <h2 className="text-white text-[20px] font-semibold leading-[28px]">
              {t("Create an Account")}
            </h2>

            {/* Terms and Conditions Section */}
            <div className="flex flex-col">


              {/* Scrollable Terms Content */}
              <div className="bg-[var(--background-secondary)] border-[2px] border-[var(--background-secondary)] rounded-lg p-[16px]">
                <h3 className="text-white text-[18px] font-semibold">
                  {t("Terms and Conditions")}
                </h3>
                <h2 className="text-white text-[18px] mt-[24px] mb-[8px] font-semibold uppercase leading-[24px]">
                  {t("terms_and_conditions_title")}
                </h2>
                <div className="text-white text-[16px] leading-[24px] whitespace-pre-wrap">
                  {t("terms_and_conditions_content")}
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-center gap-[8px] pt-[16px]">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e: any) => setAgreedToTerms(e.target.checked)}
                  className="w-[24px] h-[24px] border-[2px] border-[var(--background-secondary)] rounded-sm"
                />
                <span className="text-[14px] text-white">
                  {t("I have read and agree to the Terms and Conditions")}
                </span>
              </div>
            </div>

            {/* Create Account Button */}
            <div className="w-full pt-[8px]">
              <Button
                className="w-full text-white text-[16px] font-medium bg-[var(--green-color)] hover:opacity-90 h-[48px] rounded-lg"
                onPress={handleCreateAccount}
                isDisabled={!agreedToTerms}
              >
                {t("Create an Account")}
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

