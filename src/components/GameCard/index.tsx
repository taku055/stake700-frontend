import styles from "./GameCard.module.scss";
import { tGame } from "@/types/tGame";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { routes } from "@/config/routes";
import { accentStyle, providerAccent, providerInitials } from "@/components/ProviderCard";

interface GameCardProps {
  data: tGame;
  onClick?: () => void;
  useImgCustom?: boolean;
  /**
   * "card" (default): fixed-ratio artwork with the name and provider underneath.
   * "tile": artwork fills its container (fixed-size slots); name shows on hover.
   */
  variant?: "card" | "tile";
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

export default function GameCard({ data, onClick, useImgCustom = false, variant = "card" }: GameCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [favPending, setFavPending] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const tToast = useTranslations("ToastMessages");
  const tCard = useTranslations("GameCard");

  const providerName = providerState.value.map[data.providerId]?.name;
  const isLoggedIn = !!userState.value?.id;
  const accent = providerName ? providerAccent(providerName)[1] : undefined;
  const isTile = variant === "tile";

  const isFavorite = useMemo(
    () => favoritesGameState.value.some((game) => game.id === data.id),
    [favoritesGameState.value, data.id],
  );

  const toggleFavorite = useCallback(async () => {
    // Guests get the login dialog instead
    if (!requireLogin()) return;
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
        wasFavorite ? tToast("success.removed_from_favorites") : tToast("success.added_to_favorites"),
      );
    } catch (ex) {
      console.error(ex);
      favoritesGameState.value = previous;
      toast.error(tToast("error.something_wrong"));
    } finally {
      setFavPending(false);
    }
  }, [favPending, isFavorite, data, tToast]);

  const imgSrc =
    (useImgCustom || FORCE_CUSTOM_IMAGE_GAME_IDS.has(data.id)
      ? data.img_custom || data.img
      : data.img) || "";
  // No artwork (missing or failed to load): draw a branded monogram instead of a stock image.
  const showFallback = imgError || !imgSrc;

  // Server-rendered images often finish loading before hydration, so React never
  // sees their load event — check the element directly on mount / src change.
  // Artwork always fills the frame (object-fit: cover), whatever its shape.
  const handleLoaded = useCallback((_img: HTMLImageElement) => {
    setImgLoaded(true);
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      if (img.naturalWidth > 0) handleLoaded(img);
      else setImgError(true);
    }
  }, [imgSrc, handleLoaded]);

  // 3D tilt + glare that follow the mouse (CSS vars; no re-renders)
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || isTile) return;
    const el = mediaRef.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
    });
  };
  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = mediaRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      className={`${styles.root} ${isTile ? styles.tile : ""}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Link
        scrollToTop={true}
        className={styles.link}
        href={data.href || routes.game(data.id, data.name)}
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
        <div ref={mediaRef} className={styles.media}>
          {showFallback ? (
            <span
              className={styles.fallback}
              style={accentStyle(providerName || data.name)}
              role="img"
              aria-label={providerName ? `${data.name} – ${providerName}` : data.name}
            >
              <span className={styles.fallbackMono}>{providerInitials(data.name)}</span>
            </span>
          ) : (
            <>
              {!imgLoaded && <span className={styles.shimmer} aria-hidden="true" />}
              <img
                ref={imgRef}
                className={`${styles.image} ${imgLoaded ? styles.imageLoaded : ""}`}
                src={imgSrc}
                alt={providerName ? `${data.name} – ${providerName}` : data.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                onLoad={(e) => handleLoaded(e.currentTarget)}
                onError={() => {
                  setImgError(true);
                  setImgLoaded(true);
                }}
              />
            </>
          )}

          {/* Hover / focus layer (pointer devices) */}
          <span className={styles.scrim} aria-hidden="true" />
          <span className={styles.shine} aria-hidden="true" />
          <span className={styles.glare} aria-hidden="true" />
          <span className={styles.play} aria-hidden="true">
            <Play size={14} fill="currentColor" strokeWidth={0} />
            {tCard("play", undefined, "Play")}
          </span>

          {isTile && (
            <span className={styles.tileInfo} aria-hidden="true">
              <span className={styles.name}>{data.name}</span>
              {providerName && <span className={styles.provider}>{providerName}</span>}
            </span>
          )}
          <span className={styles.ring} aria-hidden="true" />
        </div>

        {!isTile && (
          <span className={styles.caption}>
            <span className={styles.name} title={data.name}>
              {data.name}
            </span>
            <span className={styles.provider}>
              {accent && <span className={styles.providerDot} style={{ background: accent }} />}
              {providerName || " "}
            </span>
          </span>
        )}
      </Link>

      <button
        type="button"
        className={`${styles.favorite} ${isFavorite && isLoggedIn ? styles.favoriteActive : ""}`}
        aria-label={isFavorite && isLoggedIn ? tCard("remove_favorite") : tCard("add_favorite")}
        title={isFavorite && isLoggedIn ? tCard("remove_favorite") : tCard("add_favorite")}
        aria-pressed={isLoggedIn ? isFavorite : false}
        disabled={favPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void toggleFavorite();
        }}
      >
        <Star size={15} strokeWidth={2.25} fill={isFavorite && isLoggedIn ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

/** Loading placeholder with the same footprint as a "card" GameCard. */
export function GameCardSkeleton() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.link}>
        <div className={`${styles.media} ${styles.skeletonMedia}`}>
          <span className={styles.shimmer} />
        </div>
        <span className={styles.caption}>
          <span className={styles.skeletonLine} style={{ width: "78%" }} />
          <span className={styles.skeletonLine} style={{ width: "48%", height: 9 }} />
        </span>
      </div>
    </div>
  );
}
