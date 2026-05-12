import { tGame } from "@/types/tGame";
import { userState } from "@/state/userState";
import { sessionHydratedState } from "@/state/sessionHydratedState";
import { Spinner } from "@heroui/spinner";
import { apiStartGame } from "@/api/game/apiStartGame";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, placeholderGameImage } from "@/config/constants";
import styles from "./GamePlay.module.scss";
import { MdFullscreen } from "react-icons/md";
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
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("GamePlay");
  const [htmlCode, setHtmlCode] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [currency, setCurrency] = useState<eTransactionCurrency>(
    currencyState.value.unit
  );
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const userId = userState.value?.id;
  const sessionReady = sessionHydratedState.value;

  useEffect(() => {
    if (currencyState.value.unit !== currency && isPlaying) {
      setShowReloadModal(true);
    }
  }, [currencyState.value.unit, isPlaying]);

  const onPlay = useCallback(async () => {
      if (!sessionHydratedState.value) {
        return;
      }
      if (!userId) {
        console.error("User not logged in");
        loginOpenedState.value = true;
        return;
      }

      setCurrency(currencyState.value.unit);
      setLoading(true);
      let iframeSrc1 = "";

      try {
        const session = await apiStartGame({
          gameId: game?.id || "",
          isMobile,
          language: localeState.value || "en",
          currency: currencyState.value.unit,
        });

        if (typeof session === "string") {
          console.log({ game });
          // cleanup old html nodes and script
          if (containerRef.current) {
            containerRef.current
              .querySelectorAll('[data-game-injected="true"]')
              .forEach((el) => el.remove());
          }

          document
            .querySelectorAll('script[data-game-injected="true"]')
            .forEach((script) => script.remove());

          if (game?.gameSource === "SOFT") {
            if (session.startsWith("1,")) {
              const html = session.substring(2);
              setHtmlCode(html);

              // Create a temporary container and append HTML
              const temp = document.createElement("div");
              temp.innerHTML =
                html + `<script>console.log("Game script loaded");</script>`;

              Array.from(temp.childNodes).forEach((node) => {
                if (node.nodeName.toLowerCase() === "script") {
                  const scriptTag = document.createElement("script");
                  scriptTag.setAttribute("data-game-injected", "true");
                  // Copy attributes (optional)
                  for (const attr of (node as any).attributes ?? []) {
                    scriptTag.setAttribute(attr.name, attr.value);
                  }
                  // Copy content
                  scriptTag.text = node.textContent ?? "";
                  document.body.appendChild(scriptTag); // Script now runs
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
          } else if (game?.gameSource === "GSS") {
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
          iframeSrc1 = session.url;
          setIsPlaying(true);
        }

        setIframeSrc(iframeSrc1);
        console.log({ iframeSrc1: iframeSrc1 });
      } catch (error) {
        if (String(error).toLowerCase().includes("restricted")) {
          toast.error(t("restricted-error"));
        } else {
          toast.error(t("play-error"));
        }
        console.error("Error starting game:", error);
      }
      setLoading(false);
    },
    [
      game?.id,
      game?.gameSource,
      isMobile,
      userId,
      t,
      localeState.value,
      currencyState.value.unit,
    ]
  );

  useEffect(() => {
    if (!game?.id) return;
    if (!sessionReady) return;
    void onPlay();
  }, [game?.id, userId, onPlay, sessionReady]);

  return (
    <div
      className={styles.container}
      style={
        fullscreen
          ? {
              position: "fixed",
              left: "0px",
              top: "0px",
              width: "100%",
              height: "100%",
              zIndex: 101,
              borderRadius: "0px",
            }
          : {}
      }
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
            key={iframeSrc}
            src={iframeSrc}
            className="w-full h-full absolute left-0 top-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
      <button
        type="button"
        className="bg-[#0006] p-[6px] rounded-[10px] absolute top-[10px] left-[10px]"
        onClick={() => setFullscreen((p) => !p)}
        title={t("Full Screen Mode")}
      >
        <MdFullscreen size={24} />
      </button>

      <ConfirmModal
        isOpen={showReloadModal}
        onClose={() => setShowReloadModal(false)}
        onConfirm={() => onPlay()}
        currentCurrency={currency}
        newCurrency={currencyState.value.unit}
      />
    </div>
  );
}
