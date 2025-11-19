import { Router, Route } from "preact-iso";
import CasinoPage from "./CasinoPage";
import NotFound404 from "../not-found";
import { useMemo } from "preact/hooks";
import { CATEGORY_DATA, tPageType } from "./data";

const ALLOWED = new Set([
  "slots",
  "live-casino",
  "games",
  "virtual-sports",
  "jackpot",
  "tv-games",
  "live-racing",
]);

export default function CasinoLayout(props: { pageType: tPageType }) {
  if (!ALLOWED.has(props.pageType)) {
    return <NotFound404 />;
  }

  const category = useMemo(
    () => CATEGORY_DATA[props.pageType],
    [props.pageType]
  );

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <div className="h-full w-full">
        <Router>
          <Route path="/" component={CasinoPage} pageType={props.pageType} />
          <Route path="/*" component={CasinoPage} pageType={props.pageType} />
          <Route path="*" component={NotFound404} />
        </Router>
      </div>
    </div>
  );
}
