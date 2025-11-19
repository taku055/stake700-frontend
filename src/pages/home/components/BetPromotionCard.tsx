import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";

interface BetPromotionCardProps {
  image: string;
  content: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export const BetPromotionCard: FunctionalComponent<BetPromotionCardProps> = ({
  image,
  content,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <img
        src={image}
        alt={content}
        className="w-full h-auto object-cover rounded-lg"
      />
      <p className="text-white text-sm">{content}</p>
      <Button
        color="primary"
        size="sm"
        onPress={onButtonClick}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
};

