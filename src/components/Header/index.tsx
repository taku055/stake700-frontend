import { userState } from "@/state/userState";
import {
  ASSET_BASE_URL,
  mobileMediaQuery,
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
import { ChevronLeft, ChevronRight, Search } from "lucide-preact";
import {
  navigationSidebarExpandedState,
} from "@/state/navigationSidebarState";
import { Link } from "@/components/common";
import { useMediaQuery } from "usehooks-ts";

export default function Header() {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const t = useTranslations("Header");
  const { modifyHref } = useAffiliateNavigation();
  const isMobile = useMediaQuery(mobileMediaQuery);

  return (
    <header className="relative z-[200] bg-[#171412] w-full mx-auto h-[60px] flex items-center justify-center shadow-[0_4px_24px_0_#252525]">
      <div className="flex flex-col items-center px-2 py-1 w-full mx-auto">
        <div className="flex flex-row items-center justify-between w-full h-[60px] gap-1">
          <div className="flex flex-row items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 hidden sm:flex! items-center justify-center rounded-lg bg-[#35302a] hover:bg-(--sidebar-card-hover) transition-colors shrink-0"
              aria-label="Toggle sidebar"
              onClick={() => {
                navigationSidebarExpandedState.value = !navigationSidebarExpandedState.value;
              }}
            >
              {navigationSidebarExpandedState.value
                ? <ChevronLeft size={22} className="text-[#626061]" />
                : <img src="/images/icons/menu.svg" alt="Menu" className={`w-6 h-6 ${isRTL ? "scale-x-[-1]" : ""}`} />
              }
            </button>
            <Link href="/">
              <img
                src={`${ASSET_BASE_URL}/images/icons/logo.svg`}
                alt="Logo"
                className={`h-[36px] object-contain ${isMobile ? "" : isRTL ? "mr-[20px]" : "ml-[20px]"}`}
              />
            </Link>
          </div>

          <div
            className={`${isRTL ? "mr-auto" : "ml-auto"
              } text-[16px] leading-[24px] flex flex-row items-center gap-1 md:gap-2`}
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
            {!userState.value?.id ? (
              <>
                <Button
                  variant="light"
                  className="btn bg-white! text-[16px] leading-[24px] text-[#232323]! md:w-[110px] w-[80px] h-[44px] rounded-[8px] px-[20px] py-[10px]"
                  size="sm"
                  onPress={() => (loginOpenedState.value = true)}
                >
                  {t("login")}
                </Button>
                <Button
                  variant="light"
                  className="btn text-[16px] leading-[24px] md:w-[110px] w-[80px] h-[44px] bg-[#339933]! px-[20px] py-[10px] text-white rounded-[8px]"
                  size="sm"
                  onPress={() => (registerOpenedState.value = true)}
                >
                  {t("register")}
                </Button>
              </>
            ) : (
              <div className="flex flex-row justify-center items-center gap-2">
                <WalletBox />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
