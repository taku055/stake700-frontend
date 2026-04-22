import { FunctionalComponent } from "preact";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

interface PromotionInfoCardProps {
  title: string;
  image: string;
  context: string;
}

export const PromotionInfoCard: FunctionalComponent<PromotionInfoCardProps> = ({
  title,
  image,
  context,
}) => {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  return (
    <div 
      className={`flex flex-col gap-4 bg-[var(--bar-background-color)] rounded-lg p-12 items-center`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h3 className="text-[var(--primary-color)] text-2xl font-semibold text-center uppercase">{title}</h3>
      <img
        src={image}
        alt={title}
        className="w-full h-auto object-fit rounded-lg hover:scale-105 transition-all duration-300"
      />
      <p className={`text-[var(--primary-color)] text-md ${
        isRTL ? "text-right" : "text-left"
      }`}>{context}</p>
    </div>
  );
};

