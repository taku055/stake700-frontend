import { userState } from "@/state/userState";
import { useMediaQuery } from "usehooks-ts";
import { BASE_URL, mobileMediaQuery, OFFICIAL_LINKS, RTL_LANGUAGES } from "@/config/constants";
import { Button } from "@heroui/react";
import { loginOpenedState } from "@/state/loginOpenedState";
import { registerOpenedState, signupStep1OpenedState, welcomeDialogOpenedState } from "@/state/registerOpenedState";
import { depositDialogOpenedState, walletDialogOpenedState } from "@/state/walletDialogState";
import WalletBox from "./WalletBox";
// import WalletBox from "@/components/WalletBox";
import ProfileButton from "./ProfileButton";
import { useTranslations } from "@/context/I18nContext";
import {
  XIcon,
} from "lucide-preact";
import { localeState } from "@/state/localeState";
import { maintenanceState } from "@/state/maintenanceState";
import { useEffect, useState } from "preact/hooks";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { navigationSidebarOpenState } from "@/state/navigationSidebarState";
import { Menu } from "lucide-preact";
import SearchWidget, { SearchWidgetHeader } from "./SearchWidget";
import { setAxiosAuthToken } from "@/api/instance";
import { accessTokenState } from "@/state/accessTokenState";
import { useLocation } from "preact-iso";
import axios from "axios";
import { useCallback } from "preact/hooks";
import ProfileMenu from "../ProfileMenu";
import { profileMenuOpenedState } from "@/state/profilemenuState";
import { chatExpandedState } from "@/state/chatExpandedState";
import { searchWidgetState as searchWidgetStateHeader } from "@/state/searchWidgetState";

export default function Header() {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("Header");
  const [alertVisible, setAlertVisible] = useState(!!maintenanceState.value);
  const [time, setTime] = useState(new Date());
  const { modifyHref } = useAffiliateNavigation();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onLogout = useCallback(async () => {
    try {
      userState.value = null;
      setAxiosAuthToken("");
      accessTokenState.value = null;

      if (location.path.includes("agent")) {
        location.route("/");
      }
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.error(ex.message);
      }
    }
  }, [userState, setAxiosAuthToken, accessTokenState]);

  return (
    <header className="z-1000 bg-[var(--background)] w-full mx-auto h-[60px] flex items-center justify-center ">
      <div className="flex flex-col items-center px-2 py-1 max-w-[1200px] w-full mx-auto">

        <div className="flex flex-row items-center justify-between w-full h-[60px] gap-1 overflow-hidden">
          <div className="flex flex-row items-center gap-2">

            <a href={modifyHref("/")}>
              {isMobile ? <img src={`${BASE_URL}/logo-mini.png`} alt="Logo" className="h-[36px] object-contain max-w-[200px]" /> : <img src={`${BASE_URL}/images/icons/logo.svg`} alt="Logo" className="h-[36px] object-contain max-w-[200px]" />}
            </a>
          </div>
          {/* <div className="ml-auto hidden md:block!">
            <HeaderPhoneVideo />
          </div> */}
          {userState.value?.id && (
            <div className="flex flex-row w-full justify-center items-center gap-2">
              <WalletBox />
            </div>
          )}
          <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-[16px] leading-[24px] flex flex-row items-center gap-1 md:gap-2`}>
            {!userState.value?.id ? (
              <>
                <Button
                  variant="light"
                  className="btn text-[16px] leading-[24px]"
                  size="sm"
                  style={{ background: '#ffffff', fontSize: '16px', leading: '24px', color: '#232323', width: '80px', height: '44px', borderRadius: '8px', padding: '10px 20px' }}
                  onPress={() => (loginOpenedState.value = true)}
                >
                  {t("login")}
                </Button>
                <Button
                  className="btn text-[16px] leading-[24px]"
                  size="sm"
                  style={{ background: '#01A825', fontSize: '16px', leading: '24px', color: '#ffffff', width: '100px', height: '44px', borderRadius: '8px', padding: '10px 20px' }}
                  onPress={() => (
                    signupStep1OpenedState.value = true
                    // welcomeDialogOpenedState.value = true
                  )}
                // onPress={() => (welcomeDialogOpenedState.value = true)}
                >
                  {t("register")}
                </Button>
                {/* <Button
                  className="btn"
                  size="sm"
                  style={{ background: '#01A825', color: '#ffffff', width: '100px', height: '44px', borderRadius: '8px', padding: '10px 20px' }}
                  onPress={() => (walletDialogOpenedState.value = true)}
                // onPress={() => (welcomeDialogOpenedState.value = true)}
                >
                  {t("walletDialog")}
                </Button> */}
              </>
            ) : (
              <>

                <div className="flex flex-row items-center">
                  {/* <SearchWidget /> */}
                  {/* <SearchWidgetHeader /> */}
                  <div className="relative">
                    <button
                      type="button"
                      className="flex w-[44px] h-[44px] items-center justify-center"
                      onClick={() => (searchWidgetStateHeader.value = !searchWidgetStateHeader.value)}
                    >
                      <img src={`${BASE_URL}/images/icons/search.svg`} alt={t("Search")} className="w-[20px] h-[20px]" />
                    </button>
                  </div>
                  <div className="relative">
                    <ProfileButton />
                    <ProfileMenu />
                  </div>
                  {/* <button
                    className="flex items-center justify-center w-[44px] h-[44px]"
                    onClick={() => {
                      // console.log("ring");
                    }}
                  >
                    <img src={`${BASE_URL}/images/icons/ring.svg`} alt={t("ring")} className="w-[20px] h-[20px]" />
                  </button>

                  {!isMobile && <button
                    className="flex items-center justify-center w-[44px] h-[44px]"
                    // onClick={() => (chatExpandedState.value = !chatExpandedState.value)}
                  // onPress={() => (welcomeDialogOpenedState.value = true)}
                  >
                    <img src={`${BASE_URL}/images/icons/log-out.svg`} alt={t("logout")} className="w-[20px] h-[20px]" />
                  </button> */}
                  {/* } */}
                </div>
                {/* <Button
                  className="btn"
                  size="sm"
                  style={{background: '#01A825', color: '#ffffff', width: '100px', height: '44px', borderRadius: '8px', padding: '10px 20px' }}
                  onPress={() => (walletDialogOpenedState.value = true)}
                  // onPress={() => (welcomeDialogOpenedState.value = true)}
                >
                  {t("walletDialog")}
                </Button> */}
              </>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
