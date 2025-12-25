import { tGame } from "@/types/tGame";
import { userState } from "@/state/userState";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { apiStartGame } from "@/api/game/apiStartGame";
import { useMediaQuery } from "usehooks-ts";
import { BASE_URL, mobileMediaQuery, placeholderGameImage } from "@/config/constants";
import { FaPlay } from "react-icons/fa";
import styles from "./GamePlay.module.scss";
import { MdFullscreen } from "react-icons/md";
import { apiStartGameDemo } from "@/api/game/apiStartGameDemo";
import { loginOpenedState } from "@/state/loginOpenedState";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";
import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import { localeState } from "@/state/localeState";
import { currencyState } from "@/state/currencyState";
import { eTransactionCurrency } from "@/types/tTransaction";
import ConfirmModal from "./ConfirmModal";
import { ChevronDown } from "lucide-preact";
import { Select, SelectItem } from "@heroui/react";
import { CURRENCY_LIST } from "@/config/constants";

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

  useEffect(() => {
    if (currencyState.value.unit !== currency && isPlaying) {
      setShowReloadModal(true);
    }
  }, [currencyState.value.unit, isPlaying]);

  const onPlay = useCallback(
    async (demo: boolean) => {
      if (!userState.value?.id) {
        console.error("User not logged in");
        loginOpenedState.value = true;
        return;
      }

      setCurrency(currencyState.value.unit);
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
            setIsPlaying(true);
          } catch (ex) {
            console.error(ex);
          }
        } else {
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
            //
            iframeSrc1 = session.url;
            setIsPlaying(true);
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
    [
      game?.id,
      isMobile,
      userState.value?.id,
      t,
      containerRef.current,
      localeState.value,
      currencyState.value.unit,
    ]
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
            <div className="w-full h-full bg-[#0E1224E5] top-[0px] absolute" />
            <div className="w-full  absolute left-[0px]  my-auto flex flex-col gap-[18px] z-[3] items-center justify-center">
              <div className="flex gap-2 h-[24px] w-full items-center justify-center mb-2">
                <span className="text-[14px] leading-[20px] text-[#B1BAD3] font-weight-semibold">{t("Balance displayed in")}</span>
                {/* <Button className="">
                  <img src={`${BASE_URL}/images/tokens/usd.png`} alt="USD" className="w-5 h-5" />
                  <span className="text-[14px] leading-[20px] text-[#B1BAD3] font-weight-semibold">USD</span>
                  <ChevronDown />
                </Button> */}
                <Dropdown backdrop="blur" className="flex h-[full] justify-center items-center py-3 px-5 overflow-y-auto bg-[var(--bar-background-color)]">
                  <DropdownTrigger>
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
                      {/* Balance Amount */}
                      <img src={`${BASE_URL}/images/currencies/${currencyState.value.code}.png`} alt="Currency" className="w-6 h-6" />
                      <span className="text-white text-[16px] font-medium">
                        {currencyState.value.code.toUpperCase()}
                      </span>

                      {/* Currency Icon (Orange Circle with Bitcoin Symbol) */}

                      {/* Dropdown Chevron */}
                      <ChevronDown size={14} color="white" />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label={t("Select Currency")} variant="flat" className="bg-[var(--bar-background-color)]">
                    {CURRENCY_LIST.map((currency) => (
                      <DropdownItem
                        key={currency.unit}
                        value={currency.unit}
                        onPress={() => {
                          currencyState.value = currency;
                          window.localStorage.setItem(
                            "currency",
                            JSON.stringify(currency)
                          );
                          setCurrency(currency.unit);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <img src={`${BASE_URL}/images/currencies/${currency.code}.png`} alt="Currency" className="w-6 h-6" />
                          <span className="font-semibold">{currency.code.toUpperCase()}</span>
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex gap-2 h-[24px] w-full items-center justify-center p-2">
                {game?.demo && (
                  <>
                    <Button
                      className="py-2 px-4 text-[#FFFFFFB7] bg-[var(--background-secondary)]"
                      onPress={() => onPlay(true)}
                      isLoading={loading || !game?.name}
                    >
                      {t("fun-play")}
                    </Button>
                  </>
                )}
                <Button
                  className="py-2 px-4 bg-[var(--green-color)] text-[#05080A]"
                  onPress={() => onPlay(false)}
                  isLoading={loading || !game?.name}
                >
                  {t("Real play")}
                </Button>
              </div>
            </div>
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
        onConfirm={() => onPlay(false)}
        currentCurrency={currency}
        newCurrency={currencyState.value.unit}
      />
    </div>
  );
}
