import { useTranslations } from "@/context/I18nContext";
import { ComponentChildren, FunctionalComponent } from "preact";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import lodash from "lodash";
import queryString from "query-string";

interface ICasinoNavbarProps {
  navItems: {
    name: string;
    path: string;
  }[];
}

export const CasinoNavbar: FunctionalComponent<ICasinoNavbarProps> = ({
  navItems,
}) => {
  const location = useLocation();
  const t = useTranslations("Header");
  const { handleNavigate } = useAffiliateNavigation();

  const selectedNavItem = useMemo(() => {
    return [...navItems].reverse().find((item) => {
      const itemQuery = queryString.parse(item.path.split("?")[1]);
      return location.url.startsWith(item.path.split("?")[0]) && lodash.isMatch(location.query, itemQuery);
    });
  }, [navItems, location.url]);

  return (
    <div className="bg-[var(--header-background)] w-full sticky top-0 z-50 overflow-x-auto">
      <div className="flex flex-row items-center justify-center gap-5 w-fit md:w-full">
        {navItems.map((path) => (
          <a
            key={path.path}
            className={`cursor-pointer py-2 px-2 select-none min-w-fit whitespace-nowrap ${
              selectedNavItem?.name === path.name
                ? "border-b-1 border-[var(--pink-color)]"
                : "text-[var(--text-transparent-color)]"
            }`}
            onClick={() => handleNavigate(path.path)}
          >
            {t(path.name)}
          </a>
        ))}
      </div>
    </div>
  );
};
