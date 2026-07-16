import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import DepositPanel from "@/components/DepositDialogFull/DepositPanel";
import NeonpayDeposit from "./NeonpayDeposit";
import EpayclubDeposit from "./EpayclubDeposit";
import { PROFILE_PAY_TAB, ProfilePayTabTitle } from "../profilePayTabImages";

const DepositPage = () => {
  const t = useTranslations("UserBalancePage");

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        {t("Deposit")}
      </div>
      <div className="flex flex-col w-full py-5 gap-5">
        <Tabs
          aria-label="Deposit methods"
          variant="light"
          classNames={{
            tabList: "gap-2 p-0 bg-transparent rounded-sm",
            tab: "h-8 w-12 min-w-12 !p-0 m-0 rounded-sm border-2 border-transparent data-[selected=true]:border-green-500 overflow-hidden",
            tabContent:
              "!p-0 !gap-0 size-full text-white/70 data-[selected=true]:text-green-500 flex items-center justify-center",
            cursor: "bg-transparent",
          }}
        >
          <Tab
            key="crypto"
            title={
              <ProfilePayTabTitle src={PROFILE_PAY_TAB.crypto} label={t("Crypto")} />
            }
          >
            <DepositPanel />
          </Tab>
          <Tab
            key="epayclub_card"
            title={
              <ProfilePayTabTitle
                src={PROFILE_PAY_TAB.epayClub}
                label={t("Visa", undefined, "Visa")}
              />
            }
          >
            <EpayclubDeposit />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default DepositPage;
