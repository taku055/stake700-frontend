import { useMediaQuery } from "usehooks-ts";
import { ASSET_BASE_URL, mobileMediaQuery } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import { useEffect, useMemo, useState } from "preact/hooks";
import { Home, ChartArea, Crown, Users, Menu } from "lucide-preact";

import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";
import {
  navigationSidebarExpandedState,
} from "@/state/navigationSidebarState";

export default function FooterNav() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const pathname = useLocation();
  const t = useTranslations("Header");
  const [isMenuOpen, setIsMenuOpen] = useState(
    navigationSidebarExpandedState.value
  );

  // Sync with signal state
  useEffect(() => {
    const unsubscribe = navigationSidebarExpandedState.subscribe((value) => {
      setIsMenuOpen(value);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const tabList = useMemo(() => {
    if (!userState.value?.isAgent) {
      return [
        {
          title: t("Home"),
          href: "/",
          key: "home",
          icon: <Home width={20} height={20} />,
        },
        {
          title: t("Casino"),
          href: "/?page=lobby-casino",
          key: "casino",
          icon: (
            <img
              src={`${ASSET_BASE_URL}/images/icons/casino.png`}
              width={20}
              height={20}
            />
          ),
        },
        {
          title: t("Live Casino"),
          href: "/?page=lobby-live-casino",
          key: "live-casino",
          icon: (
            <img
              src={`${ASSET_BASE_URL}/images/icons/live-casino.svg`}
              width={20}
              height={20}
            />
          ),
        },
      ];
    } else {
      if (userState.value?.isSuperAgent) {
        return [
          {
            title: t("Dashboard"),
            href: "/superagent",
            key: "superagent",
            icon: <Crown className="w-[24px] h-[24px]" />,
          },
        ];
      } else {
        return [
          {
            title: t("Dashboard"),
            href: "/agent",
            key: "agent",
            icon: <ChartArea className="w-[24px] h-[24px]" />,
          },
          {
            title: t("Users"),
            href: "/agent/users",
            key: "users",
            icon: <Users className="w-[24px] h-[24px]" />,
          },
        ];
      }
    }
  }, [userState.value, t]);

  useEffect(() => { }, [userState.value, tabList]);

  const selectedKey = useMemo(() => {
    // if you use i18n like /en/..., strip the locale prefix here if needed
    const current = tabList.find(
      (t) =>
        // startsWith is safer when routes have deeper paths
        pathname.path === t.href
    );
    return current?.key ?? tabList[0].key ?? "home";
  }, [pathname.path, tabList]);

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[var(--bar-background-color)] border-t border-gray-800 z-6000 overflow-x-auto">
      <div className="flex justify-around items-center h-[57px]">
        {tabList.map((tab) => (
          <a
            key={tab.key}
            href={tab.href}
            onClick={(e) => {
              e.preventDefault();
              navigationSidebarExpandedState.value = false;
            }}
            className={`flex flex-col items-center justify-center py-2 gap-1 h-full min-w-0 ${selectedKey === tab.key
              ? "text-[var(--primary-color)] border-t-2 border-[var(--primary-color)]"
              : "text-white"
              } bg-transparent`}
          >
            <span className="text-sm my-auto h-full flex flex-col justify-center items-center">
              {tab.icon}
            </span>
            <span className="text-xs mt-auto">{tab.title}</span>
          </a>
        ))}
        <a
          key="more"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigationSidebarExpandedState.value =
              !navigationSidebarExpandedState.value;
          }}
          className={`flex flex-col items-center justify-between py-2 min-w-0 h-full ${isMenuOpen ? "text-[var(--primary-color)]" : "text-white"
            } bg-transparent`}
        >
          <span
            className={`text-sm h-full flex flex-1 flex-col justify-center items-center bg-transparent`}
          >
            <Menu aria-hidden="true" className="w-[20px] h-[20px]" />
          </span>
          <span className="text-xs">{t("Menu")}</span>
        </a>
      </div>
    </footer>
  );
}
