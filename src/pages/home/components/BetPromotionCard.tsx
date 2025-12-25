import { FunctionalComponent } from "preact";
import { Button } from "@heroui/react";
import { RTL_LANGUAGES } from "@/config/constants";
import {localeState} from "@/state/localeState";

interface BetPromotionCardProps {
  title: string;
  image: string;
  content: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export const BetPromotionCard: FunctionalComponent<BetPromotionCardProps> = ({
  title,
  image,
  content,
  buttonText,
  onButtonClick,
}) => {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  return (
    <div className="flex flex-col gap-3 items-center p-8">
      <div className="flex flex-row items-center gap-2">
        <p className="w-full text-center text-2xl font-semibold text-[var(--primary-color)] uppercase">{title}</p>
      </div>
      <img
        src={image}
        alt={content}
        className="w-[75%] h-auto object-fit rounded-lg justify-center items-center hover:scale-105 transition-all duration-300"
      />
      <p className={`text-[var(--primary-color)] text-md ${isRTL ? 'text-right' : 'text-left'}`}>{content}</p>
      <Button
        onPress={onButtonClick}
        className="btn w-full !text-[var(--primary-color)]"
      >
        {buttonText}
      </Button>
    </div>
  );
};

