import { useState, useCallback, useEffect, useRef } from "preact/hooks";
import { Button } from "@heroui/react";
import axios from "axios";
import { toast } from "@/helpers/toast";
import { accessTokenState } from "@/state/accessTokenState";
import { userState } from "@/state/userState";
import { apiLogin } from "@/api/account/apiLogin";
import { setAxiosAuthToken } from "@/api/instance";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "preact-iso";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Input,
  Checkbox,
  Switch,
} from "@/components/common";
import { forgotOpenedState } from "@/state/forgotOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";

interface ILoginComponentProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function LoginDialog({ isOpen, onClose }: ILoginComponentProps) {
  const [email, setEmail] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const t = useTranslations("LoginDialog");
  const tToast = useTranslations("ToastMessages");
  const location = useLocation();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setRemember(false);
    setIsAgent(false);

    if (isOpen) {
      setTimeout(() => {
        emailRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      if (loading) {
        return;
      }

      if (!email || !password) {
        toast.error(tToast("validation.all_fields_required"));
        return;
      }

      setLoading(true);
      try {
        const res = await apiLogin(
          email,
          password,
          isAgent ? "AGENT" : "NORMAL"
        );
        userState.value = res.user;
        accessTokenState.value = res.accessToken;
        setAxiosAuthToken(res.accessToken);
        toast.success(t("successfully_logged_in"));
        onClose();
        setLoading(false);
        if (res.user.isSuperAgent) {
          location.route("/superagent");
        } else if (res.user.isAgent) {
          location.route("/agent");
        }
      } catch (ex) {
        if (axios.isAxiosError(ex)) {
          if (ex.response?.status === 401) {
            toast.error(t("email_or_password_is_incorrect"));
          } else {
            toast.error(t("something_went_wrong"));
          }
        } else {
          toast.error(t("something_went_wrong"));
        }
        console.error(ex);
        setLoading(false);
      }
    },
    [remember, email, password, isAgent, t]
  );

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      classNames={{
        backdrop: "z-[10000000]",
        wrapper: "z-[10000000]",
      }}
    >
      <ModalContent
        className="bg-[var(--background)] max-h-[calc(var(--viewport-height) * 80)] overflow-y-auto"
      >
        <ModalHeader className="flex justify-between">
          <img
            src={`https://tekio.s3.eu-north-1.amazonaws.com/${(
              import.meta.env.VITE_SITE_NAME as string
            ).toLowerCase()}/logo.png`}
            className="h-[36px] md:h-[40px] md:max-w-[200px]"
            alt={import.meta.env.VITE_SITE_NAME as string}
          />
          <button
            className="btn btn-primary mr-[24px]"
            onClick={() => {
              onClose();
              registerOpenedState.value = true;
            }}
          >
            {t("register")}
          </button>
        </ModalHeader>
        <ModalBody className="flex flex-col px-[24px] pb-[32px] pt-[32px]">
          <form className="flex flex-col w-full gap-[16px]" onSubmit={onSubmit}>
            <div className="flex flex-col gap-[10px]">
              <div className="text-[#FFFFFF80] text-[14px]">
                {t("already_have_an_account")}
              </div>
              <div className="uppercase text-white text-[18px]">
                {t("sign_in_waiting")}
              </div>
            </div>
            <div className="flex flex-col gap-[16px]">
              <Input
                type="text"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                label={t("username")}
                classNames={{
                  inputWrapper: "bg-[#fff1] border-none rounded-sm!",
                  input: "text-white",
                }}
                ref={emailRef}
              />
              <Input
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                label={t("password")}
                classNames={{
                  inputWrapper: "bg-[#fff1] border-none rounded-sm!",
                  input: "text-white",
                }}
              />
              <div className="flex flex-row text-[14px] items-center px-[8px] justify-between text-[#FFFFFFB2]">
                <div>
                  <span> {t("are_you_an_agent")} </span>
                </div>
                <Switch isSelected={isAgent} onValueChange={setIsAgent} />
              </div>
              <div className="flex flex-row px-[8px]">
                <Checkbox isSelected={remember} onValueChange={setRemember}>
                  <span className="text-[14px] text-[#FFFFFFB2]">
                    {t("remember_me")}
                  </span>
                </Checkbox>
              </div>
              <Button
                className={`w-full text-white text-[16px] bg-[var(--green-color)] uppercase`}
                type="submit"
                radius="sm"
                isLoading={loading}
              >
                {t("login")}
              </Button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  forgotOpenedState.value = true;
                }}
                className="mt-[20px] uppercase text-[14px] text-[#FFFFFFB2]"
              >
                {t("forgot_password")}
              </button>
              <img
                src="/images/login_ad.png"
                alt="login_ad"
                className="w-full"
              />
              <div className="flex items-center justify-center gap-[12px] mt-[20px]">
                <img
                  src="/images/icons/login_contact_support.png"
                  alt="contact_support"
                  className="w-[16px] h-[16px]"
                />
                <span className="text-[14px] text-[#FFFFFFB2]">
                  {t("contact_support")}
                </span>
              </div>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
