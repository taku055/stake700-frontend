import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import AriesWithdraw from "./AriesWithdraw";
import WithdrawalPanel from "@/components/DepositDialogFull/WithdrawalPanel";

const WithdrawPage = () => {
  const t = useTranslations("UserBalancePage");

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        {t("Withdraw")}
      </div>
      <div className="flex flex-col w-full p-5 gap-5">
        <Tabs aria-label="Withdraw options" classNames={{ base: "w-full" }}>
          <Tab key="aries" title="Aries">
            <AriesWithdraw />
          </Tab>
          <Tab key="crypto" title="Crypto">
            <WithdrawalPanel />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default WithdrawPage;
