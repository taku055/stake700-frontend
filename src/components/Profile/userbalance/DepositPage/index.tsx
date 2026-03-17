import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import AriesDeposit from "./AriesDeposit";

const DepositPage = () => {
  const t = useTranslations("UserBalancePage");

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        {t("Deposit")}
      </div>
      <div className="flex flex-col w-full p-5 gap-5">
        <AriesDeposit />
      </div>
    </div>
  );
};

export default DepositPage;
