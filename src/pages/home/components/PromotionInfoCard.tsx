import { FunctionalComponent } from "preact";

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
  return (
    <div className="flex flex-col gap-4 bg-[var(--bar-background-color)] rounded-lg p-12 items-center">
      <h3 className="text-[var(--primary-color)] text-2xl font-bold text-center uppercase">{title}</h3>
      <img
        src={image}
        alt={title}
        className="w-full h-auto object-fit rounded-lg hover:scale-105 transition-all duration-300"
      />
      <p className="text-[var(--primary-color)] text-md">{context}</p>
    </div>
  );
};

