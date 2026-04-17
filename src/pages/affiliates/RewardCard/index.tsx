import styles from "./RewardCard.module.scss";
import { useTranslations } from "@/context/I18nContext";

interface IRewardCardProps {
  title: string;
  value: string;
  color: string;
}

export default function RewardCard({ title, value, color }: IRewardCardProps) {
  const t = useTranslations("Affiliate");

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t(title)}</div>
      <div className={styles.value} style={{ color }}>
        {value}
      </div>
    </div>
  );
}
