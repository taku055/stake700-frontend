import { FunctionalComponent } from "preact";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";
import lodash from "lodash";
import queryString from "query-string";
import { tCategorySubItem } from "./data";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { Link } from "@/components/common";

interface ICasinoSecondNavbarProps {
  categoryList: tCategorySubItem[];
}

export const CasinoSecondNavbar: FunctionalComponent<
  ICasinoSecondNavbarProps
> = ({ categoryList }) => {
  const pathname = useLocation();

  const isActive = useMemo(() => {
    const res: boolean[] = [true];
    for (let i = 1; i < categoryList.length; i++) {
      const obj1 = queryString.parse(categoryList[i].path.split("?")[1]);
      const isActive = lodash.isEqual(obj1, pathname.query);
      res.push(isActive);
      if (isActive) {
        res[0] = false;
      }
    }

    return res;
  }, [pathname.query, categoryList]);

  if (categoryList.length === 0) {
    return null;
  }

  return (
    <div className="w-full sticky top-10 z-50 bg-[var(--background)]">
      <div className="flex flex-row bg-[var(--bar-background-color)] px-3 rounded-xl gap-5 text-[12px] overflow-x-auto">
        {categoryList.map((category, index) => {
          return (
            <Link
              className={`flex flex-row min-w-fit items-center cursor-pointer select-none text-[16px] text-[var(--text-transparent-color)] py-3 px-5 gap-2 ${isActive[index]
                ? "border-b border-[var(--pink-color)]"
                : "border-b border-[var(--text-transparent-color)]"
                }`}
              key={category.path}
              href={category.path}
            >
              {category.icon && (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-[32px] h-[32px]"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="whitespace-nowrap">{category.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
