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
    <div className="flex flex-col gap-3 bg-[var(--bar-background-color)] rounded-lg p-4">
      <h3 className="text-white text-lg font-semibold">{title}</h3>
      <img
        src={image}
        alt={title}
        className="w-full h-auto object-cover rounded-lg"
      />
      <p className="text-gray-300 text-sm">{context}</p>
    </div>
  );
};

