import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import AriesDeposit from "./AriesDeposit";
import DepositPanel from "@/components/DepositDialogFull/DepositPanel";

interface DepositPageProps {
  bonusId?: string;
}

const DepositPage = ({ bonusId }: DepositPageProps) => {
  const t = useTranslations("UserBalancePage");

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        {t("Deposit")}
      </div>
      <div className="flex flex-col w-full p-5 gap-5">
        <Tabs aria-label="Deposit methods">
          <Tab key="card" title={t("Card")}>
            <AriesDeposit bonusId={bonusId} />
          </Tab>
          <Tab key="crypto" title={t("Crypto")}>
            <DepositPanel />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default DepositPage;
