import PromotionCard from "./PromotionCard";
import PromotionDetailModal from "./PromotionDetailModal";
import { bannerState } from "@/state/bannerState";
import { useState } from "preact/hooks";
import { tBanner } from "@/types/tBanner";

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
        <div className="md:grid md:grid-cols-5 flex flex-col gap-3">
          {bannerState.value
            .filter((banner) => banner.type?.includes("promotion"))
            .map((banner) => (
              <PromotionCard
                key={banner?.id}
                title={banner?.buttonTitle || ""}
                description={banner?.description}
                image={banner?.img || ""}
                onClick={() => handleCardClick(banner)}
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
