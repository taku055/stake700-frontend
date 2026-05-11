import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import { Bitcoin } from "lucide-preact";
import WithdrawalPanel from "@/components/DepositDialogFull/WithdrawalPanel";

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
            tabList: "gap-2",
            tab: "min-w-[56px] h-[44px] px-3 rounded-xl border-2 border-transparent data-[selected=true]:border-green-500",
            tabContent:
              "text-white/70 data-[selected=true]:text-green-500 flex items-center justify-center",
            cursor: "bg-transparent",
          }}
        >
          <Tab
            key="crypto"
            title={
              <div
                className="flex items-center justify-center"
                title={t("Crypto")}
              >
                <Bitcoin className="w-5 h-5" />
                <span className="sr-only">{t("Crypto")}</span>
              </div>
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
