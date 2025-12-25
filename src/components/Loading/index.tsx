import styles from "./Loading.module.scss";
import { Spinner } from "@heroui/spinner";

export default function Loading() {
  return (
    <div className={styles.page_loading_overlay}>
      <Spinner classNames={{ wrapper: "w-[80px] h-[80px]" }} variant="gradient" color="success" />
      <img
        src={`https://tekio.s3.eu-north-1.amazonaws.com/${(
          import.meta.env.VITE_SITE_NAME as string
        ).toLowerCase()}/logo.png`}
        alt="loading"
      />
    </div>
  );
}
