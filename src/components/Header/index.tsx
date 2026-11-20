import { userState } from "@/state/userState";
import { sessionHydratedState } from "@/state/sessionHydratedState";
import { RTL_LANGUAGES } from "@/config/constants";
import { Button } from "@heroui/react";
import { loginOpenedState } from "@/state/loginOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";
import WalletBox from "./WalletBox";
import { useTranslations } from "@/context/I18nContext";
import { localeState } from "@/state/localeState";
import { SearchWidgetHeader } from "./SearchWidget";
import { openSearch, searchWidgetState as searchWidgetStateHeader } from "@/state/searchWidgetState";
import LocaleSelection from "../LocaleSelection";
import { ChevronLeft, Search } from "lucide-react";
import {
  navigationSidebarExpandedState,
} from "@/state/navigationSidebarState";
import { Link } from "@/components/common";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const t = useTranslations("Header");
  const tSearch = useTranslations("HomePage");
  return (
    <header className="relative z-[200] h-[80px] w-full shrink-0 border-b border-[#2f4553] bg-[#0f212e]">
      <div className="flex h-full items-center gap-2 px-3 sm:gap-3 md:px-5">
        {/* Takes whatever room is left so the logo shrinks instead of sliding under the buttons */}
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none">
            <button
              type="button"
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2f4553] text-[#b1bad3] hover:bg-[#213743] hover:text-white sm:flex!"
              aria-label="Toggle sidebar"
              onClick={() => {
                navigationSidebarExpandedState.value = !navigationSidebarExpandedState.value;
              }}
            >
              {navigationSidebarExpandedState.value
                ? <ChevronLeft size={20} className="text-[#b1bad3]" />
                : <img src="/images/icons/menu.svg" alt="Menu" className={`w-5 h-5 ${isRTL ? "scale-x-[-1]" : ""}`} />
              }
            </button>
            <Link href="/" className="block min-w-0">
              <img
                src="/images/brand/logo.png"
                alt="Logo"
                className="block h-auto max-h-10 w-auto max-w-full object-contain object-left sm:max-h-12 lg:max-h-16"
              />
            </Link>
          </div>

          <nav className="mx-auto hidden items-center gap-1 lg:flex!">
            {[
              { href: "/casino", label: t("Casino"), icon: "/images/sidebar/casino.webp" },
              { href: "/live-casino", label: t("Live Casino"), icon: "/images/sidebar/live-casino.webp" },
              { href: "/promotions", label: t("Promotions"), icon: "/images/sidebar/promotions.webp" },
              { href: "/vip", label: t("VIP"), icon: "/images/sidebar/vip.webp" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                scrollToTop
                preventDefaultOnClick={false}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#b1bad3] hover:bg-[#213743] hover:text-white"
              >
                <img src={item.icon} alt="" className="h-6 w-6 object-contain" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex shrink-0 flex-row items-center gap-1.5 text-[14px] leading-[20px] sm:gap-2 lg:ms-0">
            {/* Very narrow phones: language lives in the footer and settings instead */}
            <div className="max-[399px]:hidden">
              <LocaleSelection headerMode={true} />
            </div>
            <div className="relative flex items-center">
              <button
                type="button"
                className="flex h-10 items-center overflow-hidden rounded-md border border-[#2f4553] bg-[#1a2c38] text-sm font-semibold text-white"
                aria-label={tSearch("Search")}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => (searchWidgetStateHeader.value ? (searchWidgetStateHeader.value = false) : openSearch("all"))}
              >
                <span className="grid h-10 w-10 place-items-center bg-[#1475e1]">
                  <Search aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="hidden px-3 sm:inline">{tSearch("Search")}</span>
              </button>
              <SearchWidgetHeader />
            </div>
            {!sessionHydratedState.value ? (
              // Session check in progress: reserve the space instead of flashing Login/Register
              <div className="flex items-center gap-2" aria-hidden>
                <span className="h-9 w-16 animate-pulse rounded-md bg-[var(--background-secondary)]" />
                <span className="h-9 w-24 animate-pulse rounded-md bg-[var(--background-secondary)]" />
              </div>
            ) : !userState.value?.id ? (
              <>
                <Button
                  variant="light"
                  className="btn bg-transparent! text-sm font-semibold text-[#b1bad3]! min-w-0 w-auto h-9 rounded-md px-2"
                  size="sm"
                  onPress={() => (loginOpenedState.value = true)}
                >
                  {t("login")}
                </Button>
                <Button
                  variant="light"
                  className="btn text-sm font-semibold min-w-0 w-auto h-9 bg-[#1475e1]! hover:bg-[#0f62c2]! px-3 sm:px-4 text-white rounded-md"
                  size="sm"
                  onPress={() => (registerOpenedState.value = true)}
                >
                  {t("register")}
                </Button>
              </>
            ) : (
              <div className="flex flex-row justify-center items-center gap-2">
                <WalletBox />
                <ProfileMenu />
              </div>
            )}
          </div>
      </div>
    </header>
  );
}
