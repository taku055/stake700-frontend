import { userState } from "@/state/userState";
import {
  ASSET_BASE_URL,
  RTL_LANGUAGES,
} from "@/config/constants";
import { Button } from "@heroui/react";
import { loginOpenedState } from "@/state/loginOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";
import WalletBox from "./WalletBox";
import { useTranslations } from "@/context/I18nContext";
import { localeState } from "@/state/localeState";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { SearchWidgetHeader } from "./SearchWidget";
import { searchWidgetState as searchWidgetStateHeader } from "@/state/searchWidgetState";
import LocaleSelection from "../LocaleSelection";
import { ChevronLeft, Dices, Heart, Search, Trophy } from "lucide-preact";
import {
  navigationSidebarExpandedState,
} from "@/state/navigationSidebarState";
import { Link } from "@/components/common";
import ProfileMenu from "./ProfileMenu";
import { useLocation } from "preact-iso";

export default function Header() {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const t = useTranslations("Header");
  const { modifyHref } = useAffiliateNavigation();
  const location = useLocation();
  const path = location.path || "/";
  const isSports = path.startsWith("/sports");

  const productTabClass = (active: boolean) =>
    `flex items-center gap-2 h-9 px-4 rounded-full text-sm font-semibold transition-colors ${
      active ? "bg-[#2f4553] text-white" : "text-[#b1bad3] hover:text-white"
    }`;

  return (
    <header className="relative z-[200] bg-[var(--header-background)] w-full mx-auto h-[60px] flex items-center justify-center border-b border-[#213743]">
      <div className="flex flex-col items-center px-3 w-full mx-auto">
        <div className="flex flex-row items-center justify-between w-full h-[60px] gap-2">
          <div className="flex flex-row items-center gap-3 min-w-0">
            <button
              type="button"
              className="w-10 h-10 hidden sm:flex! items-center justify-center rounded-md text-[#b1bad3] hover:bg-[#2f4553] hover:text-white transition-colors shrink-0"
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
            <Link href="/" className="shrink-0">
              <img
                src={`${ASSET_BASE_URL}/logo.png`}
                alt="Logo"
                className="h-[32px] object-contain"
              />
            </Link>
          </div>

          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex! items-center h-11 px-1 rounded-full bg-[#0f212e]">
            <Link href="/?page=lobby-casino" className={productTabClass(!isSports)}>
              <Dices size={16} />
              {t("Casino")}
            </Link>
            <Link href="/sports" className={productTabClass(isSports)}>
              <Trophy size={16} />
              {t("Sports")}
            </Link>
          </nav>

          <div
            className={`${isRTL ? "mr-auto" : "ml-auto"
              } text-[14px] leading-[20px] flex flex-row items-center gap-2`}
          >
            <div className="flex flex-row items-center gap-2 w-[60px]">
              <LocaleSelection headerMode={true} />
            </div>
            <div className="flex flex-row items-center">
              <div>
                <button
                  type="button"
                  className="flex md:w-[44px] md:h-[44px] w-[32px] h-[32px] items-center justify-center"
                  aria-label={t("Search")}
                  onClick={() =>
                  (searchWidgetStateHeader.value =
                    !searchWidgetStateHeader.value)
                  }
                >
                  <Search aria-hidden="true" className="w-[20px] h-[20px]" />
                </button>
                <SearchWidgetHeader />
              </div>
            </div>
            {userState.value?.id && (
              <button
                type="button"
                className="flex md:w-[44px] md:h-[44px] w-[32px] h-[32px] items-center justify-center"
                aria-label={t("Favorites")}
                onClick={() => location.route("/favorites")}
              >
                <Heart aria-hidden="true" className="w-[20px] h-[20px]" />
              </button>
            )}
            {!userState.value?.id ? (
              <>
                <Button
                  variant="light"
                  className="btn bg-[#2f4553]! text-white! text-sm font-semibold min-w-0 w-auto h-10 rounded-md px-4"
                  size="sm"
                  onPress={() => (loginOpenedState.value = true)}
                >
                  {t("login")}
                </Button>
                <Button
                  variant="light"
                  className="btn text-sm font-semibold min-w-0 w-auto h-10 bg-[#1475e1]! hover:bg-[#0f62c2]! px-4 text-white rounded-md"
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
      </div>
    </header>
  );
}
