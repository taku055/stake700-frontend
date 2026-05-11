import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import { Bitcoin, CreditCard } from "lucide-preact";
import AriesDeposit from "./AriesDeposit";
import DepositPanel from "@/components/DepositDialogFull/DepositPanel";
import NeonpayDeposit from "./NeonpayDeposit";

interface DepositPageProps {
  bonusId?: string;
}

const GooglePayIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    {/* Simple "G Pay" mark, monochrome */}
    <path d="M120.2 133.6c-1.7 6.9-7.7 11.4-15.9 11.4-9.7 0-17.7-7.4-17.7-18.9S94.6 107 104.3 107c5.2 0 9.4 1.9 12.4 5l-4 4.1c-2.2-2.2-4.9-3.4-8.4-3.4-6.4 0-11.1 5-11.1 13.4 0 8.3 4.7 13.3 11.1 13.3 5.6 0 9-3.1 10-7.7h-10v-5.4h15.9c.2 1.2.4 2.6.4 4.3 0 3.3-.4 6.4-1.2 9z" />
    <path d="M170.4 146.7h-6.6l-12.8-36.8h7.2l8.9 27.7h.2l9-27.7h7.1z" />
    <path d="M127.9 109.9h15.5c7.5 0 12.8 5.1 12.8 12.5 0 7.4-5.3 12.5-12.8 12.5h-8.8v11.8h-6.7zm6.7 18.8h8.4c4.2 0 6.7-2.6 6.7-6.3 0-3.8-2.5-6.3-6.7-6.3h-8.4z" />
  </svg>
);

const ApplePayIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    {/* Simple "Apple + Pay" monochrome glyphs */}
    <path d="M78.2 87.7c4.6-5.6 7.7-13.4 6.9-21.2-6.6.3-14.6 4.4-19.3 10-4.3 5-8.1 13-7.1 20.6 7.4.6 14.8-3.7 19.5-9.4z" />
    <path d="M106.2 97.6c-10.7-.6-19.8 6.1-25 6.1-5.2 0-13.2-5.8-21.7-5.6-11.1.2-21.4 6.5-27.2 16.5-11.6 20.1-3 49.9 8.3 66.2 5.5 8 12 16.9 20.6 16.6 8.3-.3 11.5-5.4 21.5-5.4 10 0 12.9 5.4 21.7 5.2 9-.2 14.7-8.1 20.1-16.2 6.3-9.2 8.9-18.2 9-18.7-.2-.1-17.2-6.6-17.4-26.1-.2-16.3 13.3-24.1 13.9-24.5-7.6-11.1-19.3-12.3-23.8-12.6z" />
    <path d="M150.1 141.2h9.9c6.2 0 10.1 3.3 10.1 8.6 0 5.3-3.9 8.7-10.2 8.7h-5.7v8h-4.1zm4.1 13.7h4.7c4.2 0 6.5-1.8 6.5-5.1 0-3.2-2.3-5.1-6.5-5.1h-4.7z" />
    <path d="M173.9 166.5v-1.9c1.2 1.3 3.3 2.3 5.6 2.3 3.6 0 6.1-1.9 6.1-4.9 0-2.4-1.3-3.7-4.5-4.4l-1.8-.4c-2.1-.5-3-1.2-3-2.4 0-1.5 1.3-2.6 3.4-2.6 2 0 3.4.9 4.1 2.1l3.2-1.4c-1.1-2.2-3.7-3.7-7.2-3.7-4.3 0-7.4 2.4-7.4 5.9 0 2.7 1.7 4.4 5.3 5.2l1.8.4c1.9.4 2.7 1.1 2.7 2.3 0 1.5-1.5 2.7-3.8 2.7-2.3 0-3.9-1-4.8-2.4z" />
  </svg>
);

const DepositPage = ({ bonusId }: DepositPageProps) => {
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
            tabList: "gap-2",
            tab: "min-w-[56px] h-[44px] px-3 rounded-xl border-2 border-transparent data-[selected=true]:border-green-500",
            tabContent:
              "text-white/70 data-[selected=true]:text-green-500 flex items-center justify-center",
            cursor: "bg-transparent",
          }}
        >
          {/* <Tab key="card" title={t("Card")}>
            <AriesDeposit bonusId={bonusId} />
          </Tab> */}
          <Tab
            key="crypto"
            title={
              <div className="flex items-center justify-center" title={t("Crypto")}>
                <Bitcoin className="w-5 h-5" />
                <span className="sr-only">{t("Crypto")}</span>
              </div>
            }
          >
            <DepositPanel />
          </Tab>
          <Tab
            key="neonpay_card"
            title={
              <div
                className="flex items-center justify-center"
                title={t("Pay with card")}
              >
                <CreditCard className="w-5 h-5" />
                <span className="sr-only">{t("Pay with card")}</span>
              </div>
            }
          >
            <NeonpayDeposit type="card" />
          </Tab>
          <Tab
            key="neonpay_googlepay"
            title={
              <div
                className="flex items-center justify-center"
                title={t("Pay with Google Pay")}
              >
                <GooglePayIcon className="w-6 h-6" />
                <span className="sr-only">{t("Pay with Google Pay")}</span>
              </div>
            }
          >
            <NeonpayDeposit type="googlepay" />
          </Tab>
          <Tab
            key="neonpay_applepay"
            title={
              <div
                className="flex items-center justify-center"
                title={t("Pay with Apple Pay")}
              >
                <ApplePayIcon className="w-6 h-6" />
                <span className="sr-only">{t("Pay with Apple Pay")}</span>
              </div>
            }
          >
            <NeonpayDeposit type="applepay" />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default DepositPage;
