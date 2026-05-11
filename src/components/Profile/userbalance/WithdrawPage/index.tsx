import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import WithdrawalPanel from "@/components/DepositDialogFull/WithdrawalPanel";
import { PROFILE_PAY_TAB, ProfilePayTabTitle } from "../profilePayTabImages";

const WithdrawPage = () => {
  const t = useTranslations("UserBalancePage");

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">
        {t("Withdraw")}
      </div>
      <div className="flex flex-col w-full py-5 gap-5">
        <Tabs
          aria-label={t("Withdraw tab options")}
          variant="light"
          classNames={{
            base: "w-full",
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
            <WithdrawalPanel />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default WithdrawPage;
