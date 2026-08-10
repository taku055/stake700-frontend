import { useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { Tabs, Tab } from "@heroui/react";
import DepositPanel from "@/components/DepositDialogFull/DepositPanel";
import EpayclubDeposit from "./EpayclubDeposit";
import FineraDeposit from "./FineraDeposit";
import { PROFILE_PAY_TAB, ProfilePayTabTitle } from "../profilePayTabImages";
import {
  apiGetPaymentProviders,
  getEnabledFineraDepositMethods,
  getFineraProvider,
  tFineraPaymentMethod,
} from "@/api/wallet/apiGetPaymentProviders";
import {
  clearDepositPromoFromUrl,
  currentUserHasActiveBonusCycle,
} from "@/helpers/hasActiveBonusCycle";

const FINERA_TAB_META: Record<
  tFineraPaymentMethod,
  { key: string; labelKey: string; icon: string }
> = {
  card: {
    key: "finera_card",
    labelKey: "Pay with card",
    icon: PROFILE_PAY_TAB.visa,
  },
  googlepay: {
    key: "finera_googlepay",
    labelKey: "Pay with Google Pay",
    icon: PROFILE_PAY_TAB.googlePay,
  },
  applepay: {
    key: "finera_applepay",
    labelKey: "Pay with Apple Pay",
    icon: PROFILE_PAY_TAB.applePay,
  },
};

const DepositPage = () => {
  const t = useTranslations("UserBalancePage");
  const [fineraMethods, setFineraMethods] = useState<tFineraPaymentMethod[]>(
    [],
  );
  const [fineraMinAmount, setFineraMinAmount] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await apiGetPaymentProviders();
        if (cancelled) return;
        const finera = getFineraProvider(res.providers);
        setFineraMethods(getEnabledFineraDepositMethods(finera));
        setFineraMinAmount(finera?.min_amount ?? 1);
      } catch {
        if (!cancelled) {
          setFineraMethods([]);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (currentUserHasActiveBonusCycle()) {
      clearDepositPromoFromUrl();
    }
  }, []);

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
              <ProfilePayTabTitle
                src={PROFILE_PAY_TAB.crypto}
                label={t("Crypto")}
              />
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
          {fineraMethods.map((method) => {
            const tab = FINERA_TAB_META[method];
            return (
              <Tab
                key={tab.key}
                title={
                  <ProfilePayTabTitle
                    src={tab.icon}
                    label={`Finera ${t(tab.labelKey)}`}
                  />
                }
              >
                <FineraDeposit type={method} minAmount={fineraMinAmount} />
              </Tab>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default DepositPage;
