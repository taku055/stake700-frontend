import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import MessageBox from "./MessageBox";
import { Input, Textarea } from "@heroui/react";

const SendNewPage = () => {
  const t = useTranslations("MessagePage");
  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">{t("Send New")}</div>
      <div className="flex flex-col w-full p-5 gap-5">
        <div className="flex flex-col gap-3 px-3 py-2">
          <Input placeholder={t("Subject")} label={t("Subject")} radius="sm" classNames={{
            label: "text-[#FFFFFF]",
            input: "text-[#FFFFFF]",
            inputWrapper: "bg-[#FFFFFF0D]",
          }} />
          <Textarea placeholder={t("Enter text here")} label={t("Message")} radius="sm" rows={10} classNames={{
            label: "text-[#FFFFFF]",
            input: "text-[#FFFFFF]",
            inputWrapper: "bg-[#FFFFFF0D]",
          }} />
          <button className="bg-[#FFFFFF3D] hover:bg-[#109121] transition-all duration-300 text-[#FFFFFF] px-4 py-2 rounded-md">
            {t("Send")}
          </button>
        </div>
      </div>

    </div>
  )
}

export default SendNewPage;