import { walletDialogOpenedState } from "@/state/walletDialogState";
import { vipOpenedState } from "@/state/vipOpenedState";
 
export const data = [
  {
    title: "Wallet",
    icon: "/icons/wallet.svg",
    onClick: () => walletDialogOpenedState.value = true,
  },
  {
    title: "VIP",
    icon: "/icons/vip-club.svg",
    onClick: () => {
      vipOpenedState.value = true
    },
  },
  {
    title: "Affiliate",
    icon: "/icons/affiliate.svg",
    href: "/affiliate",
  },
  {
    title: "Statistics",
    icon: "/icons/statistics.svg",
  },
  {
    title: "Transactions",
    icon: "/icons/transactions.png",
  },
  {
    title: "My Bets",
    icon: "/icons/my-bets.png",
  },
  {
    title: "Settings",
    icon: "/icons/settings.png",
  },
  {
    title: "Betalarab Smart",
    icon: "/icons/Betalarab-smart.png",
  },
  {
    title: "Live Support",
    icon: "/icons/live-support.svg",
  },
  // {
  //   title: "Logout",
  //   icon: "/icons/logout.svg",
  // }

];