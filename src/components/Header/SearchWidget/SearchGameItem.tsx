import styles from "./SearchGameItem.module.scss";
import { useCallback, useEffect, useState } from "preact/hooks";
import { tGame } from "@/types/tGame";
import { searchWidgetState } from "@/state/searchWidgetState";
import { providerState } from "@/state/providerState";
import { placeholderGameImage } from "@/config/constants";
import { Link } from "@/components/common";

interface SearchGameItemProps {
  data: tGame;
}

export default function SearchGameItem({ data }: SearchGameItemProps) {
  const [imgSrc, setImgSrc] = useState("/images/placeholder-gamecard.png");

  useEffect(() => {
    setImgSrc(data.img_custom || data.img || placeholderGameImage);
  }, [data.img_custom, data.img]);

  const onError = useCallback((e: any) => {
    setImgSrc(placeholderGameImage);
  }, []);

  const onLoad = (e: any) => { };

  const onClickCover = () => {
    if (searchWidgetState.value) {
      searchWidgetState.value = false;
    }
  };

  return (
    <div className={styles.gameWrapper} onClick={onClickCover}>
      <Link scrollToTop={true} className={styles.imgWrapper} href={`/game/${data.id}`}>
        <div className={styles.game}>
          <div className={styles.imgWrapper}>
            <img
              className={styles.gameImage}
              src={imgSrc}
              alt={data.id}
              onError={onError}
              onLoad={onLoad}
            />
          </div>
          <div className={styles.description}>
            <span title={data.providerId}>{data.name}</span>
            <span className="text-[#7F85A3]">
              {" "}
              {providerState.value.map[data.providerId]?.name}{" "}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
