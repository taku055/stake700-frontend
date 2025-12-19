import { Image } from "@heroui/react";
import styles from "./PromotionCard.module.scss";
import { tPromotionInformation } from "@/components/PromotionsGroup/data";
import { useTranslations } from "@/context/I18nContext";
import { Link } from "../common";

export default function PromotionCard({
  title,
  description,
  image,
  label,
  readMoreLink,
}: tPromotionInformation) {
  const t = useTranslations("PromotionCard");

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {label && (
          <div className={styles.label}>{label}</div>
        )}
        <h3 className={styles.title}>{ title}</h3>
        <p className={styles.description}>{t(description)}</p>
        {readMoreLink && (
          <Link href={readMoreLink} className={styles.readMore}>
            Read More
          </Link>
        )}
      </div>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          classNames={{ wrapper: "w-full h-full", img: "w-full h-full object-cover" }}
          loading="lazy"
          radius="none"
        />
      </div>
    </div>
  );
}
