import GameGroup from "@/components/GameGroup";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";
import CategoryImageGroup from "./CategoryImageGroup";
import { PromotionSection } from "../casino/PromotionSection";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

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

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <PromotionSection showAppleImage={false} />
      <div class="w-full flex flex-col items-center justify-center p-2 bg-[radial-gradient(51.05%_1122.32%_at_49%_48%,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0.01)_100%)]">
        <span>AMUSNET</span>
        <span>5,269,064.65 {DEFAULT_CURRENCY_SYMBOL}</span>
      </div>

      <CategoryImageGroup />

      <div className="w-full flex flex-col mt-[20px] gap-[20px]">
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
  );
}
