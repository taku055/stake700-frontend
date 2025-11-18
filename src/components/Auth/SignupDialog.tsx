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

const inputStyles =
  "bg-[#fff1] border-none rounded-sm! hover:bg-[#fff2] focus-within:hover:bg-[#fff2]";

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
        className="w-[460px] bg-[var(--background)] max-h-[calc(var(--viewport-height) * 80)] overflow-y-auto"
        dir={"ltr"}
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
            className="btn mr-[24px] border-0! uppercase underline"
            onClick={() => {
              onClose();
              loginOpenedState.value = true;
            }}
          >
            {t("login")}
          </button>
        </ModalHeader>
        <ModalBody className="flex flex-col px-[24px] pb-[32px] pt-[32px]">
          <form className="flex flex-col w-full gap-[16px]" onSubmit={onSubmit}>
            <div className="flex flex-col gap-[10px]">
              <div className="text-[#FFFFFF80] text-[14px]">{t("new_member")}</div>
              <div className="uppercase text-white text-[18px]">
                {t("register_now")}
              </div>
            </div>
            <div className="flex flex-col gap-[16px] w-full pt-[8px]">
              <Input
                type="text"
                label={t("first_name")}
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
                variant="bordered"
                classNames={{
                  inputWrapper: inputStyles,
                  input: "text-white",
                }}
                ref={firstNameRef}
              />
              <Input
                type="text"
                label={t("middle_name")}
                value={middleName}
                onChange={(e: any) => setMiddleName(e.target.value)}
                variant="bordered"
                classNames={{
                  inputWrapper: inputStyles,
                  input: "text-white",
                }}
              />
              <Input
                type="text"
                label={t("last_name")}
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
                variant="bordered"
                classNames={{
                  inputWrapper: inputStyles,
                  input: "text-white",
                }}
              />
              <Input
                type="text"
                label={t("username")}
                value={userName}
                onChange={(e: any) => setUserName(e.target.value)}
                variant="bordered"
                classNames={{
                  inputWrapper: inputStyles,
                  input: "text-white",
                }}
              />
              <DatePicker
                label={t("birthday")}
                value={birthday}
                onChange={(value: CalendarDate | null) => setBirthday(value!)}
                classNames={{
                  inputWrapper: inputStyles,
                  input: "text-white",
                }}
              />
              <Input
                type="email"
                label={t("email")}
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                classNames={{
                  inputWrapper: inputStyles,
                  input: "text-white",
                }}
                variant="bordered"
              />

              <Input
                type={showPassword ? "text" : "password"}
                label={t("password")}
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                classNames={{
                  inputWrapper: inputStyles,
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
            <Button
              className={`w-full text-white text-[16px] bg-[var(--green-color)] uppercase`}
              type="submit"
              radius="sm"
              isLoading={loading}
            >
              {t("register")}
            </Button>
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
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
