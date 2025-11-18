import { useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import PaymentCard from "@/components/PaymentCard";
import { paymentState } from "@/state/paymentState";
import { depositDialogState } from "@/state/depositDialogState";

const DepositPage = () => {
  const t = useTranslations("UserBalancePage");
  const [selectedPayment, setSelectedPayment] = useState(paymentState.value.array[0]);

  useEffect(() => {
    // setSelectedPayment(paymentState.value.array[0]);
    if (selectedPayment.key == "crypto-currency") {
      depositDialogState.value = {
        isOpen: true,
        defaultTab: "Deposit"
      };
    }
  }, [selectedPayment]);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">{t("Deposit")}</div>
      <div className="flex flex-col w-full p-5 gap-5">
        <div className="grid 3xl:grid-cols-8 md:grid-cols-6 gap-3">
          {
            paymentState.value.array.map((item) => (
              <PaymentCard key={item.key} title={item.title} image={item.logo} logoOnly={false} selected={selectedPayment.key === item.key} onSelect={() => setSelectedPayment(item)} />
            ))
          }
        </div>
        <div className="flex flex-col p-[20px] gap-3 bg-[#FFFFFF0D] rounded-md">
          <div className="flex flex-row gap-1 px-5 py-3 bg-[#FFFFFF0D] rounded-md">
            <div className="flex flex-col min-w-[150px]">
              <span className="text-[#FFFFFFCC]">{t("Payment Name")}</span>
              <span className="text-[#FFFFFF]">Aninda Partim</span>
            </div>
            <div className="flex flex-col min-w-[150px]">
              <span className="text-[#FFFFFFCC]">{t("Fee")}</span>
              <span className="text-[#FFFFFF]">{t("Free")}</span>
            </div>
            <div className="flex flex-col min-w-[150px]">
              <span className="text-[#FFFFFFCC]">{t("Process Time")}</span>
              <span className="text-[#FFFFFF]">{t("Instant")}</span>
            </div>
            <div className="flex flex-col min-w-[150px]">
              <span className="text-[#FFFFFFCC]">{t("Min")}</span>
              <span className="text-[#FFFFFF]">1 $</span>
            </div>
            <div className="flex flex-col min-w-[150px]">
              <span className="text-[#FFFFFFCC]">{t("Max")}</span>
              <span className="text-[#FFFFFF]">100000 $</span>
            </div>
          </div>
          <div className="px-5 py-3 bg-[#FFFFFF0D] rounded-md">
            {t("Deposit-Required-Message")}
          </div>
          <button className="bg-[#2A8038] text-[#FFFFFF] px-4 py-2 rounded-md">
            {t("Deposit")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DepositPage;