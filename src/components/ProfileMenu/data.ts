import { walletDialogOpenedState } from "@/state/walletDialogState";
import { vipOpenedState } from "@/state/vipOpenedState";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";
import { BASE_URL } from "@/config/constants";
 
export const data = [
  {
    title: "Wallet",
    icon: `${BASE_URL}/images/icons/wallet.svg`,
    onClick: () => walletDialogOpenedState.value = true,
  },
  {
    title: "VIP",
    icon: `${BASE_URL}/images/icons/vip-club.svg`,
    onClick: () => {
      vipOpenedState.value = true
    },
  },
  {
    title: "Affiliate",
    icon: `${BASE_URL}/images/icons/affiliate.svg`,
    href: "/affiliate",
  },
  {
    title: "Statistics",
    icon: `/images/icons/icons/satistics.png`,
  },
  {
    title: "Transactions",
    icon: `${BASE_URL}/images/icons/transactions.png`,
  },
  {
    title: "My Bets",
    icon: `/images/icons/icons/my-bet.png`,
    href: "/my-bets/casino",
  },
  {
    title: "Settings",
    icon: `/images/icons/icons/setting.png`,
  },
  {
    title: "Betalarab Smart",
    icon: `/images/icons/icons/stake-smart.png`,
  },
  {
    title: "Live Support",
    icon: `${BASE_URL}/images/icons/live-support.svg`,
    onClick: () => liveSupportExpandedState.value = true,
  },
  // {
  //   title: "Logout",
  //   icon: "/icons/logout.svg",
  // }

];