import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { Modal, ModalContent, ModalBody, Input } from "@/components/common";
import { toast } from "@/helpers/toast";
import { validateEmail } from "@/helpers/validateEmail";
import { apiForgotPassword } from "@/api/account/apiForgotPassword";
import { KeyRound } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { Button } from "@heroui/react";

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
        setMsg("Password reset link was sent to " + email);
      } catch (ex) {
        setError(
          ("Something went wrong. Please check your email exists in the " +
            import.meta.env.VITE_SITE_NAME) as string
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
      <ModalContent>
        <ModalBody className="bg-[var(--background)] max-h-[calc(var(--viewport-height) * 80)] overflow-y-auto">
          <div className="flex flex-col items-center justify-center p-[36px] gap-[27px]">
            <div className="w-[63px] h-[63px] flex flex-col items-center justify-center rounded-[16px] bg-[#313131] p-[12px]">
              <KeyRound className="w-full h-full" />
            </div>
            <h2 className="font-bold text-[20px] leading-[27px] text-[#fff]">
              {t("Forgot your password?")}
            </h2>
          </div>
          <div className="flex flex-col border-t-1 border-[#FFFFFF0A] w-full">
            <form
              className="flex flex-col w-full gap-[18px]"
              onSubmit={onSubmit}
            >
              <div className="w-full flex justify-center">
                {t("Enter your email address")}
              </div>
              <Input
                label={"Email"}
                value={email}
                autoCapitalize="off"
                autoFocus
                onChange={(e: any) => setEmail(e.target.value)}
              />
              <Button
                className="btn btn-primary bg-[var(--pink-color)]"
                type="submit"
                disabled={!enabledSubmit}
              >
                {t("Submit")}
              </Button>
              {error && <div className="text-center text-[12px] text-[var(--pink-color)]">{error}</div>}
              {msg && <div className="text-center text-[12px] text-[var(--green-color)]">{msg}</div>}
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
