import { Router, Route, useLocation } from "preact-iso";
import Overview from "./overview";
import Referral from "./referral";
import Earning from "./earning";
import NotFound404 from "../not-found";
import { useTranslations } from "@/context/I18nContext";
import { useMemo } from "preact/hooks";
import { userState } from "@/state/userState";

function AffiliateNavbar() {
  const location = useLocation();
  const { route } = location;
  const t = useTranslations("Affiliate");

  const navItems = [
    { name: "Overview", path: "/affiliates" },
    { name: "Referrals", path: "/affiliates/referral" },
    { name: "Earnings", path: "/affiliates/earning" },
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
    <div className="bg-[var(--header-background)] w-full sticky top-0 z-50 overflow-x-auto">
      <div className="flex flex-row items-center justify-center gap-5 w-full">
        {navItems.map((item) => (
          <a
            key={item.path}
            className={`cursor-pointer py-2 px-2 select-none min-w-fit whitespace-nowrap ${
              selectedNavItem?.name === item.name
                ? "border-b-1 border-[var(--pink-color)]"
                : "text-[var(--text-transparent-color)]"
            }`}
            onClick={() => route(item.path, true)}
          >
            {t(item.name)}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function AffiliatesLayout() {
  if (
    !userState.value?.id ||
    userState.value?.isAgent ||
    !userState.value?.isCallGroup
  ) {
    return <NotFound404 />;
  }

  return (
    <div className="flex flex-col">
      <AffiliateNavbar />
      <Router>
        <Route path="/" component={Overview} />
        <Route path="/referral" component={Referral} />
        <Route path="/earning" component={Earning} />
        <Route path="*" component={NotFound404} />
      </Router>
    </div>
  );
}
