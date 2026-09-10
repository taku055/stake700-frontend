import styles from "./GameCard.module.scss";
import { tGame } from "@/types/tGame";
import { placeholderGameImage } from "@/config/constants";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { FaStar } from "react-icons/fa";
import { favoritesGameState } from "@/state/favoritesGameState";
import { apiAddFavoritesGame } from "@/api/favorites/apiAddFavoritesGame";
import { apiDeleteFavoritesGame } from "@/api/favorites/apiDeleteFavoritesGame";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { requireLogin } from "@/helpers/requireAuth";
import { Link } from "../common";
import { isBonusAvailableForGame } from "@/helpers/isBonusAvailableForGame";
import { bonusAvailabilityState } from "@/state/bonusAvailabilityState";

interface GameCardProps {
  data: tGame;
  onClick?: () => void;
  useImgCustom?: boolean;
}

const FORCE_CUSTOM_IMAGE_GAME_IDS = new Set<string>([
  "129614017fcaf209c4782e7a41b742f6e702bd68",
  "78a1587cc5cb4772c4ff0ae7cda6028d8e807dc1",
  "a49e5e628df01b1dcfb6a3d121feb9835b97c1e9",
  "daa5bc031cb921242db100c4b36e57d5da02e64b",
  "71d8c9f3e750c39c19b6122787f13113baa8e4fd",
  "5e56d2330f1e66863bd953db53f85b4c5476d699",
  "440133d570de1b35b304f4102eddbafb20346463",
  "85bfaeb077d40c9c5a414a0a145368f9b222ca9b",
  "36eaa9fa999c9814f16812af80d59a69c193a0d7",
  "5cefdc317ea814dfb1ebc3d00730877fc8002f6b",
  "43ea56ac9bb8a716029bda902cd54dbdafdf45ff",
  "12ebb9302483f783aacf034844208e33dd2136b1",
  "d3b96e5a8d48e637c6bf453c9eb539322cdbbf85",
  "4756da36fd6774a76012328d842b6ccd01ba6c97",
]);

export default function GameCard({
  data,
  onClick,
  useImgCustom = false,
}: GameCardProps) {
  const [isTouchLike, setIsTouchLike] = useState(false);
  const [open, setOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tToast = useTranslations("ToastMessages");
  const tCard = useTranslations("GameCard");
  const bonusAvailable = isBonusAvailableForGame(data);
  void bonusAvailabilityState.value;

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

  // Desktop: open overlay on hover (see showOverlap). Mobile: image only (overlap/star hidden in SCSS).
  const onCardPointerEnter = () => {
    if (!isTouchLike) setOpen(true);
  };
  const onCardPointerLeave = () => {
    if (!isTouchLike) setOpen(false);
  };

  const isFavorite = useMemo(
    () => favoritesGameState.value.some((game) => game.id === data.id),
    [favoritesGameState.value, data.id],
  );

  const setFavorite = useCallback(
    async (id: string) => {
      try {
        if (isFavorite) {
          await apiDeleteFavoritesGame(id);
          favoritesGameState.value = favoritesGameState.value.filter(
            (game) => game.id !== id,
          );
        } else {
          await apiAddFavoritesGame(id);
          favoritesGameState.value = [...favoritesGameState.value, data];
        }

        toast.success(
          isFavorite
            ? tToast("success.removed_from_favorites")
            : tToast("success.added_to_favorites"),
        );
      } catch (ex) {
        console.error(ex);
        toast.error(tToast("error.something_wrong"));
      }
    },
    [isFavorite, tToast, favoritesGameState],
  );

  const imgSrc = imgError
    ? placeholderGameImage
    : (useImgCustom || FORCE_CUSTOM_IMAGE_GAME_IDS.has(data.id))
        ? data.img_custom || data.img || placeholderGameImage
        : data.img || placeholderGameImage;

  const showOverlap = open;

  return (
    <div
      ref={ref}
      className={styles.cardRoot}
      onPointerEnter={onCardPointerEnter}
      onPointerLeave={onCardPointerLeave}
    >
      <Link
        scrollToTop={true}
        className={`${styles.game} ${showOverlap ? styles.is_open : ""}`}
        href={data.href || `/game/${data.id}`}
        preventDefaultOnClick={false}
        stopPropagationOnClick={false}
        onClick={(e) => {
          if (!requireLogin()) {
            e.preventDefault();
            return;
          }
          onClick?.();
        }}
      >
        <div className={styles.imgWrapper}>
          {/* Placeholder shown until image loads */}
          {!imgLoaded && (
            <img
              src={placeholderGameImage}
              aria-hidden="true"
              className={styles.gamePlaceholderImage}
            />
          )}
          <img
            className={styles.gameImage}
            src={imgSrc}
            alt={data.name || data.id}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgError(true);
              setImgLoaded(true); // still show fallback
            }}
            style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s" }}
          />
          <span
            className={`${styles.bonusBadge} ${
              bonusAvailable ? styles.bonusOn : styles.bonusOff
            }`}
          >
            {bonusAvailable
              ? tCard("bonus_available", undefined, "Bonus")
              : tCard("cash_only", undefined, "Cash only")}
          </span>
          {userState.value?.id && (
            <FaStar
              size={20}
              color={isFavorite ? "yellow" : "white"}
              className={styles.star}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void setFavorite(data.id);
              }}
            />
          )}
          <div className={styles.overlap}>
            <span title={data.providerId} className={styles.text}>
              {data.name}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
