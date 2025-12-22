import { userState } from "@/state/userState";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, OFFICIAL_LINKS, RTL_LANGUAGES } from "@/config/constants";
import { Button } from "@heroui/react";
import { loginOpenedState } from "@/state/loginOpenedState";
import { registerOpenedState, signupStep1OpenedState, walletDialogOpenedState, welcomeDialogOpenedState } from "@/state/registerOpenedState";
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
import SearchWidget from "./SearchWidget";
import { setAxiosAuthToken } from "@/api/instance";
import { accessTokenState } from "@/state/accessTokenState";
import { useLocation } from "preact-iso";
import axios from "axios";
import { useCallback } from "preact/hooks";

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
    <header className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center w-full px-2 py-1 max-w-[1200px]">
        {/* {alertVisible && (
          <div className="flex flex-row items-center justify-center w-full p-5 border-t border-[var(--pink-color)] rounded-sm bg-[var(--bar-background-color)] relative">
            <div className="flex flex-row items-center gap-3 text-[12px] leading-[150%] text-[var()]">
              <span>{maintenanceState.value}</span>
            </div>
            <a
              className="absolute right-1 top-1"
              onClick={() => setAlertVisible(false)}
            >
              <XIcon color="white" size={16} />
            </a>
          </div>
        )} */}
        <div className="flex flex-row items-center justify-between w-full py-2 gap-1 overflow-auto">
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={() => {
                navigationSidebarOpenState.value = !navigationSidebarOpenState.value;
              }}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-700 transition-colors text-white md:hidden"
              aria-label={t("Toggle navigation menu")}
            >
              <Menu size={24} />
            </button>
            <a href={modifyHref("/")}>

              {/* <img
                src={`https://tekio.s3.eu-north-1.amazonaws.com/${(
                  import.meta.env.VITE_SITE_NAME as string
                ).toLowerCase()}/logo.png`}
                className="h-[24px] md:h-[36px] object-contain md:max-w-[200px]"
                alt={import.meta.env.VITE_SITE_NAME as string}
              /> */}
              {userState.value?.id ? (
                <img src="/images/icons/icons/logo-in.svg" alt="Logo" className="h-[24px] md:h-[36px] object-contain md:max-w-[200px]" />
              ) : (
                <img src="/images/icons/icons/logo.svg" alt="Logo" className="h-[24px] md:h-[36px] object-contain md:max-w-[200px]" />
              )}
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
          <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex flex-row items-center gap-1 md:gap-2`}>
            {!userState.value?.id ? (
              <>
                <Button
                  variant="light"
                  className="btn"
                  size="sm"
                  style={{ background: '#ffffff', color: '#232323', width: '80px', height: '44px', borderRadius: '8px', padding: '10px 20px' }}
                  onPress={() => (loginOpenedState.value = true)}
                >
                  {t("login")}
                </Button>
                <Button
                  className="btn"
                  size="sm"
                  style={{ background: '#01A825', color: '#ffffff', width: '100px', height: '44px', borderRadius: '8px', padding: '10px 20px' }}
                  onPress={() => (signupStep1OpenedState.value = true)}
                // onPress={() => (welcomeDialogOpenedState.value = true)}
                >
                  {t("register")}
                </Button>
                <Button
                  className="btn"
                  size="sm"
                  style={{ background: '#01A825', color: '#ffffff', width: '100px', height: '44px', borderRadius: '8px', padding: '10px 20px' }}
                  onPress={() => (walletDialogOpenedState.value = true)}
                // onPress={() => (welcomeDialogOpenedState.value = true)}
                >
                  {t("walletDialog")}
                </Button>
              </>
            ) : (
              <>

                <div className="flex flex-row items-center gap-2">
                  <SearchWidget />

                  <ProfileButton />

                  <button
                    className="flex items-center justify-center w-[44px] h-[44px]"
                    onClick={() => {
                      // console.log("ring");
                    }}
                  >
                    <img src="/images/icons/others/ring.svg" alt={t("ring")} className="w-[20px] h-[20px]" />
                  </button>

                  <button
                    className="flex items-center justify-center w-[44px] h-[44px]"
                    onClick={() => onLogout()}
                  // onPress={() => (welcomeDialogOpenedState.value = true)}
                  >
                    <img src="/images/icons/others/log-out.svg" alt={t("logout")} className="w-[20px] h-[20px]" />
                  </button>
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
