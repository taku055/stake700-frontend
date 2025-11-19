import GameGroup from "@/components/GameGroup";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";
import CategoryImageGroup from "./CategoryImageGroup";
import { PromotionSection } from "../casino/PromotionSection";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { useState } from "preact/hooks";
import GameFilterSidebar from "@/components/GameFilterSidebar";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";

export default function PageComponent() {
  const location = useLocation();
  if (userState.value?.isSuperAgent) {
    location.route("/superagent");
    return;
  }

  if (userState.value?.isAgent) {
    location.route("/agent");
    return;
  }

  const t = useTranslations("HomePage");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const isMobile = useMediaQuery(mobileMediaQuery);

  return (
    <div className="w-full flex flex-col gap-3">
      <PromotionSection showAppleImage={false} />

      <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 mt-[20px]`}>
        {/* Left Sidebar */}
        <GameFilterSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProviders={selectedProviders}
          onProvidersChange={setSelectedProviders}
        />

        {/* Right Side - Game Groups */}
        <div className="flex-1 flex flex-col gap-[20px] min-w-0">
          <GameGroup
            title={t("casino-games")}
            viewallLink="/casino/slots"
            category="home-casino-games"
            isCustom={true}
            template={1}
          />

          <GameGroup
            title={t("live-casino")}
            viewallLink="/casino/live-casino"
            category="home-live-casino"
            isCustom={true}
            template={1}
          />

          <GameGroup
            title={t("Hacksaw")}
            viewallLink="/casino/slots?custom=1&category=hacksaw"
            category="hacksaw"
            isCustom={true}
            template={1}
          />

          <GameGroup
            title={t("No Limit")}
            viewallLink="/casino/slots?custom=1&category=nolimit"
            category="nolimit"
            isCustom={true}
            template={1}
          />

          <GameGroup
            title="EGT"
            viewallLink="/casino/slots?provider=de1c5e79910db4b04ef2fa4823b8f02ba7790c08"
            provider="de1c5e79910db4b04ef2fa4823b8f02ba7790c08"
            isCustom={false}
            template={1}
          />

          <GameGroup
            title="Amusnet"
            viewallLink="/casino/slots?provider=6342a9dcae1a956649e65fc5afa3ffc120917c72"
            provider="6342a9dcae1a956649e65fc5afa3ffc120917c72"
            isCustom={false}
            template={1}
          />
        </div>
      </div>
    </div>
  );
}