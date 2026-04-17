import { useTranslations } from "@/context/I18nContext";

interface IRewardGuideCardProps {
  title: string;
  no: number;
  description: string;
}

export default function RewardGuideCard({
  title,
  no,
  description,
}: IRewardGuideCardProps) {
  const t = useTranslations("Affiliate");

  return (
    <div className="flex flex-col gap-[13px] h-full">
      <div className="flex font-semibold text-[18px] leading-[27px]">
        <span className="text-[#FFFFFF8E] mr-[4px]">
          {no.toString().padStart(2, "0")}.
        </span>
        <span className="text-[#00cc00]">{t(title)}</span>
      </div>
      <div className="text-[16px] leading-[27px] text-[#FFFFFF8E]">
        {description}
      </div>
    </div>
  );
}
