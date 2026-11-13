import styles from "./GameCard.module.scss";
import { tGame } from "@/types/tGame";
import { placeholderGameImage } from "@/config/constants";
import { useCallback, useMemo, useState } from "react";
import { Play, Star } from "lucide-react";
import { favoritesGameState } from "@/state/favoritesGameState";
import { apiAddFavoritesGame } from "@/api/favorites/apiAddFavoritesGame";
import { apiDeleteFavoritesGame } from "@/api/favorites/apiDeleteFavoritesGame";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { providerState } from "@/state/providerState";
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
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [favPending, setFavPending] = useState(false);
  const tToast = useTranslations("ToastMessages");
  const tCard = useTranslations("GameCard");
  const bonusAvailable = isBonusAvailableForGame(data);
  void bonusAvailabilityState.value;

  const providerName = providerState.value.map[data.providerId]?.name;
  const isLoggedIn = !!userState.value?.id;

  const isFavorite = useMemo(
    () => favoritesGameState.value.some((game) => game.id === data.id),
    [favoritesGameState.value, data.id],
  );

  const toggleFavorite = useCallback(async () => {
    if (favPending) return;
    setFavPending(true);
    const wasFavorite = isFavorite;
    const previous = favoritesGameState.value;

    // Optimistic update — feels instant, rolled back on failure
    favoritesGameState.value = wasFavorite
      ? previous.filter((game) => game.id !== data.id)
      : [...previous, data];

    try {
      if (wasFavorite) {
        await apiDeleteFavoritesGame(data.id);
      } else {
        await apiAddFavoritesGame(data.id);
      }
      toast.success(
        wasFavorite
          ? tToast("success.removed_from_favorites")
          : tToast("success.added_to_favorites"),
      );
    } catch (ex) {
      console.error(ex);
      favoritesGameState.value = previous;
      toast.error(tToast("error.something_wrong"));
    } finally {
      setFavPending(false);
    }
  }, [favPending, isFavorite, data, tToast]);

  const imgSrc = imgError
    ? placeholderGameImage
    : useImgCustom || FORCE_CUSTOM_IMAGE_GAME_IDS.has(data.id)
      ? data.img_custom || data.img || placeholderGameImage
      : data.img || placeholderGameImage;

  return (
    <div className={styles.cardRoot}>
      <Link
        scrollToTop={true}
        className={styles.game}
        href={data.href || `/game/${data.id}`}
        preventDefaultOnClick={false}
        stopPropagationOnClick={false}
        aria-label={providerName ? `${data.name} — ${providerName}` : data.name}
        onClick={(e) => {
          if (!requireLogin()) {
            e.preventDefault();
            return;
          }
          onClick?.();
        }}
      >
        <div className={styles.media}>
          {!imgLoaded && (
            <>
              <img
                src={placeholderGameImage}
                aria-hidden="true"
                alt=""
                className={styles.placeholder}
              />
              <span className={styles.shimmer} aria-hidden="true" />
            </>
          )}
          <img
            className={`${styles.image} ${imgLoaded ? styles.imageLoaded : ""}`}
            src={imgSrc}
            alt={data.name || data.id}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgError(true);
              setImgLoaded(true);
            }}
          />

          {/* Hover / focus layer */}
          <div className={styles.overlay} aria-hidden="true">
            <span className={styles.playButton}>
              <Play size={20} fill="currentColor" strokeWidth={0} />
            </span>
            <div className={styles.info}>
              <span className={styles.title}>{data.name}</span>
              {providerName && <span className={styles.provider}>{providerName}</span>}
            </div>
          </div>

          <span
            className={`${styles.badge} ${bonusAvailable ? styles.badgeBonus : styles.badgeCash}`}
          >
            <span className={styles.badgeDot} />
            {bonusAvailable
              ? tCard("bonus_available", undefined, "Bonus")
              : tCard("cash_only", undefined, "Cash only")}
          </span>
        </div>
      </Link>

      {isLoggedIn && (
        <button
          type="button"
          className={`${styles.favorite} ${isFavorite ? styles.favoriteActive : ""}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          disabled={favPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void toggleFavorite();
          }}
        >
          <Star size={15} strokeWidth={2.25} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
}
