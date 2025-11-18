import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
const TransactionHistoryPage = () => {
  const t = useTranslations("UserBalancePage");
  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">{t("Transaction History")}</div>
      <div className="flex flex-col w-full p-5 gap-5">
        <div className="px-5 py-3 bg-[#FFFFFF0D] rounded-md">
          {t("Transaction History")}
        </div>
        <button className="bg-[#2A8038] text-[#FFFFFF] px-4 py-2 rounded-md">
          {t("Show")}
        </button>
      </div>

    </div>
  )
}

export default TransactionHistoryPage;