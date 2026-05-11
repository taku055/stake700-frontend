import {
  BadgeCheck,
  Gamepad2,
  Gift,
  Landmark,
  LogOut,
  Receipt,
  UserCircle,
} from "lucide-preact";

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

/** Same component shape as any `lucide-preact` icon (package does not export `LucideIcon`). */
export type ProfileMenuIcon = typeof UserCircle;

type ProfileMenuItemHref = {
  id: string;
  labelKey: ProfileMenuLabelKey;
  icon: ProfileMenuIcon;
  href: string;
};

type ProfileMenuItemAction = {
  id: string;
  labelKey: ProfileMenuLabelKey;
  icon: ProfileMenuIcon;
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
    icon: UserCircle,
    action: "openProfile",
    defaultTab: "/my-profile/personal-details",
  },
  {
    id: "kyc",
    labelKey: "ProfileMenuKyc",
    icon: BadgeCheck,
    href: "/support/help-center",
  },
  {
    id: "promotions",
    labelKey: "ProfileMenuPromotions",
    icon: Gift,
    href: "/promotions",
  },
  {
    id: "game-history",
    labelKey: "ProfileMenuGameHistory",
    icon: Gamepad2,
    href: "/my-bets/casino",
  },
  {
    id: "transaction-history",
    labelKey: "ProfileMenuTransactionHistory",
    icon: Receipt,
    action: "openProfile",
    defaultTab: "/balance-management/transaction-history",
  },
  {
    id: "withdrawals",
    labelKey: "ProfileMenuWithdrawals",
    icon: Landmark,
    action: "openProfile",
    defaultTab: "/balance-management/withdraw",
  },
  {
    id: "logout",
    labelKey: "ProfileMenuLogout",
    icon: LogOut,
    action: "logout",
  },
];
