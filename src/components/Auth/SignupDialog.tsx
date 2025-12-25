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
import { Eye, EyeOff } from "lucide-preact";
import {
  parseDate,
  CalendarDate,
} from "@internationalized/date";
import { useLocation } from "preact-iso";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { BASE_URL } from "@/config/constants";

// const inputStyles =
//   "bg-[#fff1] border-none rounded-sm! hover:bg-[#fff2] focus-within:hover:bg-[#fff2]";

interface ISignupComponentProps {
  isOpen: boolean;
  onClose: () => void;
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [birthday, setBirthday] = useState(parseDate("1990-01-01"));
  const t = useTranslations("SignupDialog");
  const location = useLocation();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const { refCode } = useAffiliateNavigation();

  useEffect(() => {
    setEmail("");
    setUserName("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setFirstName("");
    setLastName("");

    if (isOpen) {
      setTimeout(() => {
        firstNameRef.current?.focus();
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
        toast.error(t("please_input_all_fields"));
        return;
      }

      if (!userName.trim()) {
        toast.error(t("please_input_all_fields"));
        return;
      }

      const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      if (!regex.test(userName.trim())) {
        toast.error(
          t("first_letter_condition")
        );
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
          middleName,
          birthDay: birthday.toString(),
        });

        userState.value = res.user;
        accessTokenState.value = res.accessToken;
        setAxiosAuthToken(res.accessToken);
        toast.success("Successfully registered");
        onClose();
      } catch (ex) {
        if (axios.isAxiosError(ex)) {
          if (ex.response?.status === 400) {
            toast.error("Email or username is already taken");
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
        console.error(ex);
      }
      setLoading(false);
    },
    [email, userName, password, refCode]
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
        className="bg-[var(--background)] w-[630px] h-[716px] max-w-[630px] max-h-[716px] rounded-[8px] overflow-y-auto"
        dir={"ltr"}
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
          <button
            className="rounded-[4px] w-[20px] h-[20px]"
            onClick={() => {
              onClose();
              // registerOpenedState.value = true;
            }}
          >
            {/* {t("register")} */}
          </button>
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
                      onClose();
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
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
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
                  <span>{t("middle_name")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <Input
                  type="text"
                  label={t("middle_name")}
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
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
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
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
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
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <DatePicker
                  value={birthday}
                  onChange={(value: CalendarDate | null) => setBirthday(value!)}
                  classNames={{
                    input: "text-white",
                  }}
                />
              </div>

              <div className="h-[68px]">
                <label className="flex text-[#FFFFFF] text-[14px] leading-[20px] pb-[4px] h-[24px]">
                  <span>{t("email")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
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
                  <span>{t("password")}</span>
                  <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  label={t("password")}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  classNames={{
                    // inputWrapper: inputStyles,
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
            {/* <div className="flex items-center justify-center gap-[12px] my-[20px]">
              <img
                src="/images/icons/login_contact_support.png"
                alt="contact_support"
                className="w-[16px] h-[16px]"
              />
              <span className="text-[14px] text-[#FFFFFFB2]">
                {t("contact_support")}
              </span>
            </div> */}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
