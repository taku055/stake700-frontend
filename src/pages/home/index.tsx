import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";
import { PromotionSection } from "../casino/PromotionSection";
import { WinnersTabGroup } from "./components/WinnersTabGroup";
import { BetPromotionCard } from "./components/BetPromotionCard";
import { PromotionInfoCard } from "./components/PromotionInfoCard";
import { getBetPromotionCards, getPromotionInfoCards } from "./data";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { Button } from "@heroui/react";
import { EmblaBanner } from "./components/EmblaBanner";
import { Search } from "lucide-preact";
import { Input } from "@/components/common";
import { useState } from "preact/hooks";
import TrendingGamesPanel from "@/components/TrendingGamesPanel";
import TrendingSports from "@/components/TrendingSports";
import PromotionsGroup from "@/components/PromotionsGroup";
import EmulateBetting from "@/components/EmulateBetting";
import FAQ from "@/pages/faq";

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

  const t = useTranslations("HomePage");
  const { handleNavigate } = useAffiliateNavigation();

  const betPromotionCards = getBetPromotionCards(t);
  const promotionInfoCards = getPromotionInfoCards(t);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <EmblaBanner />
      <div className="flex flex-col w-[1200px]">
        <div className="flex w-full gap-2 h-[52px]">
          <div className="flex w-full border-[2px] border-[var(--background-tertiary)] rounded-[8px]">
            <div className="flex items-center justify-center border-r-[2px] border-[var(--background-tertiary)] min-w-[108px]">
              Casino
            </div>
            <div className="flex items-center justify-center p-2">
              <Search size={16} className="w-[20px] h-[20px]" />
            </div>
            <Input
              label={"Search"}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-[var(--background)] border-none rounded-sm!",
                input: "text-white text-[14px]",
                label: "text-[#FFFFFF]",
              }}
            />
          </div>
        </div>
        <TrendingGamesPanel />
        <TrendingSports />
        <PromotionsGroup />
        <EmulateBetting />
        <FAQ />
      </div>
      <div className="fixed bottom-1 right-4 w-[60px] h-[44px] rounded-full flex justify-center items-center">
        <Button className="w-full h-full rounded-full flex justify-center items-center bg-[#0F212E]" variant="light" size="sm">
          <img src="/images/icons/icons/live-support.svg" alt="Chat" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
