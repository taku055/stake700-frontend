import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import MessageBox from "./MessageBox";

const InboxPage = () => {
  const t = useTranslations("MessagePage");
  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">{t("Inbox")}</div>
      <div className="flex flex-col w-full p-5 gap-5">
        <div className="px-5 py-3 bg-[#FFFFFF26] rounded-md">
          <button className="bg-[#2A8038] text-[#FFFFFF] px-4 py-2 rounded-md">
            {t("Show")}
          </button>
        </div>
        <MessageBox title={t("Güncel Adres Bildirimi!!")} children={<div>Güncel Adres Bildirimi!!</div>} receivedAt={"12:00"} />
        <MessageBox title={t("Güncel Adres Bildirimi!!")} children={<div>Güncel Adres Bildirimi!!</div>} receivedAt={"12:00"} />
        <MessageBox title={t("BİLGİLENDİRME!!")} children={<div>BİLGİLENDİRME!!</div>} receivedAt={"12:00"} />
        <MessageBox title={t("BİLGİLENDİRME!!")} children={<div>BİLGİLENDİRME!!</div>} receivedAt={"12:00"} />
      </div>

    </div>
  )
}

export default InboxPage;