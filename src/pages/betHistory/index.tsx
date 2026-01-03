import { Router, Route, useLocation } from "preact-iso";
import Overview from "./casino";
import NotFound404 from "../not-found";
import { t, useTranslations } from "@/context/I18nContext";
import { useMemo } from "preact/hooks";
import { userState } from "@/state/userState";
import { Archive, Users } from "lucide-preact";
import { BASE_URL, mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import CasinoHistoryPage from "./casino";
import SportsHistoryPage from "./sports";



function HistorySidebar() {
  const location = useLocation();
  const { route } = location;
  const t = useTranslations("BetHistory");

  const navItems = [
    { name: "Casino", path: "/my-bets/casino" },
    { name: "Sports", path: "/my-bets/" },
    // { name: "Archive", path: "/my-bets/archive" },
  ];

  const selectedNavItem = useMemo(() => {
    const currentPath = location.path;
    return [...navItems]
      .reverse()
      .find(
        (item) =>
          currentPath === item.path || currentPath.startsWith(item.path + "/")
      );
  }, [navItems, location.path]);

  return (
    <div className="w-[180px] min-w-[180px] h-full bg-[var(--background-secondary)] flex flex-col rounded-lg">
      {/* Navigation Items */}
      <div className="flex flex-col py-2">
        {navItems.map((item) => {
          const isSelected = selectedNavItem?.name === item.name;
          return (
            <a
              key={item.path}
              className={`flex items-center px-6 py-3 cursor-pointer transition-colors ${isSelected
                ? "bg-[var(--background)] text-white font-medium border-l-2 border-[var(--green-color)]"
                : "text-white/60 hover:text-white/80 hover:bg-[var(--background)]"
                }`}
              onClick={() => route(item.path, true)}
            >
              {t(item.name)}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function MyBetsLayout() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  if (
    !userState.value?.id ||
    userState.value?.isAgent
    // !userState.value?.isCallGroup
  ) {
    return <NotFound404 />;
  }

  return (
    <>
      <div className="max-w-[1200px] mx-auto flex flex-col p-2 md:px-0 gap-6">
        {/* Header */}
        <div className="flex w-full items-center gap-3 pt-[24px]">
          <img src={`/images/icons/icons/my-bet.png`} alt="My Bets" className="w-5 h-5 text-white brightness-0 invert" />
          <span className="text-white text-[24px] leading-[36px] font-semibold">{t("My Bets")}</span>
        </div >
        <div className="flex flex-row min-h-screen gap-6">
          {isMobile ? (<></>) : (<HistorySidebar />)}
          <div className="flex-1 overflow-y-auto bg-[var(--background-secondary)] rounded-lg">
            <Router>
              <Route path="/casino" component={CasinoHistoryPage} />
              <Route path="/sports" component={SportsHistoryPage} />
              {/* <Route path="/my-bets/archive" component={ArchivePage} /> */}
              <Route path="*" component={NotFound404} />
            </Router>
          </div>
        </div>
      </div>
    </>
  );
} 