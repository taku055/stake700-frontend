import { useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import WithdrawalPanel from "@/components/DepositDialogFull/WithdrawalPanel";
import FineraWithdraw from "./FineraWithdraw";
import EcohpayWithdraw from "./EcohpayWithdraw";
import { PROFILE_PAY_TAB, ProfilePayTextTabTitle } from "../profilePayTabImages";
import {
  apiGetPaymentProviders,
  getEnabledEcohpayWithdrawMethods,
  getEnabledFineraWithdrawMethods,
  getEcohpayProvider,
  getFineraProvider,
  tFineraWithdrawMethod,
} from "@/api/wallet/apiGetPaymentProviders";

const WITHDRAW_TAB_LABEL_KEYS: Record<tFineraWithdrawMethod, string> = {
  card: "Finera_withdraw_card",
  card_ref: "Finera_withdraw_card_ref",
  bank: "Finera_withdraw_bank",
};

const WithdrawPage = () => {
  const t = useTranslations("UserBalancePage");
  const [fineraMethods, setFineraMethods] = useState<tFineraWithdrawMethod[]>(
    [],
  );
  const [ecohpayMethods, setEcohpayMethods] = useState<tFineraWithdrawMethod[]>(
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await apiGetPaymentProviders();
        if (cancelled) return;
        const finera = getFineraProvider(res.providers);
        setFineraMethods(getEnabledFineraWithdrawMethods(finera));
        const ecohpay = getEcohpayProvider(res.providers);
        setEcohpayMethods(getEnabledEcohpayWithdrawMethods(ecohpay));
      } catch {
        if (!cancelled) {
          setFineraMethods([]);
          setEcohpayMethods([]);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col w-full py-5 gap-5 px-5">
        <Tabs
          aria-label={t("Withdraw tab options")}
          variant="light"
          classNames={{
            base: "w-full",
            tabList:
              "gap-2 p-0 bg-transparent rounded-sm flex-wrap w-full",
            tab: [
              "h-auto min-h-[44px] w-auto min-w-0 !p-0 m-0 rounded-lg",
              "border border-white/12 bg-white/[0.04]",
              "data-[selected=true]:border-[var(--green-color)]",
              "data-[selected=true]:bg-[var(--green-color)]/15",
              "transition-colors",
            ].join(" "),
            tabContent:
              "text-white/65 data-[selected=true]:text-white flex items-center justify-center",
            cursor: "bg-transparent",
            panel: "w-full pt-4",
          }}
        >
          <Tab
            key="crypto"
            title={
              <ProfilePayTextTabTitle
                src={PROFILE_PAY_TAB.crypto}
                label={t("Crypto")}
              />
            }
          >
            <WithdrawalPanel />
          </Tab>
          {fineraMethods.map((method) => (
            <Tab
              key={`finera_withdraw_${method}`}
              title={
                <ProfilePayTextTabTitle
                  src={PROFILE_PAY_TAB.visa}
                  caption="Finera"
                  label={t(WITHDRAW_TAB_LABEL_KEYS[method])}
                />
              }
            >
              <FineraWithdraw method={method} />
            </Tab>
          ))}
          {ecohpayMethods.map((method) => (
            <Tab
              key={`ecohpay_withdraw_${method}`}
              title={
                <ProfilePayTextTabTitle
                  src={PROFILE_PAY_TAB.visa}
                  caption="Ecohpay"
                  label={t(WITHDRAW_TAB_LABEL_KEYS[method])}
                />
              }
            >
              <EcohpayWithdraw method={method} />
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default WithdrawPage;
