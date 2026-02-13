import { Router, Route, useLocation } from "preact-iso";
import Overview from "./overview";
import Campaigns from "./campaigns";
import Commission from "./commission";
import ReferredUsers from "./referred-users";
import FAQ from "./faq";
import NotFound404 from "../not-found";
import { t, useTranslations } from "@/context/I18nContext";
import { useMemo } from "preact/hooks";
import { userState } from "@/state/userState";
import { Users } from "lucide-preact";
import { ASSET_BASE_URL, mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";

function AffiliateTabSelector() {
  
}

function AffiliateSidebar() {
  const location = useLocation();
  const { route } = location;
  const t = useTranslations("Affiliate");

  const navItems = [
    { name: "Overview", path: "/affiliate" },
    { name: "Campaigns", path: "/affiliate/campaigns" },
    { name: "Commission", path: "/affiliate/commission" },
    { name: "Referred Users", path: "/affiliate/referred-users" },
    { name: "FAQ", path: "/affiliate/faq" },
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

  if (
    !userState.value?.id ||
    userState.value?.isAgent
    // !userState.value?.isCallGroup
  ) {
    return (
      <div className="w-[180px] min-w-[180px] h-full bg-[var(--background-secondary)] flex flex-col rounded-lg">
      {/* Navigation Items */}
      <div className="flex flex-col py-2">
            <a
              key={"overview"}
              className={`flex items-center px-6 py-3 cursor-pointer transition-colors bg-[var(--background)] text-white font-medium border-l-2 border-[var(--green-color)]`}
              onClick={() => route("/affiliate", true)}
            >
              {t("Overview")}
            </a>
      </div>
    </div>
    );
  }

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
                : "text-white/60 hover:text-white/80 hover:bg-[var(--background)]/50"
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

export default function AffiliatesLayout() {
  const isMobile = useMediaQuery(mobileMediaQuery);
 

  return (
    <>
      <div className="max-w-[1200px] mx-auto flex flex-col p-2 md:px-0 gap-6">
        {/* Header */}
        <div className="flex w-full items-center gap-3 pt-[24px]">
          <img src={`${ASSET_BASE_URL}/images/icons/affiliate.svg`} alt="affiliate" className="w-5 h-5 text-white" />
          <span className="text-white text-[24px] leading-[36px] font-semibold">{t("Affiliate Program")}</span>
        </div >
        <div className="flex flex-row min-h-screen gap-6">
          {isMobile ?(<></>) : (<AffiliateSidebar />)}
          <div className="flex-1 overflow-y-auto bg-[var(--background-secondary)] rounded-lg">
            <Router>
              <Route path="/" component={Overview} />
              <Route path="/campaigns" component={Campaigns} />
              <Route path="/commission" component={Commission} />
              <Route path="/referred-users" component={ReferredUsers} />
              <Route path="/faq" component={FAQ} />
              <Route path="*" component={NotFound404} />
            </Router>
          </div>                    
        </div>
      </div>
    </>
  );
} 