import PromotionCard from "./PromotionCard";
import PromotionDetailModal from "./PromotionDetailModal";
import { bannerState } from "@/state/bannerState";
import { useState } from "preact/hooks";
import { tBanner } from "@/types/tBanner";
import { promotionData } from "./data";
import { tPromotionInformation } from "@/components/PromotionsGroup/data";

export default function PromotionPage() {
  const [selectedPromotion, setSelectedPromotion] = useState<tBanner | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (banner: tBanner) => {
    setSelectedPromotion(banner);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  return (
    <>
      <div className="flex flex-col p-3 gap-3">
        <div className="md:grid md:grid-cols-4 flex flex-col gap-3">
          {promotionData.map((promotion) => (
            <PromotionCard
              key={promotion.title}
              title={promotion.title} 
              description={null}
              image={promotion.image}
            />
          ))}
        </div>
      </div>
      <PromotionDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promotion={selectedPromotion}
      />
    </>
  );
}
