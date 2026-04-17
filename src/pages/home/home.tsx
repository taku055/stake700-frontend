import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";
import { EmblaBanner } from "@/components/EmblaBanner/EmblaBanner";
import PromotionsGroup from "@/components/PromotionsGroup";
import EmulateBetting from "@/components/EmulateBetting";
import FAQ from "@/pages/faq";
import VipCard from "@/components/Vip-club/VipCard";
import { useMediaQuery } from "usehooks-ts";
import { ASSET_BASE_URL, mobileMediaQuery } from "@/config/constants";
import SearchWidget from "@/components/Header/SearchWidget";
import GameGroup from "@/components/GameGroup";
import { sportsState } from "@/state/sportsState";

export default function PageComponent() {
  const location = useLocation();
  if (userState.value?.role === "SUPERAGENT") {
    location.route("/superagent");
    return null;
  }

  if (userState.value?.role === "AREA_MANAGER") {
    location.route("/area_manager");
    return null;
  }

  if (userState.value?.role === "AGENT") {
    location.route("/agent");
    return null;
  }

  location.route("/casino/home");

  const isMobile = useMediaQuery(mobileMediaQuery);

  return (
    <div className="flex flex-col z-0 items-center justify-center w-full font-weight-300 gap-6 p-2">
      <div className="flex flex-col">
        {isMobile && userState.value?.id && <VipCard />}
        <EmblaBanner />
      </div>

      <div className="flex flex-col max-w-[1200px] w-full gap-6">
        <SearchWidget />
        <GameGroup
          title="Trending Games"
          category="trending"
          isCustom={true}
          icon={`${ASSET_BASE_URL}/images/icons/trending-game.png`}
        />
        <GameGroup
          title="Trending Sports"
          category="trending"
          isCustom={true}
          gameList={sportsState.value}
          icon={`${ASSET_BASE_URL}/images/icons/sportsbook.png`}
        />
        <PromotionsGroup />
        <EmulateBetting />
        <FAQ />
      </div>
    </div>
  );
}
