import { tGame } from "@/types/tGame";
import { userState } from "@/state/userState";
import { sessionHydratedState } from "@/state/sessionHydratedState";
import { Spinner } from "@heroui/spinner";
import { apiStartGame } from "@/api/game/apiStartGame";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, placeholderGameImage } from "@/config/constants";
import styles from "./GamePlay.module.scss";
import { MdFullscreen, MdFullscreenExit, MdRefresh } from "react-icons/md";
import { loginOpenedState } from "@/state/loginOpenedState";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import { localeState } from "@/state/localeState";
import { currencyState } from "@/state/currencyState";
import { eTransactionCurrency } from "@/types/tTransaction";
import ConfirmModal from "./ConfirmModal";

interface IGamePlayProps {
  game?: tGame;
}

export default function GamePlay({ game }: IGamePlayProps) {
  const [iframeSrc, setIframeSrc] = useState<string>();
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("GamePlay");
  const [htmlCode, setHtmlCode] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playInFlightRef = useRef(false);
  const launchedGameIdRef = useRef<string | null>(null);
  const [currency, setCurrency] = useState<eTransactionCurrency>(
    currencyState.value.unit
  );
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const userId = userState.value?.id;
  const sessionReady = sessionHydratedState.value;

  const clearInjectedGame = useCallback(() => {
    if (containerRef.current) {
      containerRef.current
        .querySelectorAll('[data-game-injected="true"]')
        .forEach((el) => el.remove());
    }
    document
      .querySelectorAll('script[data-game-injected="true"]')
      .forEach((script) => script.remove());
    setHtmlCode("");
  }, []);

  const exitCssFullscreen = useCallback(() => {
    setFullscreen(false);
    document.documentElement.classList.remove("game-css-fullscreen");
    document.body.classList.remove("game-css-fullscreen");
  }, []);

  const enterCssFullscreen = useCallback(() => {
    setFullscreen(true);
    document.documentElement.classList.add("game-css-fullscreen");
    document.body.classList.add("game-css-fullscreen");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const root = rootRef.current;
    if (!root) return;

    // Prefer real Fullscreen API when available (desktop / Android)
    const anyRoot = root as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    const activeFs =
      document.fullscreenElement || doc.webkitFullscreenElement || null;

    if (activeFs) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          await doc.webkitExitFullscreen?.();
        }
      } catch {
        // fall through to CSS exit
      }
      exitCssFullscreen();
      return;
    }

    if (fullscreen) {
      exitCssFullscreen();
      return;
    }

    try {
      if (root.requestFullscreen) {
        await root.requestFullscreen();
        setFullscreen(true);
        return;
      }
      if (anyRoot.webkitRequestFullscreen) {
        await anyRoot.webkitRequestFullscreen();
        setFullscreen(true);
        return;
      }
    } catch {
      // iOS / denied — CSS fallback below
    }

    enterCssFullscreen();
  }, [fullscreen, enterCssFullscreen, exitCssFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      const active =
        document.fullscreenElement || doc.webkitFullscreenElement || null;
      if (!active) {
        exitCssFullscreen();
      } else if (active === rootRef.current) {
        setFullscreen(true);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) {
        void toggleFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange as EventListener);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFsChange as EventListener
      );
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("game-css-fullscreen");
      document.body.classList.remove("game-css-fullscreen");
    };
  }, [fullscreen, toggleFullscreen, exitCssFullscreen]);

  useEffect(() => {
    if (currencyState.value.unit !== currency && isPlaying) {
      setShowReloadModal(true);
    }
  }, [currencyState.value.unit, isPlaying, currency]);

  const onPlay = useCallback(
    async (opts?: { forceReload?: boolean }) => {
      if (!sessionHydratedState.value) {
        return;
      }
      if (!userId) {
        console.error("User not logged in");
        loginOpenedState.value = true;
        return;
      }
      if (!game?.id) {
        return;
      }
      if (playInFlightRef.current) {
        return;
      }

      playInFlightRef.current = true;
      setCurrency(currencyState.value.unit);
      setLoading(true);
      setShowReloadModal(false);

      // Force a clean slate so reloads never reuse a stale iframe/HTML session
      if (opts?.forceReload || isPlaying) {
        clearInjectedGame();
        setIframeSrc(undefined);
        setIframeKey((k) => k + 1);
      }

      let nextIframeSrc = "";

      try {
        const session = await apiStartGame({
          gameId: game.id,
          isMobile,
          language: localeState.value || "en",
          currency: currencyState.value.unit,
        });

        if (typeof session === "string") {
          clearInjectedGame();

          if (game.gameSource === "SOFT") {
            if (session.startsWith("1,")) {
              const html = session.substring(2);
              setHtmlCode(html);

              const temp = document.createElement("div");
              temp.innerHTML =
                html + `<script>console.log("Game script loaded");</script>`;

              Array.from(temp.childNodes).forEach((node) => {
                if (node.nodeName.toLowerCase() === "script") {
                  const scriptTag = document.createElement("script");
                  scriptTag.setAttribute("data-game-injected", "true");
                  for (const attr of (node as any).attributes ?? []) {
                    scriptTag.setAttribute(attr.name, attr.value);
                  }
                  scriptTag.text = node.textContent ?? "";
                  document.body.appendChild(scriptTag);
                } else {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    (node as HTMLElement).setAttribute(
                      "data-game-injected",
                      "true"
                    );
                  }
                  containerRef.current?.appendChild(node);
                }
              });
              setIsPlaying(true);
            } else {
              const temp = session.split(",");
              throw new Error(temp[temp.length - 1]);
            }
          } else if (game.gameSource === "GSS") {
            setHtmlCode(session);
            const temp = document.createElement("div");
            temp.innerHTML = session;
            Array.from(temp.childNodes).forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                (node as HTMLElement).setAttribute(
                  "data-game-injected",
                  "true"
                );
              }
              containerRef.current?.appendChild(node);
            });
            setIsPlaying(true);
          }
        } else {
          nextIframeSrc = session.url;
          setIsPlaying(true);
        }

        setIframeSrc(nextIframeSrc || undefined);
        if (nextIframeSrc) {
          setIframeKey((k) => k + 1);
        }
        launchedGameIdRef.current = game.id;
      } catch (error) {
        if (String(error).toLowerCase().includes("restricted")) {
          toast.error(t("restricted-error"));
        } else {
          toast.error(t("play-error"));
        }
        console.error("Error starting game:", error);
      } finally {
        setLoading(false);
        playInFlightRef.current = false;
      }
    },
    [
      game?.id,
      game?.gameSource,
      isMobile,
      userId,
      t,
      isPlaying,
      clearInjectedGame,
    ]
  );

  // Reset launch bookkeeping when navigating to a different game
  useEffect(() => {
    launchedGameIdRef.current = null;
    setIsPlaying(false);
    setIframeSrc(undefined);
    clearInjectedGame();
    exitCssFullscreen();
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
  }, [game?.id, clearInjectedGame, exitCssFullscreen]);

  // Auto-launch once per game/session — do not re-run on currency changes
  useEffect(() => {
    if (!game?.id) return;
    if (!sessionReady) return;
    if (!userId) return;
    if (launchedGameIdRef.current === game.id) return;
    void onPlay({ forceReload: true });
    // intentionally omit onPlay / currency — currency reload is modal-driven
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id, userId, sessionReady]);

  const onConfirmCurrencyReload = useCallback(() => {
    void onPlay({ forceReload: true });
  }, [onPlay]);

  const onDismissCurrencyReload = useCallback(() => {
    // Revert selection tracker so modal does not immediately re-open
    setCurrency(currencyState.value.unit);
    setShowReloadModal(false);
  }, []);

  const onRefreshGame = useCallback(() => {
    void onPlay({ forceReload: true });
  }, [onPlay]);

  return (
    <div
      ref={rootRef}
      className={`${styles.container}${fullscreen ? ` ${styles.fullscreen}` : ""}`}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: htmlCode ? "block" : "none",
        }}
        ref={containerRef}
      />

      {!htmlCode &&
        (iframeSrc ? (
          <iframe
            key={`${iframeSrc}-${iframeKey}`}
            src={iframeSrc}
            className="w-full h-full absolute left-0 top-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            style={{ border: "none" }}
          />
        ) : (
          <>
            {(game?.img_custom || game?.img_vertical || game?.img) && (
              <img
                src={
                  game?.img_custom ||
                  game?.img_vertical ||
                  game?.img ||
                  placeholderGameImage
                }
                className="w-full h-full object-cover"
                alt={game?.name}
              />
            )}
            <div className="w-full h-full bg-[#0E1224E5] top-[0px] absolute" />
            {(loading || !game?.name) && (
              <div className="absolute inset-0 z-[3] flex items-center justify-center">
                <Spinner
                  classNames={{ wrapper: "w-14 h-14" }}
                  variant="gradient"
                  color="success"
                />
              </div>
            )}
          </>
        ))}

      {loading && (iframeSrc || htmlCode) && (
        <div className="absolute inset-0 z-[4] flex items-center justify-center bg-[#0E1224A0] pointer-events-none">
          <Spinner
            classNames={{ wrapper: "w-14 h-14" }}
            variant="gradient"
            color="success"
          />
        </div>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={() => void toggleFullscreen()}
          title={
            fullscreen ? t("Exit Full Screen") : t("Full Screen Mode")
          }
          aria-label={
            fullscreen ? t("Exit Full Screen") : t("Full Screen Mode")
          }
        >
          {fullscreen ? (
            <MdFullscreenExit size={24} />
          ) : (
            <MdFullscreen size={24} />
          )}
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={onRefreshGame}
          disabled={loading || !userId}
          title={t("Refresh Game")}
          aria-label={t("Refresh Game")}
        >
          <MdRefresh size={22} className={loading ? styles.spinning : undefined} />
        </button>
      </div>

      <ConfirmModal
        isOpen={showReloadModal}
        onClose={onDismissCurrencyReload}
        onConfirm={onConfirmCurrencyReload}
        currentCurrency={currency}
        newCurrency={currencyState.value.unit}
      />
    </div>
  );
}
