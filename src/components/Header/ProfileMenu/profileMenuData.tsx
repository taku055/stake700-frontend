/** Public URL under `public/images/profile/`. */
export type ProfileMenuIconSrc = `/images/profile/${string}`;

/** Keys must exist under i18n `Header` (e.g. t("ProfileMenuPersonalBalance")). */
export type ProfileMenuLabelKey =
  | "ProfileMenuPersonalBalance"
  | "ProfileMenuKyc"
  | "ProfileMenuPromotions"
  | "ProfileMenuGameHistory"
  | "ProfileMenuTransactionHistory"
  | "ProfileMenuWithdrawals"
  | "ProfileMenuLogout";

export type ProfileMenuActionKey = "openProfile" | "logout";

type ProfileMenuItemHref = {
  id: string;
  labelKey: ProfileMenuLabelKey;
  /** PNG under `/images/profile/` (logout uses Lucide `LogOut` in the menu, not `iconSrc`). */
  iconSrc?: ProfileMenuIconSrc;
  href: string;
};

type ProfileMenuItemAction = {
  id: string;
  labelKey: ProfileMenuLabelKey;
  /** Omit on `action: "logout"` — menu renders Lucide `LogOut`. */
  iconSrc?: ProfileMenuIconSrc;
  action: ProfileMenuActionKey;
  /** Used with `action: "openProfile"` — same tab keys as `ProfileComponent`. */
  defaultTab?: string;
};

export type ProfileMenuItem = ProfileMenuItemHref | ProfileMenuItemAction;

export function isProfileMenuHrefItem(
  item: ProfileMenuItem,
): item is ProfileMenuItemHref {
  return "href" in item && typeof item.href === "string";
}

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    id: "personal-balance",
    labelKey: "ProfileMenuPersonalBalance",
    iconSrc: "/images/profile/user-info.png",
    action: "openProfile",
    defaultTab: "/my-profile/personal-details",
  },
  // {
  //   id: "kyc",
  //   labelKey: "ProfileMenuKyc",
  //   iconSrc: "/images/profile/kyc.png",
  //   href: "/support/help-center",
  // },
  {
    id: "promotions",
    labelKey: "ProfileMenuPromotions",
    iconSrc: "/images/profile/promotion.png",
    href: "/promotions",
  },
  {
    id: "game-history",
    labelKey: "ProfileMenuGameHistory",
    iconSrc: "/images/profile/game-history.png",
    href: "/my-bets/casino",
  },
  {
    id: "transaction-history",
    labelKey: "ProfileMenuTransactionHistory",
    iconSrc: "/images/profile/transaction-history.png",
    action: "openProfile",
    defaultTab: "/balance-management/transaction-history",
  },
  {
    id: "withdrawals",
    labelKey: "ProfileMenuWithdrawals",
    iconSrc: "/images/profile/withdrawals.png",
    action: "openProfile",
    defaultTab: "/balance-management/withdraw",
  },
  {
    id: "logout",
    labelKey: "ProfileMenuLogout",
    action: "logout",
  },
];
