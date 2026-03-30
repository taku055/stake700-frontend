import { userState } from "@/state/userState";
import { useMediaQuery } from "usehooks-ts";
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

export default function Header() {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("Header");
  const { modifyHref } = useAffiliateNavigation();

  return (
    <header className="relative z-[200] bg-[var(--background)] w-full mx-auto h-[60px] flex items-center justify-center ">
      <div className="flex flex-col items-center px-2 py-1 max-w-[1200px] w-full mx-auto">
        <div className="flex flex-row items-center justify-between w-full h-[60px] gap-1">
          <div className="flex flex-row items-center gap-2">
            <a href={modifyHref("/")}>
              {isMobile ? (
                <img
                  src={`${ASSET_BASE_URL}/logo-mini.png`}
                  alt="Logo"
                  className="h-[36px] object-contain max-w-[200px]"
                />
              ) : (
                <img
                  src={`${ASSET_BASE_URL}/images/icons/logo.svg`}
                  alt="Logo"
                  className="h-[36px] object-contain max-w-[200px]"
                />
              )}
            </a>
          </div>

          <div
            className={`${
              isRTL ? "mr-auto" : "ml-auto"
            } text-[16px] leading-[24px] flex flex-row items-center gap-1 md:gap-2`}
          >
            <div className="flex flex-row items-center gap-2 w-[60px]">
              <LocaleSelection headerMode={true} />
            </div>
            {userState.value?.id && (
              <div className="flex flex-row justify-center items-center gap-2">
                <WalletBox />
              </div>
            )}
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
              <div className="flex flex-row items-center">
                <div>
                  <button
                    type="button"
                    className="flex md:w-[44px] md:h-[44px] w-[32px] h-[32px] items-center justify-center"
                    onClick={() =>
                      (searchWidgetStateHeader.value =
                        !searchWidgetStateHeader.value)
                    }
                  >
                    <img
                      src={`${ASSET_BASE_URL}/images/icons/search.svg`}
                      alt={t("Search")}
                      className="w-[20px] h-[20px]"
                    />
                  </button>
                  <SearchWidgetHeader />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
