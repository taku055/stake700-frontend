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
              title={card.title}
              image={card.image}
              content={card.content}
              buttonText={card.buttonText}
              onButtonClick={() => handleNavigate(card.link)}
            />
          ))}
        </div>
      </div>

      {/* Deposit List Area */}
      <div className="flex flex-col md:flex-row bg-[var(--bar-background-color)] p-6 rounded-md w-full items-center justify-between gap-4">
        <h2 className="text-[var(--primary-color)] text-xl font-semibold">
          <b>{t("Get")}</b> {t("crypto in seconds")}
        </h2>
        <img src="https://tekio.s3.eu-north-1.amazonaws.com/ichancy/others/deposit.svg" alt={t("Deposit Methods")} className="object-fit rounded-md" />
        <Button className="btn !text-[var(--primary-color)]">{t("Buy Crypto")}</Button>
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
