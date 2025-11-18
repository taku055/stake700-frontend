import { Image } from "@heroui/react";
import styles from "./PromotionCard.module.scss";
import { tPromotionInformation } from "@/components/PromotionsGroup/data";
import { useTranslations } from "@/context/I18nContext";

export default function PromotionCard({
  title,
  description,
  image,
}: tPromotionInformation) {
  const t = useTranslations("PromotionCard");

  return (
    <div className={styles.card}>
      <Image
        src={image}
        alt={title}
        classNames={{ wrapper: "w-full h-full", img: "w-full h-full object-fill" }}
        loading="lazy"
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{t(title)}</h3>
        <p className={styles.description}>{t(description)}</p>
      </div>
    </div>
  );
}
