interface PromotionCardProps {
  title: string;
  description?: string | null;
  image: string;
  onClick?: () => void;
}

export default function PromotionCard({
  title,
  description,
  image,
  onClick,
}: PromotionCardProps) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-sm cursor-pointer"
      onClick={onClick}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full hover:scale-105 transition-all duration-300 z-5 rounded-sm"
      />
    </div>
  );
}
