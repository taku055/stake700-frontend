import { tGame } from "@/types/tGame";
import { userState } from "@/state/userState";
import { Button } from "@heroui/react";
import { apiStartGame } from "@/api/game/apiStartGame";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, placeholderGameImage } from "@/config/constants";
import { FaPlay } from "react-icons/fa";
import styles from "./GamePlay.module.scss";
import { MdFullscreen } from "react-icons/md";
import { apiStartGameDemo } from "@/api/game/apiStartGameDemo";
import { loginOpenedState } from "@/state/loginOpenedState";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { useState, useRef, useCallback } from "preact/hooks";
import { localeState } from "@/state/localeState";

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

  const onPlay = useCallback(
    async (demo: boolean) => {
      if (!userState.value?.id) {
        console.error("User not logged in");
        loginOpenedState.value = true;
        return;
      }

      setLoading(true);
      let iframeSrc1 = "";

      try {
        if (demo) {
          try {
            const session = await apiStartGameDemo({
              gameId: game?.id || "",
              isMobile,
              language: localeState.value || "en",
            });

            iframeSrc1 = session.url;
          } catch (ex) {
            console.error(ex);
          }
        } else {
          const session = await apiStartGame({
            gameId: game?.id || "",
            isMobile,
            language: localeState.value || "en",
          });

          if (typeof session === "string") {
            console.log({ game });
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
                    // Copy attributes (optional)
                    for (const attr of (node as any).attributes ?? []) {
                      scriptTag.setAttribute(attr.name, attr.value);
                    }
                    // Copy content
                    scriptTag.text = node.textContent ?? "";
                    document.body.appendChild(scriptTag); // Script now runs
                  } else {
                    containerRef.current?.appendChild(node);
                  }
                });
              } else {
                const temp = session.split(",");
                throw new Error(temp[temp.length - 1]);
              }
            } else if (game?.gameSource === "GSS") {
              setHtmlCode(session);
              const temp = document.createElement("div");
              temp.innerHTML = session;
              Array.from(temp.childNodes).forEach((node) => {
                containerRef.current?.appendChild(node);
              });
            }
          } else {
            //
            iframeSrc1 = session.url;
          }
        }

        setIframeSrc(iframeSrc1);
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
    [game?.id, isMobile, userState.value?.id, t, containerRef.current, localeState.value]
  );

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
            {(game?.img_custom || game?.img) && (
              <img
                src={game?.img || placeholderGameImage}
                className="w-full h-full object-cover"
                alt={game?.name}
              />
            )}
            <div className="w-full h-full bg-[#000d] top-[0px] absolute" />
            <div className="absolute w-[300px] left-[calc(50%-150px)] top-[calc(50%-22px)] flex gap-[18px] z-[3] justify-center">
              <Button
                className="h-[45px] w-[125px] bg-[var(--primary-color)]"
                onPress={() => onPlay(false)}
                isLoading={loading || !game?.name}
              >
                <FaPlay />
                {t("play")}
              </Button>
              {game?.demo && (
                <>
                  <Button
                    className="h-[45px] w-[125px] text-[#FFFFFFB7]"
                    color="default"
                    onPress={() => onPlay(true)}
                    isLoading={loading || !game?.name}
                  >
                    <FaPlay />
                    {t("fun-play")}
                  </Button>
                </>
              )}
            </div>
          </>
        ))}
      <button
        type="button"
        className="bg-[#0006] p-[6px] rounded-[10px] absolute top-[10px] left-[10px]"
        onClick={() => setFullscreen((p) => !p)}
        title="Full Screen Mode"
      >
        <MdFullscreen size={24} />
      </button>
    </div>
  );
}
