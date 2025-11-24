import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";

interface PromotionCardProps {
  title: string;
  description?: string | null;
  promotionId?: number;
  image: string;
  onClick?: () => void;
}

export default function PromotionCard({
  title,
  description,
  promotionId,
  image,
  onClick,
}: PromotionCardProps) {
  const { handleNavigate } = useAffiliateNavigation();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (promotionId) {
      // Navigate to article page with promotion ID
      handleNavigate(`/promotions/${promotionId}`);
    }
  };
  return (
    <div
      className="flex flex-col overflow-hidden rounded-sm cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full hover:scale-105 transition-all duration-300 z-5 rounded-sm"
      />
    </div>
  );
}
