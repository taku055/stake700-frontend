import styles from "./TrendingCard.module.scss";
import { tGame } from "@/types/tGame";
import { Play } from "lucide-preact";
import { placeholderGameImage } from "@/config/constants";
import { Image } from "@heroui/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { FaPlay, FaStar } from "react-icons/fa";
import { favoritesGameState } from "@/state/favoritesGameState";
import { apiAddFavoritesGame } from "@/api/favorites/apiAddFavoritesGame";
import { apiDeleteFavoritesGame } from "@/api/favorites/apiDeleteFavoritesGame";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { Link } from "../common";

interface TrendingCardProps {
  id: string;
  name: string;
  image: string;
  link: string;
}

export default function TrendingCard({ id, name, image, link }: TrendingCardProps) {
  const [isTouchLike, setIsTouchLike] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tToast = useTranslations("ToastMessages");

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setIsTouchLike(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Desktop: open on hover. Mobile: toggle on tap.
  const onCardPointerEnter = () => {
    if (!isTouchLike) setOpen(true);
  };
  const onCardPointerLeave = () => {
    if (!isTouchLike) setOpen(false);
  };
  const onCardClick = () => {
    if (isTouchLike) setOpen(true);
  };

  const isFavorite = useMemo(
    () => favoritesGameState.value.some((game) => game.id === id),
    [favoritesGameState.value, id]
  );


  return (
    <Link scrollToTop={true} className={styles.play} href={link}>
      <div
        ref={ref}
        className={`${styles.game} ${open ? styles.is_open : ""}`}
        onPointerEnter={onCardPointerEnter}
        onPointerLeave={onCardPointerLeave}
        onClick={onCardClick}
        role="group" // helps screen readers announce nested controls
      >
        <div className={styles.imgWrapper}>
          <Image
            className={styles.gameImage}
            src={image}
            fallbackSrc={placeholderGameImage}
            alt={name}
            classNames={{ wrapper: "w-full h-full" }}
            style={{ maxWidth: "unset" }}
            loading="lazy"
            radius="none"
          />
          {/* <div className={styles.overlap}>
            <span title={data.providerId} className={styles.text}>
              {data.name}
            </span>
            {userState.value?.id && (
              <FaStar
                size={20}
                color={isFavorite ? "yellow" : "white"}
                className={styles.star}
                onClick={() => setFavorite(id)}
              />
            )}
            <Link scrollToTop={true} className={styles.play} href={link}>
              <FaPlay size={24} color="white" />
            </Link>
          </div> */}
        </div>
      </div>
    </Link>

  );
}
