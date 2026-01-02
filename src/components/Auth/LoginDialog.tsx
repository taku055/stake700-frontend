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
} from "@/components/common";
import { Select, SelectItem } from "@heroui/react";
import { forgotOpenedState } from "@/state/forgotOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";
import { Eye, EyeOff } from "lucide-preact";
import { signupStep1OpenedState } from "@/state/registerOpenedState";
import { BASE_URL } from "@/config/constants.ts";


interface ILoginComponentProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function LoginDialog({ isOpen, onClose }: ILoginComponentProps) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<string>("NORMAL");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const t = useTranslations("LoginDialog");
  const tToast = useTranslations("ToastMessages");
  const location = useLocation();
  const emailRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    setEmail("");
    setPassword("");
    setRemember(false);
    setUserType("NORMAL");

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
          userType || "NORMAL"
        );
        userState.value = res.user;
        accessTokenState.value = res.accessToken;
        setAxiosAuthToken(res.accessToken);
        toast.success(t("successfully_logged_in"));
        onClose();
        setLoading(false);
        if (res.user.role === "SUPERAGENT") {
          location.route("/superagent");
        } else if (res.user.role === "AGENT") {
          location.route("/agent");
        } else if (res.user.role === "AREA_MANAGER") {
          location.route("/area_manager");
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
    [remember, email, password, userType, t]
  );

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent
        className="bg-[var(--background)] w-[630px] h-[716px] max-w-[630px] max-h-full rounded-[8px] overflow-y-auto"
      >
        <ModalHeader className="flex justify-between w-full h-[60px] min-h-[60px] py-[10px] px-[16px]">
          <img
            // src={`https://tekio.s3.eu-north-1.amazonaws.com/${(
            //   import.meta.env.VITE_SITE_NAME as string
            // ).toLowerCase()}/logo.png`}
            src={`${BASE_URL}/images/icons/logo.svg`}
            className="h-[36px] md:h-[36px] md:max-w-[180px]"
            alt={import.meta.env.VITE_SITE_NAME as string}
          />
          {/* <button
            className="rounded-[4px] w-[20px] h-[20px]"
            onClick={() => {
              onClose();
            }}
          >
          </button> */}
        </ModalHeader>
        <ModalBody className="flex flex-col p-[16px]">
          <form className="flex flex-col w-full gap-[16px]" onSubmit={onSubmit}>
            {/* <label className="uppercase text-white text-[18px]">
              {t("sign_in_waiting")}
            </label> */}
            <div className="flex flex-col ">
              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("Email or Username")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <Input
                  type="text"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-sm! h-[44px] focus-within:bg-[var(--bar-background-color)] focus-within:border-[var(--background-secondary)]",
                    input: "text-white bg-transparent",
                  }}
                  ref={emailRef}
                />
              </div>
              <div className="h-[84px] w-full flex flex-col pt-[16px]">
                <label className="text-[#FFFFFF] flex text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("Password")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-sm h-[44px]",
                    input: "text-white",
                  }}
                  endContent={
                    showPassword ? (
                      <EyeOff 
                        className="w-5 h-5 text-white transition-colors cursor-pointer" 
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <Eye 
                        className="w-5 h-5 text-white transition-colors cursor-pointer" 
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  forgotOpenedState.value = true;
                }}
                className="text-left text-[16px] leading-[24px] font-semibold h-[24px] text-[#FFFFFFB2] hover:text-white transition-colors mt-[8px]"
              >
                {t("forgot_password")}
              </button>

              <div className="w-full h-[68px] pt-[16px]">
                <Button
                  className="w-full h-full text-white text-[16px] font-medium bg-[var(--green-color)] hover:opacity-90 rounded-lg py-[14px] px-[28px]"
                  type="submit"
                  radius="sm"
                  isLoading={loading}
                >
                  {t("login")}
                </Button>
              </div>
            </div>

            <div className="w-full h-[240px] gap-[24px] flex flex-col">
              <div className="flex w-full h-[24px] items-center">
                <div className="flex-1 h-[1px] bg-[var(--bar-background-color)]"></div>
                <span className="w-[38px] px-[8px] text-center text-[16px] text-[#FFFFFF] font-normal leading-[24px] uppercase">OR</span>
                <div className="flex-1 h-[1px] bg-[var(--bar-background-color)]"></div>
              </div>

              <Button
                type="button"
                className="w-full flex items-center justify-center text-white text-[14px] bg-[var(--background-secondary)] hover:bg-[#fff2] py-[12px] px-[28px] h-[48px] rounded-lg"
                radius="sm"
              >
                {t("sign_in_with_passkey")}
              </Button>

              <Button
                type="button"
                className="w-full flex items-center justify-center text-white text-[14px] bg-[var(--background-secondary)] hover:bg-[#fff2] py-[12px] px-[28px] h-[48px] rounded-lg"
                radius="sm"
              >
                <img src={`${BASE_URL}/images/icons/google.svg`} alt="Google" className="w-[20px] h-[20px]" />
                {t("sign_in_with_google")}
              </Button>

              <Button
                type="button"
                className="w-full flex items-center justify-center text-white text-[14px] bg-[var(--background-secondary)] hover:bg-[#fff2] py-[12px] px-[28px] h-[48px] rounded-lg"
                radius="sm"
              >
                {t("sign_in_another_way")}
              </Button>
            </div>

            <div className="text-center mt-[40px]">
              <span className="text-[16px] font-normal text-[#FFFFFFB2] leading-[24px] h-[24px]">
                <span>{t("don_t_have_an_account")}?</span>{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    signupStep1OpenedState.value = true;
                  }}
                  className="text-[16px] font-semibold hover:underline leading-[24px] h-[24px]"
                >
                  {t("register_an_account")}
                </button>
              </span>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
