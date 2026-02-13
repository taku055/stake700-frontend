import { Router, Route, useLocation } from "preact-iso";
import NotFound404 from "../not-found";
import { tPageType } from "./data";
import { userState } from "@/state/userState";
import { EmblaBanner } from "@/components/EmblaBanner/EmblaBanner";
import CasinoPageComponent from "./CasinoPageComponent";

const ALLOWED = new Set(["search", "live-casino", "slots"]);

export default function CasinoLayout(props: { pageType: tPageType }) {
  if (!ALLOWED.has(props.pageType)) {
    return <NotFound404 />;
  }

  const location = useLocation();
  if (userState.value?.role === "SUPERAGENT") {
    location.route("/superagent");
    return null;
  } else if (userState.value?.role === "AREA_MANAGER") {
    location.route("/area_manager");
    return null;
  } else if (userState.value?.role === "AGENT") {
    location.route("/agent");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <EmblaBanner />
      <div className="max-w-[1200px] w-full">
        <Router>
          <Route path="/" component={CasinoPageComponent} pageType={props.pageType} />
          <Route path="/*" component={CasinoPageComponent} pageType={props.pageType} />
          <Route path="*" component={NotFound404} />
        </Router>
      </div>
    </div>
  );
}
