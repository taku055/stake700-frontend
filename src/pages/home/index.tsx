import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";
import { PromotionSection } from "../casino/PromotionSection";
import { WinnersTabGroup } from "./components/WinnersTabGroup";
import { BetPromotionCard } from "./components/BetPromotionCard";
import { PromotionInfoCard } from "./components/PromotionInfoCard";
import { getBetPromotionCards, getPromotionInfoCards } from "./data";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";

export default function PageComponent() {
  const location = useLocation();
  if (userState.value?.isSuperAgent) {
    location.route("/superagent");
    return null;
  }

  if (userState.value?.isAgent) {
    location.route("/agent");
    return null;
  }

  const t = useTranslations("HomePage");
  const { handleNavigate } = useAffiliateNavigation();
  
  const betPromotionCards = getBetPromotionCards(t);
  const promotionInfoCards = getPromotionInfoCards(t);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Banner on top */}
      <PromotionSection showAppleImage={false} />

      {/* Winners Tab Group */}
      <div className="w-full">
        <WinnersTabGroup />
      </div>

      {/* First Promotion Card Area - with background */}
      <div className="w-full bg-[var(--bar-background-color)] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {betPromotionCards.map((card, index) => (
            <BetPromotionCard
              key={index}
              image={card.image}
              content={card.content}
              buttonText={card.buttonText}
              onButtonClick={() => handleNavigate(card.link)}
            />
          ))}
        </div>
      </div>

      {/* Deposit List Area */}
      <div className="w-full">
        <h2 className="text-white text-xl font-semibold mb-4">
          {t("Deposit Methods") || "Deposit Methods"}
        </h2>
        <div className="bg-[var(--bar-background-color)] p-6 rounded-lg">
          <p className="text-gray-300 text-sm">
            {t("deposit_info") || "Available deposit methods will be displayed here"}
          </p>
          {/* Add deposit list component here */}
        </div>
      </div>

      {/* Second Promotion Card Area - no background on area, cards have background */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotionInfoCards.map((card, index) => (
            <PromotionInfoCard
              key={index}
              title={card.title}
              image={card.image}
              context={card.context}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
