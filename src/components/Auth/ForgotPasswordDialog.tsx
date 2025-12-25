import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { Modal, ModalContent, ModalBody, Input } from "@/components/common";
import { toast } from "@/helpers/toast";
import { validateEmail } from "@/helpers/validateEmail";
import { apiForgotPassword } from "@/api/account/apiForgotPassword";
import { Settings } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { Button } from "@heroui/react";
import { BASE_URL } from "@/config/constants";

interface IForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordDialog({
  isOpen,
  onClose,
}: IForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const enabledSubmit = useMemo(() => !!email && validateEmail(email), [email]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const t = useTranslations("ForgotDialog");
  const tToast = useTranslations("ToastMessages");

  useEffect(() => {
    setEmail("");
    setMsg("");
    setError("");
  }, [isOpen]);

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      if (loading) {
        return;
      }

      if (!email || !validateEmail(email)) {
        toast.error(tToast("validation.invalid_email"));
        return;
      }

      setLoading(true);
      try {
        setLoading(true);
        await apiForgotPassword(email);
        setError("");
        setMsg(t("Password reset link was sent to") + " " + email);
      } catch (ex) {
        setError(
          (t("Something went wrong. Please check your email exists in the") +
            " " + import.meta.env.VITE_SITE_NAME) as string
        );
        setMsg("");
      }
      setLoading(false);
    },
    [email]
  );

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
      <ModalContent className="bg-[var(--background)] w-[630px] h-[716px] max-w-[630px] max-h-[716px] rounded-[8px] overflow-y-auto">
        <div className="flex justify-between items-center w-full h-[60px] min-h-[60px] py-[10px] px-[16px] border-b border-[#FFFFFF0A]">
          <div className="flex items-center gap-[12px]">
            <Settings className="w-5 h-5 text-white" />
            <span className="text-white text-[18px] font-normal">{t("Forgot your password?")}</span>
          </div>
        </div>
        <ModalBody className="flex flex-col p-[16px] h-[656px]">
          <form className="flex flex-col h-full justify-between w-full gap-[24px]" onSubmit={onSubmit}>
            <div className="flex flex-col gap-[16px] flex-1">
              <div className="h-[68px] flex-1">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("email")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <Input
                  type="email"
                  value={email}
                  autoCapitalize="off"
                  autoFocus
                  onChange={(e: any) => setEmail(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-lg! h-[44px]",
                    input: "text-white",
                  }}
                />
              </div>

              <div className="w-full flex flex-col justify-end">
                <Button
                  className="w-full text-white text-[16px] h-[49px] font-medium bg-[var(--green-color)] hover:opacity-90 rounded-lg"
                  type="submit"
                  radius="sm"
                  isLoading={loading}
                  disabled={!enabledSubmit}
                >
                  {t("recover_password")}
                </Button>
              </div>

              {error && (
                <div className="text-center text-[12px] text-[var(--pink-color)]">
                  {error}
                </div>
              )}
              {msg && (
                <div className="text-center text-[12px] text-[var(--green-color)]">
                  {msg}
                </div>
              )}
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}