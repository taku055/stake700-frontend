import CasinoDetailPage from "./CasinoDetailPage";
import { FunctionalComponent } from "preact";
import { CATEGORY_DATA, tPageType } from "./data";
import { useMemo } from "preact/hooks";
import { PromotionSection } from "./PromotionSection";
import { CasinoSecondNavbar } from "./CasinoSecondNavbar";
import { useLocation } from "preact-iso";
import Sportsbook from "@/components/Sportsbook";
import queryString from "query-string";
import lodash from "lodash";

interface ICasinoPageProps {
  pageType: tPageType;
}

const CasinoPage: FunctionalComponent<ICasinoPageProps> = ({ pageType }) => {
  const location = useLocation();

  const selectedNavItem = useMemo(() => {
    return [...CATEGORY_DATA[pageType].navItems].reverse().find((item) => {
      const itemQuery = queryString.parse(item.path.split("?")[1]);
      return location.url.startsWith(item.path.split("?")[0]) && lodash.isMatch(location.query, itemQuery);
    });
  }, [CATEGORY_DATA[pageType].navItems, location.url]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <PromotionSection
        showAppleImage={CATEGORY_DATA[pageType].showAppleImage}
      />
      <CasinoSecondNavbar categoryList={selectedNavItem?.subItems || []} />

      {selectedNavItem?.isSportsBook ? (
        <Sportsbook
          sportsBookPath={
            queryString.parse(selectedNavItem.path.split("?")[1])
              .sportsBookPath as string
          }
        />
      ) : (
        <CasinoDetailPage pageType={pageType} />
      )}
    </div>
  );
};

export default CasinoPage;
