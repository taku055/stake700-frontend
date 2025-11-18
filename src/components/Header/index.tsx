import { userState } from "@/state/userState";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, OFFICIAL_LINKS } from "@/config/constants";
import { Button } from "@heroui/react";
import { loginOpenedState } from "@/state/loginOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";
import SearchWidget from "./SearchWidget";
import WalletBox from "./WalletBox";
import { useTranslations } from "@/context/I18nContext";
import {
  BellRing,
  Headset,
  HeartIcon,
  NotepadText,
  Settings,
  XIcon,
} from "lucide-preact";
import { FaTelegramPlane } from "react-icons/fa";
import { maintenanceState } from "@/state/maintenanceState";
import { useEffect, useState } from "preact/hooks";
import LocaleSelection from "../LocaleSelection";
import { moreModalState } from "@/state/moreModalState";
import MoreToolDialog from "../MoreToolDialog";

import ToolDropDown from "../ToolDropDown";
import { HeaderPhoneVideo } from "./HeaderPhoneVideo";
import { useTablist } from "@/hooks/useTablist";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { navigationSidebarOpenState } from "@/state/navigationSidebarState";
import { Menu } from "lucide-preact";

export default function Header() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("Header");
  const [alertVisible, setAlertVisible] = useState(!!maintenanceState.value);
  const [time, setTime] = useState(new Date());
  const { tabList, selectedKey } = useTablist();
  const { modifyHref } = useAffiliateNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full">
      <div className="flex flex-col items-center w-full px-2 py-1">
        {alertVisible && (
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
        )}
        <div className="flex flex-row items-center justify-between w-full py-2 gap-1 overflow-auto">
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={() => {
                navigationSidebarOpenState.value = !navigationSidebarOpenState.value;
              }}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-700 transition-colors text-white md:hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} />
            </button>
            <a href={modifyHref("/")}>
              <img
                src={`https://tekio.s3.eu-north-1.amazonaws.com/${(
                  import.meta.env.VITE_SITE_NAME as string
                ).toLowerCase()}/logo.png`}
                className="h-[24px] md:h-[36px] object-contain md:max-w-[200px]"
                alt={import.meta.env.VITE_SITE_NAME as string}
              />
            </a>
            <a
              className="bg-[var(--blue-color)] text-white rounded-full p-[5px]"
              href={OFFICIAL_LINKS.telegram}
              target="_blank"
            >
              <FaTelegramPlane color="white" size={isMobile ? 16 : 24} />
            </a>
          </div>
          {/* <div className="ml-auto hidden md:block!">
            <HeaderPhoneVideo />
          </div> */}
          <div className="ml-auto flex flex-row items-center gap-1 md:gap-2">
            {!userState.value?.id ? (
              <>
                <Button
                  variant="light"
                  className="text-white rounded-sm min-w-[unset]"
                  size="sm"
                  onPress={() => (loginOpenedState.value = true)}
                >
                  {t("login")}
                </Button>
                <Button
                  className="bg-[var(--pink-color)] text-white rounded-sm"
                  size="sm"
                  onPress={() => (registerOpenedState.value = true)}
                >
                  {t("register")}
                </Button>
              </>
            ) : (
              <WalletBox />
            )}
            <div className="hidden md:block!">
              {!userState.value?.isAgent && <LocaleSelection />}
            </div>
            {!userState.value?.isAgent && <SearchWidget />}
            <div className="text-white bg-[var(--bar-background-color)] rounded-sm py-1 px-2 hidden md:block!">
              {time.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <ToolDropDown
              items={[
                {
                  label: "Notification",
                  id: "notification",
                  icon: <BellRing color="#ddd" size={20} />,
                },
                {
                  label: "Favorite",
                  id: "favorite",
                  icon: <HeartIcon color="#ddd" size={20} />,
                },
                {
                  label: "Setting",
                  id: "setting",
                  icon: <Settings color="#ddd" size={20} />,
                },
                {
                  label: "Live-Support",
                  id: "live-support",
                  icon: <Headset color="#ddd" size={20} />,
                },
                {
                  label: "Bet",
                  id: "bet",
                  icon: <NotepadText color="#ddd" size={20} />,
                },
              ]}
            />
          </div>
        </div>

        <div className="w-full md:hidden">
          <HeaderPhoneVideo />
        </div>

        <div className="flex flex-row w-full gap-3 rounded-sm bg-[var(--bar-background-color)] overflow-x-auto">
          {tabList.map((i) => (
            <a
              href={modifyHref(i.href)}
              key={i.key}
              className={`text-[14px] flex flex-row min-w-fit items-center gap-2 px-3 py-1 ${
                selectedKey === i.key
                  ? `bg-[var(--pink-color)]`
                  : "text-gray-200"
              }`}
            >
              {i.icon} <span className="whitespace-nowrap">{i.title}</span>
            </a>
          ))}
        </div>

        <MoreToolDialog
          isOpen={moreModalState.value}
          onClose={() => (moreModalState.value = false)}
        />
      </div>
    </header>
  );
}
