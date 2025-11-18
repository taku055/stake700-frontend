import { userState } from "@/state/userState";
import { profileOpenedState } from "@/state/profileOpenedState";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

export default function WalletBox() {
  return (
    <div className="flex flex-row gap-1 items-center select-none cursor-pointer hover:bg-[#FFFFFF1A] hover:rounded-md px-3 transition-all duration-300"
      onClick={() => (profileOpenedState.value = true)}
    >
      <span className="text-[12px] font-bold md:text-[14px] text-white ">
        {DEFAULT_CURRENCY_SYMBOL}
        {(
          parseFloat(userState.value?.cash?.toFixed(2) || "0.00") +
          parseFloat(
            userState.value?.PromotionInstance?.bonus?.toFixed(2) || "0.00"
          )
        ).toFixed(2)}
      </span>
      <span className="w-[32px] h-[32px] rounded-full bg-[#FFFFFF66] text-white flex flex-row font-bold text-center items-center justify-center">
        {userState.value?.userName.at(0)?.toUpperCase()}
      </span>
    </div>
  );
}
