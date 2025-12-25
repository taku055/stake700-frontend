import { Router, Route, useLocation } from "preact-iso";
import Overview from "./overview";
import Implementation from "./implementation";
import Conversions from "./conversions";
import GameEvents from "./game-events";
import UnhashServerSeed from "./unhash-server-seed";
import Calculation from "./calculation";
import NotFound404 from "../not-found";
import { useTranslations } from "@/context/I18nContext";
import { useMemo } from "preact/hooks";
import { Check } from "lucide-preact";

function ProvablyFairSidebar() {
  const location = useLocation();
  const { route } = location;
  const t = useTranslations("ProvablyFair");

  const navItems = [
    { name: "Overview", path: "/provably-fair" },
    { name: "Implementation", path: "/provably-fair/implementation" },
    { name: "Conversions", path: "/provably-fair/conversions" },
    { name: "Game Events", path: "/provably-fair/game-events" },
    { name: "Unhash Server Seed", path: "/provably-fair/unhash-server-seed" },
    { name: "Calculation", path: "/provably-fair/calculation" },
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
    <div className="w-[187px] min-w-[180px] h-full bg-[var(--background-secondary)] flex flex-col flex-1">
      {/* Navigation Items */}
      <div className="flex flex-col py-2">
        {navItems.map((item) => {
          const isSelected = selectedNavItem?.name === item.name;
          return (
            <a
              key={item.path}
              className={`flex items-center px-6 py-3 cursor-pointer transition-colors ${isSelected
                ? "bg-[var(--background)] border-l-2 border-[var(--green-color)] text-white font-medium"
                : "text-white hover:bg-[var(--background)]/50"
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

export default function ProvablyFairLayout() {
  const t = useTranslations("ProvablyFair");
  const location = useLocation();

  return (
    <div className="flex flex-col w-[1200px] mx-auto min-h-screen">
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[#FFFFFF0A] py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/icons/others/check.png" alt="Provably Fair" className="w-6 h-6" />
          <h1 className="text-white text-[24px] font-semibold">{t("Provably Fair")}</h1>
        </div>
        <button
          onClick={() => location.route("/")}
          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background-secondary)] rounded transition-colors"
          aria-label="Close"
        >
          <span className="text-white text-[24px] leading-none">×</span>
        </button>
      </div>
      <div className="flex flex-row w-full min-h-screen gap-6 justify-between">
        <ProvablyFairSidebar />
        <div className="w-[990px] overflow-y-auto relative bg-[var(--background-secondary)]">
          {/* Header with Title and Close Button */}

          <Router>
            <Route path="/" component={Overview} />
            <Route path="/implementation" component={Implementation} />
            <Route path="/conversions" component={Conversions} />
            <Route path="/game-events" component={GameEvents} />
            <Route path="/unhash-server-seed" component={UnhashServerSeed} />
            <Route path="/calculation" component={Calculation} />
            <Route path="*" component={NotFound404} />
          </Router>
        </div>
      </div>
    </div>
  );
}

