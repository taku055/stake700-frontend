import { useEffect } from "preact/hooks";
import DepositPanel from "@/components/DepositDialogFull/DepositPanel";
import {
  clearDepositPromoFromUrl,
  currentUserHasActiveBonusCycle,
} from "@/helpers/hasActiveBonusCycle";

const DepositPage = () => {
  useEffect(() => {
    if (currentUserHasActiveBonusCycle()) {
      clearDepositPromoFromUrl();
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col w-full py-5 gap-5">
        <DepositPanel />
      </div>
    </div>
  );
};

export default DepositPage;
