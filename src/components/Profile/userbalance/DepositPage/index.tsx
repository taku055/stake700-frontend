import { useEffect } from "react";
import DepositPanel from "@/components/DepositDialogFull/DepositPanel";
import { walletPanelState } from "@/state/accountDialogs";
import { initDepositPromo } from "@/state/depositPromoState";

const DepositPage = () => {
  // The promotion this wallet was opened for (offer "Deposit" button or ?promo=)
  useEffect(() => {
    initDepositPromo(walletPanelState.value.bonusId);
  }, [walletPanelState.value.bonusId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col w-full py-5 gap-5">
        <DepositPanel />
      </div>
    </div>
  );
};

export default DepositPage;
