import styles from "./GameCard.module.scss";
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

interface GameCardProps {
  data: tGame;
}

export default function GameCard({ data }: GameCardProps) {
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
    () => favoritesGameState.value.some((game) => game.id === data.id),
    [favoritesGameState.value, data.id]
  );

  const setFavorite = useCallback(
    async (id: string) => {
      try {
        if (isFavorite) {
          await apiDeleteFavoritesGame(id);
          favoritesGameState.value = favoritesGameState.value.filter(
            (game) => game.id !== id
          );
        } else {
          await apiAddFavoritesGame(id);
          favoritesGameState.value = [...favoritesGameState.value, data];
        }

        toast.success(
          isFavorite
            ? tToast("success.removed_from_favorites")
            : tToast("success.added_to_favorites")
        );
      } catch (ex) {
        console.error(ex);
        toast.error(tToast("error.something_wrong"));
      }
    },
    [isFavorite, tToast, favoritesGameState]
  );

  return (
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
          src={data.img_custom || data.img || placeholderGameImage}
          fallbackSrc={placeholderGameImage}
          alt={data.id}
          classNames={{ wrapper: "w-full h-full" }}
          style={{ maxWidth: "unset" }}
          loading="lazy"
          radius="none"
        />
        <div className={styles.overlap}>
          <span title={data.providerId} className={styles.text}>
            {data.name}
          </span>
          {userState.value?.id && (
            <FaStar
              size={20}
              color={isFavorite ? "yellow" : "white"}
              className={styles.star}
              onClick={() => setFavorite(data.id)}
            />
          )}
          <Link scrollToTop={true} className={styles.play} href={`/game/${data.id}`}>
            <FaPlay size={24} color="white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
